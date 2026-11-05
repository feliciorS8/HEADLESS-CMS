"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export type FilterStatus = "all" | "in_progress" | "completed";

interface TabOption {
  id: FilterStatus;
  label: string;
}

const TABS: TabOption[] = [
  { id: "all", label: "Semua" },
  { id: "in_progress", label: "Berjalan" },
  { id: "completed", label: "Selesai" },
];

interface AnimatedFilterTabsProps {
  /**
   * Nilai status saat ini (opsional, jika tidak diberikan akan membaca langsung dari URL)
   */
  currentStatus?: string;
}

export function AnimatedFilterTabs({ currentStatus }: AnimatedFilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil status dari props atau query params URL (default: "all")
  const rawStatus = currentStatus || searchParams.get("status") || "all";
  const activeStatus: FilterStatus =
    rawStatus === "in_progress" || rawStatus === "completed" ? rawStatus : "all";

  function handleTabChange(statusId: FilterStatus) {
    const params = new URLSearchParams(searchParams.toString());

    if (statusId === "all") {
      params.delete("status");
    } else {
      params.set("status", statusId);
    }

    // Reset pagination ke halaman 1 saat filter status berubah
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      role="tablist"
      aria-label="Filter status tugas"
      className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/60 p-1 backdrop-blur-sm"
    >
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabChange(tab.id)}
            className="relative px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            {/* Kapsul Pill Aktif dengan Framer Motion layoutId */}
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full bg-primary shadow-xs"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {/* Label teks di atas kapsul pill */}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                isActive
                  ? "font-semibold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

