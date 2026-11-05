import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

/**
 * Halaman Gerbang Autentikasi Sementara (Tahap 1)
 * Berjalan sebagai Server Component untuk memvalidasi sesi via getUser()
 * dan menampilkan status kesiapan fondasi keamanan proxy Next.js 16.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  // 1. Inisialisasi Supabase Server Client
  const supabase = await createClient();

  // 2. Verifikasi status autentikasi melalui getUser() (Bukan getSession())
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Jika pengguna telah terotentikasi, alihkan ke target 'next' atau /dashboard
  if (user) {
    const targetPath = next && next.startsWith("/") ? next : "/dashboard";
    redirect(targetPath);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      <div className="pointer-events-none absolute top-1/4 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full max-w-lg space-y-6">
        {/* Header Branding */}
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur-md transition-colors hover:bg-muted"
          >
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            <span>The Serverless Odyssey</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold text-primary">Security Perimeter</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Authentication Gateway
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerbang Autentikasi & Validasi Perimeter Jaringan
          </p>
        </div>

        {/* Status Card: Fondasi Keamanan Proxy Aktif */}
        <Card className="relative overflow-hidden border-border/80 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

          <CardHeader className="p-6 pb-4">
            <div className="flex items-center justify-between gap-3">
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Tahap 1: Proxy Refresher Siap
              </Badge>
              <Badge variant="secondary" className="font-mono text-[11px]">
                Next.js 16 Proxy
              </Badge>
            </div>
            <CardTitle className="mt-3 text-xl font-bold tracking-tight">
              Authentication Gateway: Fondasi Keamanan Proxy Aktif
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Fondasi keamanan tingkat Network Boundary (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                src/proxy.ts
              </code>
              ) telah terpasang dengan sinkronisasi dual-cookie untuk menjaga
              integritas sesi autentikasi.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-6 pt-0">
            {next && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground"
              >
                <ShieldAlert
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-primary">
                    Rute Terproteksi Terdeteksi:
                  </span>
                  <p className="text-muted-foreground">
                    Permintaan akses ke{" "}
                    <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[11px] text-foreground">
                      {next}
                    </code>{" "}
                    dialihkan ke gateway ini karena sesi pengguna belum
                    terdeteksi.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 rounded-xl border border-border/70 bg-muted/30 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Arsitektur Pertahanan Berlapis (Tahap 1):
              </h2>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong className="text-foreground">
                      Next.js 16 Proxy Boundary:
                    </strong>{" "}
                    Menggantikan middleware.ts usang dengan handler{" "}
                    <code className="font-mono">src/proxy.ts</code>.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <RefreshCw className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong className="text-foreground">
                      Dual-Cookie Sync:
                    </strong>{" "}
                    Token sesi disinkronisasi ke{" "}
                    <code className="font-mono">request.cookies</code> &{" "}
                    <code className="font-mono">response.cookies</code> secara
                    simultan.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Database className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong className="text-foreground">
                      PostgreSQL Trigger:
                    </strong>{" "}
                    <code className="font-mono">on_auth_user_created</code>{" "}
                    mereplikasi profil pengguna otomatis ke{" "}
                    <code className="font-mono">public.profiles</code>.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Lock className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong className="text-foreground">
                      Verifikasi Server:
                    </strong>{" "}
                    Wajib memanggil{" "}
                    <code className="font-mono">supabase.auth.getUser()</code>{" "}
                    untuk keamanan zero-trust.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-muted-foreground">
              <div className="mb-1 flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
                <Sparkles className="size-3.5" />
                <span>Petunjuk Menuju Tahap 2:</span>
              </div>
              <p>
                Kompilasi dan fondasi redirect proxy berjalan normal. Pada{" "}
                <strong>Tahap 2</strong>, komponen kartu sementara ini akan
                diperkaya dengan formulir interaktif Login & Registrasi (Email &
                Sandi) menggunakan Server Actions.
              </p>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col items-center justify-between gap-3 bg-muted/10 p-6 sm:flex-row">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full sm:w-auto",
              )}
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/tasks"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full gap-1.5 sm:w-auto",
              )}
            >
              <span>Uji Redirect Proxy (/tasks)</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          Praktikum Headless CMS • Full-Stack Serverless Architecture
        </p>
      </div>
    </div>
  );
}
