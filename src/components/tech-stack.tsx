import { Badge } from "@/components/ui/badge";

const stacks = [
  "HTML",
  "CSS",
  "Tailwind",
  "JavaScript",
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
];

export function TechStack() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Tech Stack</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Core Tools
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {stacks.map((stack) => (
          <Badge key={stack} variant="outline" className="px-3 py-1 text-md">
            {stack}
          </Badge>
        ))}
      </div>
    </section>
  );
}
