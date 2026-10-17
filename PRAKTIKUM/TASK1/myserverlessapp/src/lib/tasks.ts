export type TaskStatus = "in-progress" | "completed";

export type TaskRecord = {
  id: string;
  title: string;
  category: string;
  status: TaskStatus;
  xp: number;
  progress: number;
  updatedLabel: string;
  description: string;
};

export const tasks: TaskRecord[] = [
  {
    id: "1",
    title: "Setup Database PostgreSQL Supabase",
    category: "DATA LAYER",
    status: "completed",
    xp: 150,
    progress: 100,
    updatedLabel: "Selesai hari ini",
    description:
      "Siapkan project Supabase, konfigurasi PostgreSQL, dan verifikasi koneksi aman dari lingkungan server aplikasi.",
  },
  {
    id: "2",
    title: "Rancang Layout Dashboard dengan Shadcn",
    category: "PRODUCT INTERFACE",
    status: "in-progress",
    xp: 200,
    progress: 68,
    updatedLabel: "Diperbarui 2 jam lalu",
    description:
      "Bangun ruang kerja responsif dengan komponen yang konsisten, navigasi yang jelas, dan dukungan tema terang maupun gelap.",
  },
];

export function getTaskById(id: string): TaskRecord | undefined {
  return tasks.find((task) => task.id === id);
}
