"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { ActionState } from "@/lib/schemas";

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function translateAuthError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "Email/NIM atau password salah.";
  }
  if (text.includes("email not confirmed")) {
    return "Akun belum diverifikasi. Pastikan konfirmasi email sudah dilakukan atau nonaktifkan 'Confirm email' di Supabase.";
  }
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "Email ini sudah terdaftar. Silakan langsung masuk.";
  }
  if (text.includes("rate limit")) {
    return "Terlalu banyak percobaan. Harap tunggu beberapa saat.";
  }
  return message || "Terjadi kesalahan pada autentikasi.";
}

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const next = readField(formData, "next") || "/tasks";

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan password wajib diisi.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: translateAuthError(error.message),
    };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/tasks");
}

export async function signupAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const fullName = readField(formData, "fullName");
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const next = readField(formData, "next") || "/tasks";

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan password wajib diisi.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Password minimal 6 karakter.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "Explorer",
        role: "member",
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: translateAuthError(error.message),
    };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/tasks");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

