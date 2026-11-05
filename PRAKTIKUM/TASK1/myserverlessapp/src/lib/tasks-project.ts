import type { Database } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Helper: Memastikan task memiliki project_id aktif atau auto-create 'Proyek Utama (General)'
 * Memenuhi konstrain NOT NULL pada kolom tasks.project_id
 */
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

