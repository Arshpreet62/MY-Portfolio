import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const projects = [
  {
    URL: "https://cssgenerator-two.vercel.app/",
    title: "CSS Generator",
    detail:
      "A web app to generate CSS code snippets for various styles and effects.",
  },
  {
    URL: "https://typespeed-tester.vercel.app/",
    title: "TypeSpeed Tester",
    detail:
      "An interactive typing speed test application to improve typing skills.",
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
          <a key={project.title} href={project.URL}>
            <Card className="h-full transition hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.detail}</CardDescription>
              </CardHeader>
              {/* <CardContent>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Case study in progress
              </span>
            </CardContent> */}
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
