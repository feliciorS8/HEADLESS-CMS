import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type AuthSuccessResult = {
  user: User;
  supabase: SupabaseClient<Database>;
  token: string;
  error: null;
};

export type AuthFailureResult = {
  user: null;
  supabase: null;
  token: null;
  error: string;
};

export type AuthResult = AuthSuccessResult | AuthFailureResult;

/**
 * Memverifikasi Bearer Token JWT stateless dari header Authorization HTTP.
 * Membangun instance Supabase Client yang diinisialisasi dengan ANON_KEY dan
 * token pengguna sehingga Row Level Security (RLS) PostgreSQL tetap aktif.
 *
 * BATASAN KETAT: Dilarang menggunakan SUPABASE_SERVICE_ROLE_KEY di Route Handler publik!
 */
export async function verifyApiAuth(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization");

  // 1. Validasi keberadaan header Authorization dengan skema Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      user: null,
      supabase: null,
      token: null,
      error: "Header 'Authorization: Bearer <token>' diperlukan untuk mengakses API",
    };
  }

  // 2. Ekstraksi token JWT
  const token = authHeader.substring(7).trim();
  if (!token) {
    return {
      user: null,
      supabase: null,
      token: null,
      error: "Token Bearer tidak boleh kosong",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      user: null,
      supabase: null,
      token: null,
      error: "Konfigurasi Supabase URL atau Anon Key server belum terpasang",
    };
  }

  // 3. Bangun instance Supabase Client dengan header otorisasi Bearer pengguna aktif
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // 4. Verifikasi keabsahan token via getUser(token)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return {
      user: null,
      supabase: null,
      token: null,
      error: "Token invalid atau kedaluwarsa",
    };
  }

  return {
    user,
    supabase,
    token,
    error: null,
  };
}

