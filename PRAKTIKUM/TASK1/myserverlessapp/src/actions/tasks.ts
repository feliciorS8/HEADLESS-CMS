"use server";

import { revalidatePath } from "next/cache";
import { taskSchema, type ActionState } from "@/lib/schemas";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Helper: Memastikan task memiliki project_id aktif atau auto-create 'Proyek Utama (General)'
export async function resolveTargetProjectId(
  supabase: SupabaseClient<Database>,
  userId: string,
  customProjectId?: string
): Promise<string> {
  if (customProjectId && customProjectId.trim().length > 0) {
    return customProjectId;
  }

  // Cek apakah pengguna sudah memiliki proyek
  const { data: existingProject } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingProject?.id) {
    return existingProject.id;
  }

  // Jika belum punya, auto-create proyek default 'Proyek Utama (General)'
  const { data: newProject, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title: "Proyek Utama (General)",
      description: "Proyek default untuk penampungan tugas harian",
    })
    .select("id")
    .single();

  if (projectError || !newProject?.id) {
    throw new Error(
      projectError?.message || "Gagal membuat proyek default untuk tugas."
    );
  }

  return newProject.id;
}

// Action: Tambah tugas baru dengan validasi Zod & relasi Supabase
export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Sesi login tidak valid. Silakan login kembali.",
    };
  }

  const rawData = {
    title: formData.get("title"),
    priority: formData.get("priority") || "medium",
    status: formData.get("status") || "pending",
    project_id: formData.get("project_id") || undefined,
  };

  const validation = taskSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi data tugas gagal. Silakan periksa kolom formulir.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const targetProjectId = await resolveTargetProjectId(
      supabase,
      user.id,
      validation.data.project_id
    );

    const { error: insertError } = await supabase.from("tasks").insert({
      title: validation.data.title,
      project_id: targetProjectId,
      user_id: user.id,
      priority: validation.data.priority,
      status: validation.data.status,
    });

    if (insertError) {
      return {
        success: false,
        message: `Gagal menyimpan tugas ke Supabase: ${insertError.message}`,
      };
    }

    revalidatePath("/tasks");

    return {
      success: true,
      message: "Tugas baru berhasil disimpan ke database!",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan sistem.";
    return {
      success: false,
      message,
    };
  }
}

// Action: Hapus tugas dengan otorisasi Multi-Role (Admin vs Member)
export async function deleteTaskAction(id: string): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Akses ditolak: Pengguna belum terautentikasi.",
    };
  }

  // Cek profil user untuk mengetahui role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role || "member").toLowerCase();

  try {
    if (role === "admin") {
      // Admin diizinkan menghapus tugas apa pun
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (deleteError) {
        return {
          success: false,
          message: `Gagal menghapus tugas: ${deleteError.message}`,
        };
      }
    } else {
      // Member hanya diizinkan menghapus tugas miliknya sendiri
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        return {
          success: false,
          message: `Gagal menghapus tugas: ${deleteError.message}`,
        };
      }
    }

    revalidatePath("/tasks");

    return {
      success: true,
      message: "Tugas berhasil dihapus.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus tugas.",
    };
  }
}

// Action: Toggle status tugas antara completed dan pending
export async function toggleTaskStatusAction(
  id: string,
  currentStatus: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Akses ditolak: Pengguna belum terautentikasi.",
    };
  }

  const isCompleted =
    currentStatus.toLowerCase() === "completed" ||
    currentStatus.toLowerCase() === "done";

  const nextStatus = isCompleted ? "pending" : "completed";

  const { error: updateError } = await supabase
    .from("tasks")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    return {
      success: false,
      message: `Gagal memperbarui status tugas: ${updateError.message}`,
    };
  }

  revalidatePath("/tasks");

  return {
    success: true,
    message: `Status tugas berhasil diubah ke ${nextStatus}.`,
  };
}
