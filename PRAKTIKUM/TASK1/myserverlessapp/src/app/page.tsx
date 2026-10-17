import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const architecture = [
  { number: "01", name: "Application", detail: "Next.js 16" },
  { number: "02", name: "Data", detail: "Supabase · PostgreSQL" },
  { number: "03", name: "Media", detail: "Cloudinary CDN" },
  { number: "04", name: "Delivery", detail: "Vercel Edge" },
];

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative isolate min-h-[76svh] overflow-hidden bg-neutral-950 text-black">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=90"
          alt="Jaringan data global membentang di atas bumi pada malam hari"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/90 via-neutral-950/65 to-neutral-950/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/75 via-transparent to-neutral-950/20" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-sm font-semibold tracking-normal text-white"
          >
            THE SERVERLESS ODYSSEY
          </Link>
          <Link
            href="/tasks"
            className="text-sm text-white/75 transition-colors hover:text-white"
          >
            Ruang tugas <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <div className="mx-auto grid min-h-[calc(76svh-76px)] w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:px-12">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 shadow-lg shadow-black/10 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              The Serverless Odyssey <span aria-hidden="true">&bull;</span>{" "}
              Minggu 02
            </span>
            <h1 className="mt-7 max-w-3xl text-5xl leading-[0.98] font-semibold text-white sm:text-6xl lg:text-7xl">
              The Serverless
              <br />
              Odyssey
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Merancang aplikasi modern dari database PostgreSQL terkelola,
              pengiriman media global, hingga komputasi edge yang siap tumbuh.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/tasks"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-black shadow-xl shadow-black/15 transition-transform hover:-translate-y-0.5 hover:bg-white/90 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Buka Form Pembuatan Tugas
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Lihat arsitektur
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-12 flex items-center gap-3 text-xs text-white/65">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300/70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
              </span>
              <span>Cloud-native by design</span>
              <span className="text-white/35">/</span>
              <span>Empat pilar, satu perjalanan</span>
            </div>
          </div>

          <aside
            aria-label="Pratinjau formulir pembuatan tugas"
            className="relative mx-auto w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 lg:justify-self-end"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-cyan-400/20 blur-2xl" />
            <div className="relative rounded-3xl border border-white/20 bg-card/95 p-5 text-card-foreground shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Task workspace
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    Rencanakan langkah berikutnya
                  </h2>
                </div>
                <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  Form aktif
                </span>
              </div>

              <div className="mt-7 space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Judul tugas
                  </p>
                  <div className="rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-muted-foreground shadow-sm">
                    Implementasi modul berikutnya...
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Deskripsi
                  </p>
                  <div className="h-20 rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-muted-foreground shadow-sm">
                    Tujuan, detail, dan capaian yang ingin diraih
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Prioritas
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Sedang
                  </span>
                </div>
              </div>

              <Link
                href="/tasks"
                className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Buka Form Pembuatan Tugas
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Validasi instan · Prioritas terstruktur
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="architecture"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-5 py-8 sm:px-8 md:grid-cols-4 lg:px-12">
          {architecture.map((pillar) => (
            <div key={pillar.number} className="flex items-start gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                {pillar.number}
              </span>
              <div>
                <p className="text-sm font-medium">{pillar.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pillar.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
