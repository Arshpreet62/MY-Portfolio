"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisitorCounter } from "./visitor-counter";

export function Hero() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("workarshpreet6462@gmail.com");
      setEmailCopied(true);
      track("hero_copy_email", { source: "hero" });
      setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      track("hero_copy_email_failed", { source: "hero" });
    }
  };

  return (
    <section id="hero" className="space-y-6 scroll-mt-24">
      <Badge
        variant="secondary"
        className="w-fit border border-border/60 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em]"
      >
        Portfolio 2026
      </Badge>
      <div className="space-y-3">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          I&apos;m Arshpreet Singh, a Full-Stack{" "}
          <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-lime-300 dark:via-cyan-300 dark:to-sky-300">
            Developer
          </span>{" "}
          building with React, Next.js & Node.js.
        </h1>
        <div className="flex max-w-2xl items-center gap-2 text-base text-muted-foreground sm:text-lg">
          <MapPin className="h-5 w-5 text-emerald-600 dark:text-cyan-300" />
          <p>I am based in Mohali, Punjab.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopyEmail}
            className="gap-2 border-border/70 bg-background/80"
          >
            <Mail className="h-4 w-4" />
            {emailCopied ? "Email Copied" : "Copy Email"}
          </Button>
          <a href="#projects">
            <Button size="lg">View Projects</Button>
          </a>
        </div>
        <VisitorCounter />
      </div>
    </section>
  );
}
