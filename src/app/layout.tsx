import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { DarkVeil } from "@/components/dark-veil";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-portfolio-nc41isu6k-arshpreet62s-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arshpreet Singh | Full-Stack Developer Portfolio",
    template: "%s | Arshpreet Singh",
  },
  description:
    "Portfolio of Arshpreet Singh featuring full-stack projects built with Next.js, TypeScript, MongoDB, and modern web technologies.",
  keywords: [
    "Arshpreet Singh",
    "Portfolio",
    "Next.js Developer",
    "Full-Stack Developer",
    "TypeScript",
    "MongoDB",
    "React",
  ],
  authors: [{ name: "Arshpreet Singh" }],
  creator: "Arshpreet Singh",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Arshpreet Singh | Full-Stack Developer Portfolio",
    description:
      "Explore projects, skills, and contact details for Arshpreet Singh.",
    siteName: "Arshpreet Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arshpreet Singh | Full-Stack Developer Portfolio",
    description:
      "Explore projects, skills, and contact details for Arshpreet Singh.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.variable,
        )}
      >
        <div className="fixed inset-0 -z-10 w-full h-screen">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0.5}
            warpAmount={1.3}
          />
        </div>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
