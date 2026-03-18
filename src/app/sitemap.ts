import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects-data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: project.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
