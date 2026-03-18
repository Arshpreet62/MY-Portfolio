"use client";

import { track } from "@vercel/analytics";
import { Github, Linkedin } from "lucide-react";

export function SocialLinks() {
  const handleSocialClick = (platform: "github" | "linkedin") => {
    track("social_link_click", { platform, section: "social-links" });
  };

  return (
    <section
      id="social"
      className="flex flex-col gap-6 scroll-mt-24"
      aria-label="Social links"
    >
      <h2 className="text-2xl font-semibold tracking-tight">Connect with me</h2>
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6  sm:p-8">
        <p className="mt-2 text-sm text-muted-foreground">
          You can find my work and professional profile here.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href="https://github.com/Arshpreet62"
            target="_blank"
            rel="noreferrer"
            onClick={() => handleSocialClick("github")}
            className="group rounded-xl border border-border/60 bg-background/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-background hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Open Arshpreet GitHub profile in new tab"
          >
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
              <div>
                <p className="text-sm font-medium text-foreground">GitHub</p>
                <p className="text-xs text-muted-foreground group-hover:text-foreground/70">
                  github.com/Arshpreet62
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/arshpreet-singh-8860b8370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noreferrer"
            onClick={() => handleSocialClick("linkedin")}
            className="group rounded-xl border border-border/60 bg-background/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-background hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Open Arshpreet LinkedIn profile in new tab"
          >
            <div className="flex items-center gap-3">
              <Linkedin className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
              <div>
                <p className="text-sm font-medium text-foreground">LinkedIn</p>
                <p className="text-xs text-muted-foreground group-hover:text-foreground/70">
                  linkedin.com/in/arshpreet-singh-8860b8370
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
