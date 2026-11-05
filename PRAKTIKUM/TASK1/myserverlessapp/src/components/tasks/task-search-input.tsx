"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TaskSearchInputProps = {
  placeholder?: string;
};

export function TaskSearchInput({
  placeholder = "Cari judul tugas...",
}: TaskSearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = term.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    // Reset pagination ke halaman 1 saat pencarian berubah
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        defaultValue={searchParams.get("search")?.toString() || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-background/80 pl-9"
      />
    </div>
  );
}

