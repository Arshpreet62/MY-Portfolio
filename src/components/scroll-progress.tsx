"use client";

import { useEffect, useState } from "react";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "social", label: "Connect" },
  { id: "contact", label: "Contact" },
];

const SECTION_MARKER_OFFSET = 97;

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    let rafId: number | null = null;

    const updateBySections = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (sections.length <= 1) {
        setProgress(0);
        if (sections[0]) setActiveId(sections[0].id);
        return;
      }

      const markerY = window.scrollY + SECTION_MARKER_OFFSET;
      const tops = sections.map((section) => section.offsetTop);

      let segmentIndex = 0;
      let segmentProgress = 0;

      if (markerY <= tops[0]) {
        segmentIndex = 0;
        segmentProgress = 0;
      } else if (markerY >= tops[tops.length - 1]) {
        segmentIndex = tops.length - 1;
        segmentProgress = 0;
      } else {
        for (let index = 0; index < tops.length - 1; index += 1) {
          const start = tops[index];
          const end = tops[index + 1];
          if (markerY >= start && markerY < end) {
            segmentIndex = index;
            segmentProgress = (markerY - start) / Math.max(1, end - start);
            break;
          }
        }
      }

      const maxSegments = tops.length - 1;
      const overall = ((segmentIndex + segmentProgress) / maxSegments) * 100;
      setProgress(Math.max(0, Math.min(100, overall)));

      const activeIndex = Math.min(segmentIndex, sections.length - 1);
      setActiveId(sections[activeIndex].id);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateBySections();
      });
    };

    updateBySections();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const handleSectionJump = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="pointer-events-none fixed right-2 top-1/2 z-40 h-[80vh] -translate-y-1/2 md:right-4">
      <div className="relative h-full w-32">
        <div
          className="absolute right-1 top-0 h-full w-1 overflow-hidden rounded-full bg-border/60"
          aria-hidden="true"
        >
          <div
            className="absolute left-0 top-0 w-full bg-primary transition-[height] duration-100 ease-out"
            style={{ height: `${progress}%` }}
          />
        </div>

        {navItems.map((item, index) => {
          const top =
            navItems.length === 1 ? 0 : (index / (navItems.length - 1)) * 100;
          const isActive = activeId === item.id;
          const isPassed = progress >= top;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSectionJump(item.id)}
              className="pointer-events-auto absolute right-0 flex -translate-y-1/2 items-center gap-2"
              style={{ top: `${top}%` }}
              aria-label={`Jump to ${item.label}`}
            >
              <span
                className={`hidden rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.16em] transition md:inline-block ${
                  isActive
                    ? "border-sky-500/45 bg-sky-500/15 text-sky-700 dark:border-cyan-400/50 dark:bg-cyan-500/15 dark:text-cyan-300"
                    : isPassed
                      ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "border-border/70 bg-background/90 text-foreground/80 dark:border-border/60 dark:bg-background/85 dark:text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`h-3.5 w-3.5 rounded-full border transition ${
                  isActive
                    ? "border-sky-600 bg-sky-600 dark:border-cyan-300 dark:bg-cyan-400"
                    : isPassed
                      ? "border-emerald-600 bg-emerald-600 dark:border-emerald-300 dark:bg-emerald-400"
                      : "border-border/80 bg-background dark:border-border/70"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
