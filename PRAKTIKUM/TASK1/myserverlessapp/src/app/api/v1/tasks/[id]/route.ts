import { corsHeaders, apiSuccess, apiError } from "@/lib/api-response";
import { verifyApiAuth } from "@/lib/api-auth";
import { taskUpdateSchema } from "@/lib/schemas";
import type { Database } from "@/types/database.types";

type TaskUpdatePayload = Database["public"]["Tables"]["tasks"]["Update"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * CORS Preflight Handler (OPTIONS)
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * GET /api/v1/tasks/[id]
 * Mengambil detail satu tugas berdasarkan ID
 */
export async function GET(request: Request, { params }: RouteContext) {
  // 1. Next.js 16: params bertipe Promise, wajib di-await
  const { id } = await params;

  // 2. Verifikasi Bearer Token JWT stateless
  const auth = await verifyApiAuth(request);
  if (auth.error || !auth.user || !auth.supabase) {
    return apiError(
      auth.error || "Autentikasi gagal",
      "UNAUTHORIZED",
      401
    );
  }

  try {
    const { data, error } = await auth.supabase
      .from("tasks")
      .select(
        "id, title, description, priority, status, project_id, user_id, created_at, updated_at, projects(title)"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return apiError(
        `Gagal mengambil data tugas: ${error.message}`,
        "DATABASE_ERROR",
        500
      );
    }

    if (!data) {
      return apiError(
        `Tugas dengan ID '${id}' tidak ditemukan atau Anda tidak memiliki akses`,
        "NOT_FOUND",
        404
      );
    }

    return apiSuccess(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server internal";
    return apiError(message, "INTERNAL_ERROR", 500);
  }
}

/**
 * PUT /api/v1/tasks/[id]
 * Memperbarui data tugas berdasarkan ID
 */
export async function PUT(request: Request, { params }: RouteContext) {
  // 1. Next.js 16: params bertipe Promise, wajib di-await
  const { id } = await params;

  // 2. Verifikasi Bearer Token JWT stateless
  const auth = await verifyApiAuth(request);
  if (auth.error || !auth.user || !auth.supabase) {
    return apiError(
      auth.error || "Autentikasi gagal",
      "UNAUTHORIZED",
      401
    );
  }

  // 3. Parsing body JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(
      "Format JSON body permintaan tidak valid atau kosong",
      "INVALID_JSON",
      400
    );
  }

  // 4. Validasi parsial via taskUpdateSchema Zod
  const validation = taskUpdateSchema.safeParse(body);
  if (!validation.success) {
    return apiError(
      "Validasi update tugas gagal",
      "VALIDATION_ERROR",
      422,
      validation.error.flatten().fieldErrors
    );
  }

  try {
    // 5. Cek keberadaan tugas terlebih dahulu
    const { data: existingTask, error: fetchError } = await auth.supabase
      .from("tasks")
      .select("id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      return apiError(
        `Gagal memeriksa data tugas: ${fetchError.message}`,
        "DATABASE_ERROR",
        500
      );
    }

    if (!existingTask) {
      return apiError(
        `Tugas dengan ID '${id}' tidak ditemukan`,
        "NOT_FOUND",
        404
      );
    }

    // 6. Siapkan data pembaruan
    const updatePayload: TaskUpdatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (validation.data.title !== undefined) updatePayload.title = validation.data.title;
    if (validation.data.priority !== undefined) updatePayload.priority = validation.data.priority;
    if (validation.data.status !== undefined) updatePayload.status = validation.data.status;
    if (validation.data.project_id !== undefined) updatePayload.project_id = validation.data.project_id;

    // 7. Eksekusi pembaruan
    const { data: updatedTask, error: updateError } = await auth.supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", id)
      .select(
        "id, title, description, priority, status, project_id, user_id, created_at, updated_at"
      )
      .single();

    if (updateError) {
      return apiError(
        `Gagal memperbarui tugas: ${updateError.message}`,
        "DATABASE_ERROR",
        500
      );
    }

    return apiSuccess(updatedTask);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    return apiError(message, "INTERNAL_ERROR", 500);
  }
}

/**
 * DELETE /api/v1/tasks/[id]
 * Menghapus tugas berdasarkan ID (Mendukung Otorisasi Admin vs Member)
 */
export async function DELETE(request: Request, { params }: RouteContext) {
  // 1. Next.js 16: params bertipe Promise, wajib di-await
  const { id } = await params;

  // 2. Verifikasi Bearer Token JWT stateless
  const auth = await verifyApiAuth(request);
  if (auth.error || !auth.user || !auth.supabase) {
    return apiError(
      auth.error || "Autentikasi gagal",
      "UNAUTHORIZED",
      401
    );
  }

  try {
    // 3. Cek profil pengguna untuk menentukan hak akses peran (Role)
    const { data: profile } = await auth.supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle();

    const role = (profile?.role || "member").toLowerCase();

    // 4. Eksekusi penghapusan sesuai otorisasi multi-role
    let deleteQuery = auth.supabase.from("tasks").delete().eq("id", id);

    if (role !== "admin") {
      // Member biasa hanya dapat menghapus tugas miliknya sendiri
      deleteQuery = deleteQuery.eq("user_id", auth.user.id);
    }

    const { error: deleteError } = await deleteQuery;

    if (deleteError) {
      return apiError(
        `Gagal menghapus tugas: ${deleteError.message}`,
        "DATABASE_ERROR",
        500
      );
    }

    return apiSuccess(
      {
        id,
        deleted: true,
        message: "Tugas berhasil dihapus dari sistem",
      },
      undefined,
      200
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server internal";
    return apiError(message, "INTERNAL_ERROR", 500);
  }
}
