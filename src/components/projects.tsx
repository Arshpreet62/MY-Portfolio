"use client";

import { track } from "@vercel/analytics";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects } from "@/lib/projects-data";

type ProjectFilter = "all" | "featured" | "full-stack" | "frontend" | "tool";

const filterOptions: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "featured", label: "Featured" },
  { value: "full-stack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "tool", label: "Tools" },
];

function ProjectCard({
  title,
  slug,
  supportedDevices,
  isLive,
  image,
  summary,
  impact,
  lastUpdated,
  imagePriority,
}: {
  title: string;
  slug: string;
  supportedDevices: string[];
  isLive: boolean;
  image: { src: string; alt: string; blurDataURL: string };
  summary: string;
  impact: string;
  lastUpdated: string;
  imagePriority?: boolean;
}) {
  const handleProjectClick = () => {
    track("project_card_click", { slug, title });
  };

  return (
    <Link
      href={`/projects/${slug}`}
      className="group"
      aria-label={`${title} project details`}
      onClick={handleProjectClick}
    >
      <Card className="h-full border-border/60 bg-card/80 shadow-lg shadow-black/5 transition duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">{title}</CardTitle>
            <div className="flex flex-row gap-2 ">
              <span className="rounded-full border border-border/60 bg-red-500 px-2.5 py-1 text-nowrap text-[11px] font-medium uppercase tracking-[0.2em] text-white">
                {supportedDevices.join(" / ")}
              </span>
              <span
                className={`rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white ${
                  isLive ? "bg-green-500" : "bg-amber-500"
                }`}
              >
                {isLive ? "Live" : "Coming Soon"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-44 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={Boolean(imagePriority)}
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className="object-contain p-2"
            />
          </div>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {summary}
          </CardDescription>
          <p className="text-sm font-medium text-foreground/90">
            Impact: {impact}
          </p>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <span className="inline-flex items-center text-sm font-medium text-primary">
            View details
            <span className="ml-2 transition group-hover:translate-x-1">
              {"->"}
            </span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("featured");

  const handleFilterSelect = (filter: ProjectFilter) => {
    setActiveFilter(filter);
    track("project_filter_selected", { filter });
  };

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    if (activeFilter === "featured") {
      return projects.filter((project) => project.featured);
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section
      id="projects"
      className="projects space-y-6 reveal-on-load reveal-delay-2 scroll-mt-24"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">My Projects</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          2025-2026
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleFilterSelect(option.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition ${
              activeFilter === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
            aria-pressed={activeFilter === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={`${project.slug}-${activeFilter}`}
            title={project.title}
            slug={project.slug}
            supportedDevices={project.supportedDevices}
            isLive={project.isLive}
            image={project.image}
            summary={project.summary}
            impact={project.impact}
            lastUpdated={project.lastUpdated}
            imagePriority={index === 0}
          />
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No projects found for this filter yet.
        </p>
      )}
    </section>
  );
}
