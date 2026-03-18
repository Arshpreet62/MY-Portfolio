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

    updateBySections();
    window.addEventListener("scroll", updateBySections, { passive: true });
    window.addEventListener("resize", updateBySections);

    return () => {
      window.removeEventListener("scroll", updateBySections);
      window.removeEventListener("resize", updateBySections);
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
          className="absolute right-1 top-0 h-full w-[3px] overflow-hidden rounded-full bg-border/50"
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
                className={`hidden rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] transition md:inline-block ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                    : isPassed
                      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                      : "border-border/60 bg-background/85 text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full border transition ${
                  isActive
                    ? "border-cyan-300 bg-cyan-400"
                    : isPassed
                      ? "border-emerald-300 bg-emerald-400"
                      : "border-border/70 bg-background"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
