import { ThemeToggle } from "@/components/theme-toggle";
import { Contact, Hero, Projects, TechStack } from "@/components/sections";

export default function Home() {
  return (
    <main className="px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <Hero />
        <TechStack />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
