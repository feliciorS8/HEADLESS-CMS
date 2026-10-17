"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
