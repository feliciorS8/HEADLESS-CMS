import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Trash2,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  LogIn,
  LogOut,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskSearchInput } from "@/components/tasks/task-search-input";
import { AnimatedFilterTabs } from "@/components/tasks/animated-filter-tabs";
import { deleteTaskAction, toggleTaskStatusAction } from "@/actions/tasks";
import { logoutAction } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tables } from "@/types/database.types";

type TasksPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    status?: string;
  }>;
};

type TaskWithProject = Tables<"tasks"> & {
  projects: {
    title: string;
  } | null;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  // Next.js 16: searchParams bertipe Promise, wajib di-await
  const { search, page = "1", status = "all" } = await searchParams;

  const supabase = await createClient();

  // 1. Dapatkan pengguna aktif & profil untuk otorisasi Multi-Role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: "admin" | "member" = "member";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role?.toLowerCase() === "admin") {
      userRole = "admin";
    }
  }

  // 2. Kalkulasi Pagination (10 data per halaman)
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // 3. Kueri data tugas dari Supabase dengan filter pencarian & pagination
  let query = supabase
    .from("tasks")
    .select(
      "id, title, description, priority, status, project_id, user_id, created_at, updated_at, projects(title)",
      { count: "exact" }
    );

  // Filter pencarian judul tugas (case-insensitive)
  if (search && search.trim() !== "") {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  // Filter status tugas
  if (status === "in_progress") {
    query = query.in("status", ["in_progress", "pending", "todo"]);
  } else if (status === "completed") {
    query = query.in("status", ["completed", "done"]);
  }

  // Eksekusi kueri dengan pengurutan terbaru dan range pagination
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const taskRows = (data ?? []) as unknown as TaskWithProject[];

  // Server action wrapper untuk form action dengan return type Promise<void>
  async function handleToggleStatus(taskId: string, currentStatus: string): Promise<void> {
    "use server";
    await toggleTaskStatusAction(taskId, currentStatus);
  }

  async function handleDeleteTask(taskId: string): Promise<void> {
    "use server";
    await deleteTaskAction(taskId);
  }

  // Helper pembuat URL Pagination
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search && search.trim()) {
      params.set("search", search.trim());
    }
    if (status && status !== "all") {
      params.set("status", status);
    }
    params.set("page", String(pageNum));
    return `/tasks?${params.toString()}`;
  };

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Header Dashboard & Otorisasi Role */}
      <section className="space-y-4" aria-labelledby="tasks-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            THE SERVERLESS ODYSSEY
            <span className="text-border">/</span>
            TAHAP 1: MONOLITH WEB
          </div>

          {/* Badge Peran Pengguna (Admin vs Member) & CTA API Tester */}
          <div className="flex items-center gap-3">
            <Badge
              variant={userRole === "admin" ? "default" : "secondary"}
              className="px-3 py-1 text-xs font-medium shadow-xs"
            >
              {userRole === "admin" ? "👑 Admin" : "👤 Member"}
            </Badge>

            <Link
              href="/tasks/api-tester"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FlaskConical className="size-3.5 text-primary" />
              <span>/tasks/api-tester</span>
            </Link>

            {user ? (
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="xs"
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  title={`Masuk sebagai ${user.email ?? "Pengguna"}`}
                >
                  <LogOut className="size-3.5" />
                  <span>Keluar</span>
                </Button>
              </form>
            ) : (
              <Link
                href="/login?next=/tasks"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <LogIn className="size-3.5" />
                <span>Masuk Akun</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-5">
          <div>
            <h1 id="tasks-heading" className="text-3xl font-bold tracking-tight">
              Dashboard Tugas Internal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola daftar tugas berbasis Server Actions, RSC, dan otorisasi pragmatik.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Tugas:{" "}
            <span className="font-semibold text-foreground">{totalCount}</span>
          </div>
        </div>

        {/* Tab Filter Status Beranimasi (Framer Motion layoutId activeFilterPill) */}
        <div className="flex items-center justify-between pt-1">
          <AnimatedFilterTabs currentStatus={status} />
        </div>
      </section>

      {/* Error Banner jika kueri database gagal */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          <span>Gagal memuat tugas dari Supabase: {error.message}</span>
        </div>
      )}

      {/* Konten Utama: Grid Form Tambah & Tabel Tugas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Kolom Kiri: Form Tambah Tugas */}
        <div className="lg:col-span-4">
          <TaskForm />
        </div>

        {/* Kolom Kanan: Pencarian, Tabel Tugas, dan Navigasi Pagination */}
        <div className="space-y-4 lg:col-span-8">
          {/* Bar Kontrol: Kotak Pencarian */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TaskSearchInput placeholder="Cari judul tugas (min. 3 huruf)..." />
            <div className="text-xs text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">
                {taskRows.length}
              </span>{" "}
              dari {totalCount} tugas
            </div>
          </div>

          {/* Tabel Tugas */}
          <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[50px] text-center">Status</TableHead>
                  <TableHead>Judul Tugas</TableHead>
                  <TableHead className="w-[110px]">Prioritas</TableHead>
                  <TableHead className="w-[160px]">Proyek</TableHead>
                  <TableHead className="w-[80px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskRows.length > 0 ? (
                  taskRows.map((task) => {
                    const isCompleted =
                      task.status === "completed" || task.status === "done";
                    const isProgress = task.status === "in_progress";
                    const priority = task.priority || "medium";

                    return (
                      <TableRow key={task.id} className="transition-colors">
                        {/* Kolom Status (Toggle Aksi) */}
                        <TableCell className="text-center">
                          <form
                            action={handleToggleStatus.bind(
                              null,
                              task.id,
                              task.status
                            )}
                          >
                            <button
                              type="submit"
                              title={`Ubah status (saat ini: ${task.status})`}
                              className="inline-flex items-center justify-center rounded-full p-1 transition-transform hover:scale-110 focus:outline-none"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="size-5 text-emerald-500" />
                              ) : isProgress ? (
                                <Clock className="size-5 text-amber-500" />
                              ) : (
                                <Circle className="size-5 text-muted-foreground hover:text-foreground" />
                              )}
                            </button>
                          </form>
                        </TableCell>

                        {/* Kolom Judul & Deskripsi */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <span
                              className={`font-medium ${
                                isCompleted
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Kolom Prioritas */}
                        <TableCell>
                          <Badge
                            variant={
                              priority === "high"
                                ? "destructive"
                                : priority === "medium"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize text-[11px] font-medium"
                          >
                            {priority === "high"
                              ? "Tinggi"
                              : priority === "medium"
                              ? "Sedang"
                              : "Rendah"}
                          </Badge>
                        </TableCell>

                        {/* Kolom Proyek & Tanggal */}
                        <TableCell>
                          <div className="text-xs">
                            <p className="font-medium truncate max-w-[140px]">
                              {task.projects?.title ?? "Proyek Utama"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(task.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </TableCell>

                        {/* Kolom Aksi Hapus */}
                        <TableCell className="text-right">
                          {userRole === "admin" || (user?.id && task.user_id === user.id) ? (
                            <form action={handleDeleteTask.bind(null, task.id)}>
                              <Button
                                type="submit"
                                variant="ghost"
                                size="xs"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0 cursor-pointer"
                                title={userRole === "admin" ? "Hapus tugas (Otoritas Admin)" : "Hapus tugas milik saya"}
                              >
                                <Trash2 className="size-4" />
                                <span className="sr-only">Hapus tugas</span>
                              </Button>
                            </form>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              disabled
                              className="text-muted-foreground/30 h-8 w-8 p-0 cursor-not-allowed"
                              title="Hanya Admin atau pemilik yang dapat menghapus tugas ini"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Tidak berhak menghapus</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-sm text-muted-foreground"
                    >
                      {search
                        ? `Tidak ada tugas yang sesuai dengan pencarian "${search}".`
                        : "Belum ada tugas yang tersimpan. Gunakan formulir di samping untuk menambahkan tugas baru."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Navigasi Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/70 pt-4">
              <p className="text-xs text-muted-foreground">
                Halaman <span className="font-medium text-foreground">{currentPage}</span> dari{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={createPageUrl(currentPage - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="size-3.5" />
                    Sebelumnya
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
                    <ChevronLeft className="size-3.5" />
                    Sebelumnya
                  </span>
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={createPageUrl(currentPage + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
                  >
                    Selanjutnya
                    <ChevronRight className="size-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
                    Selanjutnya
                    <ChevronRight className="size-3.5" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
