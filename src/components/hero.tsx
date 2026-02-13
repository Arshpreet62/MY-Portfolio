import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="space-y-6">
      <Badge
        variant="secondary"
        className="w-fit uppercase tracking-[0.3em] text-xs"
      >
        Portfolio 2026
      </Badge>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Hi, I am a web developer that build websites that are both functional
          and attractive.
        </h1>
        <p className="max-w-2xl text-3xl text-muted-foreground">
          I am based in Punjab, Mohali.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <a href="mailto:workarshpreet6462@gmail.com">
          <Button variant="outline" size="lg">
            Get in Touch
          </Button>
        </a>
        <a href="#projects">
          <Button size="lg">View Projects</Button>
        </a>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Looking for opportunities
        </span>
      </div>
    </section>
  );
}
