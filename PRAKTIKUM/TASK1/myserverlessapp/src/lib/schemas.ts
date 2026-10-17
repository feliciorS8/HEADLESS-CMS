import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, "Judul tugas minimal harus 3 karakter")
    .max(100, "Judul tugas maksimal 100 karakter"),
  description: z.string().optional(),
  priority: z
    .enum(["low", "medium", "high"], {
      error: "Pilih prioritas yang valid (low, medium, high)",
    })
    .default("medium"),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};
