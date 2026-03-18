"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadVisitors = async () => {
      try {
        const response = await fetch("/api/visits", {
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || typeof data?.count !== "number") {
          setIsError(true);
          return;
        }

        setCount(data.count);
      } catch {
        setIsError(true);
      }
    };

    void loadVisitors();
  }, []);

  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur">
      <Eye className="h-4 w-4" aria-hidden="true" />
      <span className="uppercase tracking-[0.2em] text-[10px]">Visitors</span>
      <span className="font-semibold text-foreground">
        {isError
          ? "N/A"
          : count === null
            ? "..."
            : new Intl.NumberFormat("en-US").format(count)}
      </span>
    </div>
  );
}
