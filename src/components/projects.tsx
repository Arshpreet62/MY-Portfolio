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
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.URL}
            target="_blank"
            rel="noreferrer"
            className="group"
            aria-label={`${project.title} live site`}
          >
            <Card className="h-full border-border/60 bg-card/80 shadow-lg shadow-black/5 transition duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">
                    {project.title}
                  </CardTitle>
                  <div className="flex flex-row gap-2 ">
                    <span className="rounded-full border border-border/60 bg-red-500 px-2.5 py-1 text-nowrap text-[11px] font-medium uppercase tracking-[0.2em] text-white">
                      PC ONLY
                    </span>
                    <span className="rounded-full border border-border/60 bg-green-400 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white">
                      Live
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {project.detail}
                </CardDescription>
                <span className="inline-flex items-center text-sm font-medium text-primary">
                  View project
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
