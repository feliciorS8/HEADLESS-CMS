import Link from "next/link";
import {
  BadgeCheck,
  Clock3,
  Layers3,
  type LucideIcon,
} from "lucide-react";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskStatusFilter } from "@/components/task-status-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks, type TaskStatus } from "@/lib/tasks";

type TaskFilterValue = "all" | TaskStatus;

type TasksPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

type Metric = {
  label: string;
  value: number;
  percent: number;
  caption: string;
  icon: LucideIcon;
  iconTone: string;
  trendTone: string;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const query = await searchParams;
  const requestedStatus = Array.isArray(query.status)
    ? query.status[0]
    : query.status;
  const activeFilter: TaskFilterValue =
    requestedStatus === "in-progress" || requestedStatus === "completed"
      ? requestedStatus
      : "all";
  const completedCount = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const totalCount = tasks.length;
  const rateFor = (value: number) =>
    totalCount ? Math.round((value / totalCount) * 100) : 0;
  const counts: Record<TaskFilterValue, number> = {
    all: totalCount,
    "in-progress": inProgressCount,
    completed: completedCount,
  };
  const visibleTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  const metrics: Metric[] = [
    {
      label: "Total Tugas",
      value: totalCount,
      percent: totalCount ? 100 : 0,
      caption: "Modul di perjalananmu",
      icon: Layers3,
      iconTone:
        "bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-700 ring-indigo-500/15 dark:text-indigo-300",
      trendTone: "text-indigo-700 dark:text-indigo-300",
    },
    {
      label: "Berjalan",
      value: inProgressCount,
      percent: rateFor(inProgressCount),
      caption: "Sedang dikerjakan",
      icon: Clock3,
      iconTone:
        "bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-700 ring-amber-500/15 dark:text-amber-300",
      trendTone: "text-amber-700 dark:text-amber-300",
    },
    {
      label: "Selesai",
      value: completedCount,
      percent: rateFor(completedCount),
      caption: "Tingkat penyelesaian",
      icon: BadgeCheck,
      iconTone:
        "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-700 ring-emerald-500/15 dark:text-emerald-300",
      trendTone: "text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <div className="w-full space-y-8">
      <section className="space-y-5" aria-labelledby="tasks-heading">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          THE SERVERLESS ODYSSEY
          <span className="text-border">/</span>
          MINGGU 02
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 id="tasks-heading" className="text-3xl font-semibold">
              Ruang tugas
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Satu langkah demi satu langkah, dari ide menuju edge.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Progress keseluruhan{" "}
            <span className="font-semibold text-foreground">
              {rateFor(completedCount)}%
            </span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CreateTaskForm />
        </div>
        <div className="space-y-8 lg:col-span-2">
          <section
            aria-label="Ringkasan progres tugas"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card
                  key={metric.label}
                  className="border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="flex items-start justify-between p-5">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold tabular-nums">
                        {metric.value.toString().padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {metric.caption}
                      </p>
                      <p
                        className={`mt-4 text-xs font-semibold ${metric.trendTone}`}
                      >
                        {metric.percent}%{" "}
                        <span className="font-normal text-muted-foreground">
                          dari total
                        </span>
                      </p>
                    </div>
                    <span
                      className={`grid size-11 place-items-center rounded-xl ring-1 ${metric.iconTone}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="space-y-5" aria-labelledby="task-list-heading">
            <div className="flex flex-col gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 id="task-list-heading" className="text-lg font-semibold">
                  Daftar modul
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pilih modul untuk melihat detail dan capaian.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <TaskStatusFilter activeFilter={activeFilter} counts={counts} />
              </div>
            </div>

            {visibleTasks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {visibleTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Card className="h-full border-border/70 bg-card transition-all group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg">
                      <CardHeader className="gap-4 p-5 pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-muted-foreground">
                              {task.category}
                            </p>
                            <CardTitle className="mt-2 text-base leading-6 font-semibold">
                              {task.title}
                            </CardTitle>
                          </div>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className="shrink-0"
                          >
                            {task.status === "completed"
                              ? "Selesai"
                              : "Berjalan"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="mt-5 flex items-center justify-between gap-3 text-xs">
                          <span className="font-medium text-foreground">
                            +{task.xp} XP
                          </span>
                          <span className="text-muted-foreground">
                            {task.updatedLabel}
                          </span>
                        </div>
                        <div
                          role="progressbar"
                          aria-label={`Progress ${task.title}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={task.progress}
                          className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-[width] duration-700"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Belum ada tugas pada status ini.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
