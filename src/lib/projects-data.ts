import { projectImages, type ProjectImage } from "@/lib/project-images";

export type ProjectCategory = "full-stack" | "frontend" | "tool";

export type Project = {
  slug: string;
  title: string;
  liveUrl: string;
  isLive: boolean;
  featured: boolean;
  category: ProjectCategory;
  image: ProjectImage;
  supportedDevices: string[];
  summary: string;
  impact: string;
  lastUpdated: string;
  problem: string;
  approach: string;
  architecture: string[];
  challenges: string[];
  outcome: string;
  stack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "css-generator",
    title: "CSS Generator",
    liveUrl: "https://cssgenerator-two.vercel.app/",
    isLive: true,
    featured: false,
    category: "tool",
    image: projectImages["css-generator"],
    supportedDevices: ["PC"],
    summary:
      "A web app to generate CSS code snippets for various styles and effects.",
    impact:
      "Cut styling iteration time by generating reusable CSS snippets instantly.",
    lastUpdated: "2026-03-19",
    problem:
      "Frontend styling experiments were slow because developers had to manually write, tweak, and test CSS snippets repeatedly.",
    approach:
      "Built an interactive generator that previews styles and outputs ready-to-copy CSS in real time.",
    architecture: [
      "Client-side React UI for controls and preview rendering.",
      "State-driven style generation with TypeScript-safe mappings.",
      "Instant output panel optimized for quick copy workflow.",
    ],
    challenges: [
      "Keeping output CSS readable while supporting many style combinations.",
      "Ensuring preview updates remained smooth during rapid control changes.",
    ],
    outcome:
      "Reduced design iteration friction by turning repeated style experimentation into a fast copy-paste flow.",
    stack: ["React", "TypeScript", "CSS"],
    highlights: [
      "Generates reusable CSS snippets in real time.",
      "Makes experimentation with styles faster.",
      "Simple UI focused on quick copy and paste workflow.",
    ],
  },
  {
    slug: "typespeed-tester",
    title: "TypeSpeed Tester",
    liveUrl: "https://typespeed-tester.vercel.app/",
    isLive: true,
    featured: false,
    category: "frontend",
    image: projectImages["typespeed-tester"],
    supportedDevices: ["PC"],
    summary:
      "An interactive typing speed test application to improve typing skills.",
    impact:
      "Improved typing practice feedback with real-time speed and accuracy tracking.",
    lastUpdated: "2026-03-19",
    problem:
      "Typing practice tools often lacked immediate, motivating feedback loops for speed and accuracy improvement.",
    approach:
      "Implemented a focused test experience with real-time metrics and a clean, distraction-free UI.",
    architecture: [
      "React component state for timer, progress, and result calculations.",
      "Input event processing for live WPM and accuracy updates.",
      "Responsive layout tuned for keyboard-first interaction on desktop.",
    ],
    challenges: [
      "Maintaining accurate score calculations while users rapidly type/correct.",
      "Balancing responsiveness with frequent UI state updates.",
    ],
    outcome:
      "Delivered a lightweight practice app that gives immediate performance feedback and encourages consistent improvement.",
    stack: ["React", "JavaScript", "CSS"],
    highlights: [
      "Measures typing speed and accuracy.",
      "Designed for focused practice sessions.",
      "Fast and responsive gameplay experience.",
    ],
  },
  {
    slug: "postman-api-tester",
    title: "Postmen | Full-Stack API Testing Platform",
    liveUrl: "https://postmen.vercel.app/",
    isLive: true,
    featured: true,
    category: "full-stack",
    image: projectImages["postman-api-tester"],
    supportedDevices: ["PC", "Mobile"],
    summary:
      "Built a Postman-like web application enabling users to send HTTP requests, inspect formatted responses, and manage request history through a clean dashboard.",
    impact:
      "Reduced API debugging friction by combining auth, request history, and formatted responses in one workflow.",
    lastUpdated: "2026-03-19",
    problem:
      "Testing APIs across tools was fragmented, making auth handling and request history management inefficient.",
    approach:
      "Built a unified Postman-like platform with authenticated dashboards, request builder, and response visualization.",
    architecture: [
      "Next.js app with route-based pages and protected user flows.",
      "JWT plus Google OAuth authentication for secure access control.",
      "MongoDB-backed persistence for request history and user data.",
      "Reusable editor components for request config and response rendering.",
    ],
    challenges: [
      "Designing secure auth boundaries for protected routes and user sessions.",
      "Keeping request/response UX fast while persisting history reliably.",
      "Covering critical journeys with end-to-end test stability.",
    ],
    outcome:
      "Created a production-style API testing experience that improved developer workflow efficiency and reliability.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "MongoDB",
      "JWT",
      "Google OAuth",
      "Tailwind CSS",
      "Playwright",
    ],
    highlights: [
      "Implemented secure authentication using JWT and Google OAuth, with protected routes for authorized access.",
      "Integrated MongoDB for persistent data storage and reliable request/history management.",
      "Developed the frontend using Next.js, TypeScript, and Tailwind CSS with interactive editor components for request and response handling.",
      "Added Playwright end-to-end tests for critical user flows (login, landing, dashboard) to improve application reliability.",
    ],
  },
  {
    slug: "my-portfolio",
    title: "Personal Portfolio Website",
    liveUrl: "https://my-portfolio-rosy-zeta-98.vercel.app/",
    isLive: true,
    featured: true,
    category: "frontend",
    image: projectImages["my-portfolio"],
    supportedDevices: ["PC", "Mobile"],
    summary:
      "Built a responsive portfolio website to present projects, skills, and contact details.",
    impact:
      "Improved recruiter discoverability with SEO routes, project pages, and conversion-focused contact UX.",
    lastUpdated: "2026-03-19",
    problem:
      "A basic portfolio lacked enough project depth and conversion signals for recruiters to evaluate skills quickly.",
    approach:
      "Built a modern portfolio with detailed project pages, clear CTAs, and structured contact workflow.",
    architecture: [
      "Next.js App Router with component-driven section architecture.",
      "Tailwind-based design system and reusable UI components.",
      "API routes for contact handling and visitor tracking with MongoDB.",
      "SEO metadata, sitemap, robots, and analytics instrumentation.",
    ],
    challenges: [
      "Balancing rich content with clean visual hierarchy and performance.",
      "Ensuring responsive behavior across desktop and mobile layouts.",
    ],
    outcome:
      "Shipped a recruiter-focused portfolio that presents technical depth clearly while improving inquiry conversion paths.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
    highlights: [
      "Developed with Next.js 16 and TypeScript.",
      "Added reusable UI components using Tailwind CSS.",
      "Integrated contact form with Nodemailer API route.",
      "Implemented MongoDB-based visitor counter.",
      "Optimized for performance, accessibility, and mobile devices.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
