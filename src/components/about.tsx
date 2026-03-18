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
          className="uppercase tracking-[0.2em] text-sm"
        >
          About Me
        </Badge>
        <Badge className="bg-emerald-600 text-sm text-white hover:bg-emerald-600">
          Open to Internship
        </Badge>
        <Badge className="bg-primary text-sm text-primary-foreground hover:bg-primary">
          Open to Full-time
        </Badge>
        <Badge className="bg-indigo-600 text-sm text-white hover:bg-indigo-600">
          Open to Project-based Work
        </Badge>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6">
        <p className="text-base leading-relaxed text-muted-foreground">
          I am Arshpreet Singh, a full-stack developer focused on building fast,
          accessible, and production-ready web applications. I enjoy turning
          complex ideas into simple user experiences and working across
          frontend, backend, and API integration workflows.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Based in Mohali, Punjab. Typical response time: within 24 hours.
        </p>
      </div>
    </section>
  );
}
