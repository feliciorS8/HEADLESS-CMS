"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { TaskStatus } from "@/lib/tasks";

type TaskFilterValue = "all" | TaskStatus;

type TaskStatusFilterProps = {
  activeFilter: TaskFilterValue;
  counts: Record<TaskFilterValue, number>;
};

const filters: { value: TaskFilterValue; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "in-progress", label: "Berjalan" },
  { value: "completed", label: "Selesai" },
];

export function TaskStatusFilter({
  activeFilter,
  counts,
}: TaskStatusFilterProps) {
  return (
    <nav
      aria-label="Filter status tugas"
      className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-muted/60 p-1"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const href =
          filter.value === "all" ? "/tasks" : `/tasks?status=${filter.value}`;

        return (
          <Link
            key={filter.value}
            href={href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={buttonVariants({
              variant: isActive ? "default" : "ghost",
              size: "sm",
              className: "h-9 shrink-0 gap-2 rounded-full px-3.5",
            })}
          >
            <span>{filter.label}</span>
            <span
              className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                isActive
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
            >
              {counts[filter.value]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
