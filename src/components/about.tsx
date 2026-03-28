import { Badge } from "@/components/ui/badge";

export function About() {
  return (
    <section
      id="about"
      className="space-y-5 reveal-on-load reveal-delay-1 scroll-mt-24"
      aria-label="About me"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className="px-3.5 py-1.5 text-base uppercase tracking-[0.2em]"
        >
          About Me
        </Badge>
        <Badge className="bg-primary px-3.5 py-1.5 text-base text-primary-foreground hover:bg-primary">
          Open to Full-Stack Roles
        </Badge>
        <Badge className="bg-indigo-600 px-3.5 py-1.5 text-base text-white hover:bg-indigo-600">
          Open to Project-based Work
        </Badge>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          My strength is turning product requirements into stable,
          production-ready features with clean architecture and dependable
          execution.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          I am strongest in UI implementation, API integration, performance
          optimization, and shipping maintainable code that teams can scale with
          confidence.
        </p>
      </div>
    </section>
  );
}
