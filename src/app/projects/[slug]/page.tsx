import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProjectActions } from "@/components/project-actions";
import { getProjectBySlug, projects } from "@/lib/projects-data";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project details page could not be found.",
    };
  }

  const imageUrl = project.image.src.startsWith("http")
    ? project.image.src
    : `${siteUrl}${project.image.src}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: project.title,
      description: project.summary,
      images: [{ url: imageUrl, alt: project.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [imageUrl],
    },
  };
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="px-6 py-8 md:px-12 lg:px-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <span
            className={`rounded-full border border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white ${
              project.isLive ? "bg-green-500" : "bg-amber-500"
            }`}
          >
            {project.isLive ? "Live" : "Coming Soon"}
          </span>
        </div>

        <p className="text-base leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <p className="text-sm font-medium text-foreground/90">
          Impact: {project.impact}
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated: {project.lastUpdated}
        </p>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} live website`}
          className="group block"
        >
          <div className="relative h-64 overflow-hidden rounded-xl border border-border/60 bg-muted/20 transition group-hover:border-primary/50 sm:h-80">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              priority
              placeholder="blur"
              blurDataURL={project.image.blurDataURL}
              className="object-contain p-3"
            />
          </div>
        </a>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Problem</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.problem}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Approach</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.approach}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Architecture</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {project.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Challenges</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {project.challenges.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Outcome</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.outcome}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Supported Devices</h2>
          <div className="flex flex-wrap gap-2">
            {project.supportedDevices.map((device) => (
              <span
                key={device}
                className="rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]"
              >
                {device}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Highlights</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <ProjectActions
          title={project.title}
          slug={project.slug}
          liveUrl={project.liveUrl}
        />
      </div>
    </main>
  );
}
