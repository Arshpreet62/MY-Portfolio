"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
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
        className="w-fit uppercase tracking-[0.3em] text-xs"
      >
        Portfolio 2026
      </Badge>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Hi, I am Arshpreet, a web developer that build websites that are both
          functional and attractive.
        </h1>
        <p className="max-w-2xl text-3xl text-muted-foreground">
          I am based in Mohali, Punjab.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="lg" onClick={handleCopyEmail}>
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
