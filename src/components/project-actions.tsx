"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ProjectActionsProps = {
  title: string;
  slug: string;
  liveUrl: string;
};

export function ProjectActions({ title, slug, liveUrl }: ProjectActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild>
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("project_live_click", { slug, title })}
        >
          View Live Project
        </a>
      </Button>
      <Button asChild variant="outline">
        <Link
          href="/"
          onClick={() => track("project_back_click", { slug, title })}
        >
          Back to Projects
        </Link>
      </Button>
    </div>
  );
}
