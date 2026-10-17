import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

const statusLabels = {
  todo: "Belum mulai",
  in_progress: "Berjalan",
  done: "Selesai",
} as const;

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .select(
      "id, title, description, status, created_at, updated_at, projects(title)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load Supabase task:", error);
    throw new Error("Tugas tidak dapat dimuat dari Supabase.");
  }

  if (!task) notFound();

  const progress =
    task.status === "done" ? 100 : task.status === "in_progress" ? 50 : 0;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Link
        href="/tasks"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke Daftar Tugas
      </Link>
      <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400" />
        <CardHeader className="gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {task.projects?.title ?? "Tanpa proyek"}
            </Badge>
            <Badge variant={task.status === "done" ? "default" : "secondary"}>
              {statusLabels[task.status]}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              ID TUGAS · {task.id}
            </p>
            <CardTitle className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl">
              {task.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-7 px-6 pb-8 sm:px-8">
          <p className="text-sm leading-7 text-muted-foreground">
            {task.description ?? "Belum ada deskripsi untuk tugas ini."}
          </p>
          <div className="grid grid-cols-2 gap-4 border-y border-border/70 py-5">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="mt-1 text-lg font-semibold">
                {statusLabels[task.status]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pembaruan terakhir</p>
              <p className="mt-1 text-sm font-medium">
                {new Date(task.updated_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium">Capaian tugas</span>
              <span className="tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`Progress ${task.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
