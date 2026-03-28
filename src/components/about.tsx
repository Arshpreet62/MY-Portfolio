import { Badge } from "@/components/ui/badge";

export function About() {
  return (
    <section
      id="about"
      className="space-y-6 reveal-on-load reveal-delay-1 scroll-mt-24"
      aria-label="About me"
    >
      <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm shadow-black/5 backdrop-blur-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-xs uppercase tracking-[0.2em] sm:text-sm"
          >
            About Me
          </Badge>
          <Badge className="bg-foreground px-3 py-1 text-xs text-background hover:bg-foreground sm:text-sm">
            Open to Full-Stack Roles
          </Badge>
          <Badge className="bg-foreground px-3 py-1 text-xs text-background hover:bg-foreground sm:text-sm">
            Open to Project-based Work
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            My strength is turning product requirements into{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              stable
            </span>
            ,{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              production-ready features
            </span>{" "}
            with{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              clean architecture
            </span>{" "}
            and{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              dependable execution
            </span>
            .
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            I am strongest in{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              UI implementation
            </span>
            ,{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              API integration
            </span>
            ,{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              performance optimization
            </span>
            , and shipping{" "}
            <span className="font-semibold text-emerald-700 dark:text-sky-400">
              maintainable code
            </span>{" "}
            that teams can scale with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
