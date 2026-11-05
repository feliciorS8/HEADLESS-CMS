import { z } from "zod";

// Schema validasi pembuatan & pengelolaan tugas
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul tugas minimal 3 karakter")
    .max(100, "Judul tugas maksimal 100 karakter"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  project_id: z.string().uuid("Project ID harus berupa UUID valid").optional(),
});

export const taskUpdateSchema = taskSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

// Alias TaskSchema untuk backward compatibility
export const TaskSchema = taskSchema;

// Tipe seragam untuk respons Server Actions
export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};
