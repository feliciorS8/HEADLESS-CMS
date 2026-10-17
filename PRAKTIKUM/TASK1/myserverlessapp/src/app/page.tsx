import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Database,
  FolderKanban,
  Layers3,
  ListTodo,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type ProjectWithTasks = Pick<
  Tables<"projects">,
  "id" | "title" | "description" | "budget"
> & {
  tasks: Pick<Tables<"tasks">, "id" | "title" | "status">[];
};

const schemaLayers = [
  {
    name: "profiles",
    detail: "Identitas pengembang",
    icon: Layers3,
    tone: "text-primary",
  },
  {
    name: "projects",
    detail: "Proyek dan anggaran",
    icon: FolderKanban,
    tone: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "tasks",
    detail: "Tugas dan progres",
    icon: ListTodo,
    tone: "text-emerald-600 dark:text-emerald-400",
  },
];

export default async function HomePage() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
  let projects: ProjectWithTasks[] = [];
  let queryFailed = false;

  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, budget, tasks(id, title, status)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load Supabase projects:", error);
      queryFailed = true;
    } else {
      projects = data ?? [];
    }
  }

  const taskCount = projects.reduce(
    (total, project) => total + project.tasks.length,
    0,
  );
  const totalBudget = projects.reduce(
    (total, project) => total + (project.budget ?? 0),
    0,
  );

  const metrics = [
    {
      label: "Proyek aktif",
      value: projects.length.toString().padStart(2, "0"),
      icon: FolderKanban,
      detail: "Tercatat di workspace",
    },
    {
      label: "Total tugas",
      value: taskCount.toString().padStart(2, "0"),
      icon: ListTodo,
      detail: "Terhubung ke proyek",
    },
    {
      label: "Total anggaran",
      value: `Rp ${totalBudget.toLocaleString("id-ID")}`,
      icon: Wallet,
      detail: "Akumulasi seluruh proyek",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--color-primary)_0%,transparent_42%)] opacity-[0.08]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,var(--color-chart-2)_0%,transparent_38%)] opacity-[0.08]" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <Database className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              The Serverless Odyssey
            </span>
          </Link>
          <Badge
            variant={supabaseConfigured && !queryFailed ? "secondary" : "outline"}
            className="gap-1.5 rounded-full px-3 py-1.5"
          >
            {supabaseConfigured && !queryFailed ? (
              <CheckCircle2
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
            ) : (
              <CircleAlert
                className="size-3.5 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
            )}
            {supabaseConfigured && !queryFailed
              ? "Supabase terhubung"
              : "Supabase belum terverifikasi"}
          </Badge>
        </header>

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-12">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/5 px-3 py-1.5 text-primary"
            >
              Proyek Akhir · Serverless Architecture
            </Badge>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Satu workspace.
              <br />
              <span className="bg-gradient-to-r from-primary via-sky-600 to-emerald-600 bg-clip-text text-transparent dark:via-sky-400 dark:to-emerald-400">
                Seluruh perjalanan.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Kelola proyek serverless dan pecah visi besar menjadi tugas yang
              terukur. Didukung Next.js 16, PostgreSQL, dan Supabase.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/tasks"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Buka Dashboard Tugas
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <p className="text-sm text-muted-foreground">
                Data proyek dimuat langsung dari Supabase.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden border-border/80 bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardDescription className="font-mono text-xs uppercase tracking-[0.16em]">
                    Data architecture
                  </CardDescription>
                  <CardTitle className="mt-2 text-xl tracking-tight">
                    Relasi yang terstruktur
                  </CardTitle>
                </div>
                <span className="grid size-10 place-items-center rounded-xl border border-border bg-muted/60">
                  <Database
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schemaLayers.map((layer, index) => {
                  const Icon = layer.icon;

                  return (
                    <div key={layer.name}>
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3.5 transition-colors hover:border-primary/30 hover:bg-accent/40">
                        <span className="grid size-9 place-items-center rounded-lg bg-muted">
                          <Icon
                            className={`size-4 ${layer.tone}`}
                            aria-hidden="true"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-sm font-semibold">
                            {layer.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {layer.detail}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] text-muted-foreground"
                        >
                          {index === 0
                            ? "ROOT"
                            : index === 1
                              ? "1 : N"
                              : "CHILD"}
                        </Badge>
                      </div>
                      {index < schemaLayers.length - 1 && (
                        <div className="ml-7 h-3 border-l border-dashed border-border" />
                      )}
                    </div>
                  );
                })}
              </div>
              <Separator className="my-5" />
              <p className="text-xs leading-5 text-muted-foreground">
                UUID keys · Foreign keys berantai · Validasi constraint
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Workspace overview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Ringkasan proyek
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Ringkasan terbaru dari database
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Card
                key={metric.label}
                className="border-border/80 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {metric.detail}
                    </p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-xl border border-border bg-muted/60 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mb-5 mt-12 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Proyek terbaru
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Proyek beserta progres tugas terkait.
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 rounded-full">
            {projects.length} proyek
          </Badge>
        </div>

        {!supabaseConfigured ? (
          <div
            role="status"
            className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"
          >
            <p className="font-medium">Supabase belum dikonfigurasi</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tambahkan URL project dan publishable key di environment aplikasi
              untuk memuat proyek.
            </p>
          </div>
        ) : queryFailed ? (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
          >
            Proyek gagal dimuat dari Supabase. Periksa koneksi dan izin akses
            tabel.
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group border-border/80 bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-6 tracking-tight">
                      {project.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="shrink-0 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                    >
                      {project.tasks.length} tugas
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3 min-h-[3.75rem] leading-5">
                    {project.description || "Belum ada deskripsi proyek."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">Anggaran</span>
                    <span className="font-mono font-medium text-foreground">
                      {project.budget === null
                        ? "Belum ditentukan"
                        : `Rp ${project.budget.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  {project.tasks.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-border pt-4">
                      {project.tasks.slice(0, 3).map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="truncate text-muted-foreground">
                            {task.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="shrink-0 rounded-full px-2 py-0 text-[10px] transition-colors hover:border-primary/30 hover:text-primary"
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </li>
                      ))}
                      {project.tasks.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{project.tasks.length - 3} tugas lainnya
                        </li>
                      )}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">Belum ada proyek</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Proyek yang tersedia di database akan ditampilkan di sini.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
