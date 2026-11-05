import { corsHeaders, apiSuccess, apiError } from "@/lib/api-response";
import { verifyApiAuth } from "@/lib/api-auth";
import { taskSchema } from "@/lib/schemas";
import { resolveTargetProjectId } from "@/lib/tasks-project";

/**
 * CORS Preflight Handler (OPTIONS)
 * Mengembalikan HTTP 204 No Content dengan header CORS lengkap
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * GET /api/v1/tasks
 * Mengambil daftar tugas milik pengguna dengan pagination dan filter pencarian
 */
export async function GET(request: Request) {
  // 1. Verifikasi Bearer Token JWT stateless
  const auth = await verifyApiAuth(request);
  if (auth.error || !auth.user || !auth.supabase) {
    return apiError(
      auth.error || "Autentikasi gagal",
      "UNAUTHORIZED",
      401
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);

    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const limit = Math.min(50, Math.max(1, isNaN(limitParam) ? 10 : limitParam));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 2. Kueri data tugas dari Supabase dengan filter dan pagination
    let query = auth.supabase
      .from("tasks")
      .select(
        "id, title, description, priority, status, project_id, user_id, created_at, updated_at, projects(title)",
        { count: "exact" }
      );

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return apiError(
        `Gagal mengambil data tugas: ${error.message}`,
        "DATABASE_ERROR",
        500
      );
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return apiSuccess(data ?? [], {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server internal";
    return apiError(message, "INTERNAL_ERROR", 500);
  }
}

/**
 * POST /api/v1/tasks
 * Membuat tugas baru dengan auto-resolve project_id (Relasi 3-Tier)
 */
export async function POST(request: Request) {
  // 1. Verifikasi Bearer Token JWT stateless
  const auth = await verifyApiAuth(request);
  if (auth.error || !auth.user || !auth.supabase) {
    return apiError(
      auth.error || "Autentikasi gagal",
      "UNAUTHORIZED",
      401
    );
  }

  // 2. Parsing body JSON
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

  // 3. Validasi skema via taskSchema Zod
  const validation = taskSchema.safeParse(body);
  if (!validation.success) {
    return apiError(
      "Validasi data tugas gagal",
      "VALIDATION_ERROR",
      422,
      validation.error.flatten().fieldErrors
    );
  }

  try {
    // 4. Auto-resolve project_id agar tidak melanggar konstrain NOT NULL
    const targetProjectId = await resolveTargetProjectId(
      auth.supabase,
      auth.user.id,
      validation.data.project_id
    );

    // 5. Simpan tugas ke tabel public.tasks dengan user_id pengguna aktif
    const { data, error } = await auth.supabase
      .from("tasks")
      .insert({
        title: validation.data.title,
        priority: validation.data.priority,
        status: validation.data.status,
        project_id: targetProjectId,
        user_id: auth.user.id,
      })
      .select(
        "id, title, description, priority, status, project_id, user_id, created_at, updated_at"
      )
      .single();

    if (error) {
      return apiError(
        `Gagal menyimpan tugas: ${error.message}`,
        "DATABASE_ERROR",
        500
      );
    }

    return apiSuccess(data, undefined, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    return apiError(message, "INTERNAL_ERROR", 500);
  }
}

