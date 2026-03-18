"use client";

import { CloudMoon, Search, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/lib/projects-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "social", label: "Connect" },
  { id: "contact", label: "Contact" },
];

const resumeUrl =
  "https://drive.google.com/file/d/1_5ixr1TVAcOyERZ1uyCy6DqvNuNEFjEq/view?usp=drivesdk";

function NavWeatherTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = now?.getHours() ?? 12;
  const isDay = hour >= 6 && hour < 18;
  const formattedTime = now
    ? now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:--";

  return (
    <div
      id="nav-weather-time"
      className="hidden w-60 shrink-0 items-center justify-between rounded-full border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 via-background to-emerald-500/10 px-3 py-1.5 text-left md:flex lg:w-64"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-border/70 bg-background/70">
          <span className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/20" />
          {isDay ? (
            <Sun className="relative h-3.5 w-3.5 text-amber-400" />
          ) : (
            <CloudMoon className="relative h-3.5 w-3.5 text-cyan-400" />
          )}
        </div>

        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {isDay ? "Day" : "Night"} Mode
        </p>
      </div>

      <p className="text-xs font-semibold tabular-nums text-cyan-500">
        {formattedTime}
      </p>
    </div>
  );
}

export function SiteNav() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }

      if (event.key === "Escape") {
        setPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commands = useMemo(
    () => [
      ...navItems.map((item) => ({
        id: `section-${item.id}`,
        label: item.label,
        type: "section" as const,
        value: item.id,
      })),
      ...projects.map((project) => ({
        id: `project-${project.slug}`,
        label: project.title,
        type: "project" as const,
        value: project.slug,
      })),
    ],
    [],
  );

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return commands;

    return commands.filter((command) =>
      command.label.toLowerCase().includes(normalizedQuery),
    );
  }, [commands, query]);

  const runCommand = (command: (typeof commands)[number]) => {
    if (command.type === "section") {
      const section = document.getElementById(command.value);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${command.value}`);
    } else {
      window.location.assign(`/projects/${command.value}`);
    }

    setPaletteOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0.5 z-40">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl border border-border/60 bg-background/85 px-3 py-2 shadow-sm backdrop-blur md:px-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="#hero"
            className="inline-flex items-center px-2"
            aria-label="Go to top"
          >
            <Image
              src="/logo.png"
              alt="Arshpreet logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 rounded-md object-contain"
            />
          </Link>

          <NavWeatherTime />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-8 items-center gap-2 rounded-md border border-border/60 px-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground sm:inline-flex"
            aria-label="Open quick navigation"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Quick Nav</span>
            <span className="rounded border border-border/60 px-1.5 py-0.5 text-[10px] leading-none">
              Ctrl + K / ⌘ + K
            </span>
          </button>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">
              Download Resume
            </Button>
          </a>
          <ThemeToggle />
        </div>
      </div>

      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Quick navigation"
          onClick={() => {
            setPaletteOpen(false);
            setQuery("");
          }}
        >
          <div
            className="mx-auto mt-20 w-full max-w-xl rounded-2xl border border-border/60 bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sections or projects"
                className="h-9 w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted-foreground">
                  No results found.
                </p>
              ) : (
                filteredCommands.map((command) => (
                  <button
                    key={command.id}
                    type="button"
                    onClick={() => runCommand(command)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-accent"
                  >
                    <span className="text-sm">{command.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {command.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
