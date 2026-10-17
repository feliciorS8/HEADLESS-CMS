import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-foreground text-xs font-bold text-background">
                C
              </span>
              <span className="text-sm font-bold sm:text-base">
                CloudTask Pro
              </span>
            </Link>
            <nav
              aria-label="Navigasi utama"
              className="flex items-center gap-1 text-sm font-medium"
            >
              <Link
                href="/tasks"
                className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Tugas
              </Link>
              <Link
                href="/analytics"
                className="hidden rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
              >
                Analitik
              </Link>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <span className="hidden h-7 w-px bg-border sm:block" />
            <div className="flex items-center gap-2.5">
              <span
                aria-label="Avatar Explorer"
                className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 text-xs font-bold text-white ring-2 ring-background"
              >
                EX
              </span>
              <span className="hidden text-sm font-medium sm:block">
                Explorer
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
