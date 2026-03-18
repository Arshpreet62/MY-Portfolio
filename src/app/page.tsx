import { ScrollProgress } from "@/components/scroll-progress";
import { SiteNav } from "@/components/site-nav";
import { CursorPet } from "@/components/cursor-pet";
import {
  About,
  Contact,
  Hero,
  Projects,
  SocialLinks,
  TechStack,
} from "@/components/sections";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Arshpreet Singh",
        url: siteUrl,
        jobTitle: "Full-Stack Developer",
        sameAs: [
          "https://github.com/Arshpreet62",
          "https://www.linkedin.com/in/arshpreet-singh-8860b8370",
        ],
      },
      {
        "@type": "WebSite",
        name: "Arshpreet Portfolio",
        url: siteUrl,
      },
    ],
  };

  return (
    <main className="px-6 py-8 md:px-12 lg:px-20">
      <CursorPet />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <SiteNav />
        <ScrollProgress />
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <SocialLinks />
        <Contact />
      </div>
    </main>
  );
}
