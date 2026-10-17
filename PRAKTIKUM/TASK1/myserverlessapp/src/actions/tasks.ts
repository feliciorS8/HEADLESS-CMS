"use server";

import { revalidatePath } from "next/cache";
import { TaskSchema, type ActionState } from "@/lib/schemas";

export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    priority: formData.get("priority") || "medium",
  };

  const validation = TaskSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi formulir gagal. Periksa kembali input Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  revalidatePath("/tasks");

  return {
    success: true,
    message:
      "Input valid dan halaman tugas diperbarui. Data belum disimpan permanen karena database belum terhubung.",
  };
}
