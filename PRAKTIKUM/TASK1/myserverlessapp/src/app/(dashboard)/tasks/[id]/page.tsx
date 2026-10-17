import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTaskById } from "@/lib/tasks";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task) notFound();

  const isCompleted = task.status === "completed";

  return (
    <div className="max-w-2xl space-y-6">
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
            <Badge variant="outline">{task.category}</Badge>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Selesai" : "Berjalan"}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              MODUL #{id.padStart(2, "0")}
            </p>
            <CardTitle className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl">
              {task.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-7 px-6 pb-8 sm:px-8">
          <p className="text-sm leading-7 text-muted-foreground">
            {task.description}
          </p>
          <div className="grid grid-cols-2 gap-4 border-y border-border/70 py-5">
            <div>
              <p className="text-xs text-muted-foreground">Reward</p>
              <p className="mt-1 text-lg font-semibold">+{task.xp} XP</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pembaruan</p>
              <p className="mt-1 text-sm font-medium">{task.updatedLabel}</p>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium">Capaian modul</span>
              <span className="tabular-nums text-muted-foreground">
                {task.progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`Progress ${task.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={task.progress}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
