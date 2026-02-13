import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const projects = [
  {
    title: "Narrative Commerce",
    detail:
      "A storefront concept that blends editorial layouts with quick checkout flow.",
  },
  {
    title: "Atlas Studio",
    detail:
      "A modular brand system with typography-led landing pages and client portals.",
  },
  {
    title: "Civic Signals",
    detail: "A data storytelling hub focused on clarity and fast scanning.",
  },
];

export function Projects() {
  return (
    <section id="projects" className="projects space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">My Projects</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          2025-2026
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.title}
            className="h-full transition hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Case study in progress
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
