import Link from "next/link";
import { publication } from "@/lib/content";
import { site } from "@/lib/site";
import { ArrowRight } from "../icons";
import { ResumeDownloadButton } from "../ResumeDownloadButton";
import { btn, Container, StatusDot } from "../ui";

const glance: { k: string; v: React.ReactNode }[] = [
  { k: "now", v: <>Research Assistant, N+1 Institute · RAG on AWS Bedrock</> },
  { k: "focus", v: <>LLM apps · RAG · agents · transformers</> },
  {
    k: "shipped",
    v: (
      <>
        <Link href="/projects/mini-llm" className="underline decoration-line-strong underline-offset-4 hover:decoration-accent">Mini LLM</Link>
        {" · "}
        <Link href="/projects/text-to-sql" className="underline decoration-line-strong underline-offset-4 hover:decoration-accent">Text-to-SQL</Link>
        {" · "}
        <Link href="/projects/autoreviewer" className="underline decoration-line-strong underline-offset-4 hover:decoration-accent">AutoReviewer</Link>
      </>
    ),
  },
  { k: "research", v: <>{publication.venue}, {publication.role.toLowerCase()}</> },
  { k: "edu", v: <>MS Data Science, UW–Madison · 2027</> },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <Container className="grid gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-28">
        <div>
          <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-elev px-3 py-1 text-xs text-muted" style={{ "--i": 0 } as React.CSSProperties}>
            <StatusDot tone="live" />
            {site.availability} · {site.location}
          </p>
          <h1
            id="hero-title"
            className="rise mt-6 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {site.name}
            <span className="mt-3 block text-2xl font-medium tracking-tight text-muted sm:text-3xl lg:text-4xl">
              {site.role}
            </span>
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-fg/90 text-pretty sm:text-xl" style={{ "--i": 2 } as React.CSSProperties}>
            {site.tagline}
          </p>
          <p className="rise mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty" style={{ "--i": 3 } as React.CSSProperties}>
            MS Data Science at UW–Madison, first-author IEEE researcher, and currently building a RAG writing assistant for
            the UW Department of Surgery.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--i": 4 } as React.CSSProperties}>
            <Link href="/#projects" className={btn.primary}>
              View projects <ArrowRight />
            </Link>
            <ResumeDownloadButton location="hero" />
            <Link href="/#contact" className={btn.ghost}>
              Let&apos;s connect
            </Link>
          </div>
        </div>

        <aside
          aria-label="At a glance"
          className="rise rounded-xl border border-line bg-elev/80 backdrop-blur-sm"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="ml-2 font-mono text-[11px] text-faint">jayanth.yaml</span>
          </div>
          <dl className="divide-y divide-line/70 px-4 font-mono text-[12.5px] leading-relaxed">
            {glance.map((row) => (
              <div key={row.k} className="grid grid-cols-[5.5rem_1fr] gap-3 py-2.5">
                <dt className="text-faint">{row.k}:</dt>
                <dd className="text-fg/90">{row.v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Container>
    </section>
  );
}
