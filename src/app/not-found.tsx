import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 rounded-2xl border border-border/60 bg-card/60 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This page does not exist.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          The page might have been moved, renamed, or is temporarily
          unavailable.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/">Back Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#projects">View Projects</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
