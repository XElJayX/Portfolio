import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SourceCapture } from "@/components/SourceCapture";
import { themeInitScript } from "@/components/ThemeToggle";
import { education } from "@/lib/content";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const description =
  "Jayanth Ravimurugan is an AI Engineer building LLM systems end to end: RAG pipelines, autonomous agents, transformers from scratch, and production APIs. MS Data Science at UW–Madison.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.links.github }],
  creator: site.name,
  keywords: [
    site.name,
    "AI Engineer",
    "ML Engineer",
    "LLM",
    "RAG",
    "AI agents",
    "LangGraph",
    "PyTorch",
    "Transformers",
    "UW–Madison",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.role}`, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0a" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: siteUrl(),
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Madison", addressRegion: "WI", addressCountry: "US" },
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  sameAs: [site.links.github, site.links.linkedin, site.links.huggingface],
  knowsAbout: ["Large language models", "Retrieval-augmented generation", "AI agents", "Machine learning", "NLP"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <SourceCapture />
        <Analytics />
      </body>
    </html>
  );
}
