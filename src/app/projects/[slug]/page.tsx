import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { MiniLlmDemo } from "@/components/demos/MiniLlmDemo";
import { TextToSqlDemo } from "@/components/demos/TextToSqlDemo";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, GitHub } from "@/components/icons";
import { ProjectMetrics, ProjectStatus } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Container, Eyebrow, TagList } from "@/components/ui";
import { getProject, projects, type Project } from "@/lib/content";
import review1 from "@/assets/autoreviewer/review-1.png";
import review2 from "@/assets/autoreviewer/review-2.png";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.oneLiner,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.oneLiner, url: `/projects/${project.slug}`, type: "article" },
  };
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" aria-labelledby={id} className="border-t border-line py-12 sm:py-16">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr] md:gap-10">
        <h2 id={id} className="font-mono text-xs uppercase tracking-[0.14em] text-muted md:pt-1">
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 leading-relaxed text-muted">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Demo({ project }: { project: Project }) {
  if (project.demo === "mini-llm") {
    return (
      <>
        <MiniLlmDemo />
        <p className="mt-3 text-sm text-muted">
          Requests go from this page to a Vercel serverless route, then to the model&apos;s FastAPI server on Hugging Face.
          Nothing was copied or re-hosted.
        </p>
      </>
    );
  }
  if (project.demo === "text-to-sql") {
    return (
      <>
        <TextToSqlDemo />
        <p className="mt-3 text-sm text-muted">
          This calls the project&apos;s FastAPI backend on Railway through a rate-limited proxy — every query runs the real
          retrieval → LLM → validation → PostgreSQL pipeline.
        </p>
      </>
    );
  }
  if (project.demo === "screenshots") {
    return (
      <>
        <p className="mb-4 leading-relaxed text-muted">
          The hosted instance is currently offline, so here is an unedited review the agent posted to a real pull request.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[review1, review2].map((src, i) => (
            <figure key={i} className="overflow-hidden rounded-xl border border-line bg-[#0d1117]">
              <Image
                src={src}
                alt={
                  i === 0
                    ? "AutoReviewer comment on a GitHub pull request: summary, major issues, code quality, performance, and security sections"
                    : "AutoReviewer comment continued: suggestions for improvement and an overall Approve verdict"
                }
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
                placeholder="blur"
              />
            </figure>
          ))}
        </div>
      </>
    );
  }
  return null;
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article>
      <header className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <Container className="pb-12 pt-10 sm:pb-16 sm:pt-14">
          <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <ArrowLeft /> All projects
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Eyebrow>{project.kicker}</Eyebrow>
            <ProjectStatus status={project.status} />
          </div>
          <h1 className="rise mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="rise mt-5 max-w-3xl text-lg leading-relaxed text-muted text-pretty sm:text-xl" style={{ "--i": 1 } as React.CSSProperties}>
            {project.oneLiner}
          </p>
          <div className="rise mt-7 flex flex-wrap gap-2" style={{ "--i": 2 } as React.CSSProperties}>
            {project.demo !== "none" && (
              <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-lg bg-fg px-4 py-2.5 text-sm font-medium text-bg hover:bg-fg/85">
                {project.demo === "screenshots" ? "See it in action" : "Try it here"} <ArrowRight />
              </a>
            )}
            {project.links.github && (
              <ButtonLink href={project.links.github}>
                <GitHub /> Source code
              </ButtonLink>
            )}
            {project.links.demo && (
              <ButtonLink href={project.links.demo}>
                Open full demo <ArrowUpRight />
              </ButtonLink>
            )}
            {project.links.paper && (
              <ButtonLink href={project.links.paper} variant={project.demo === "none" ? "primary" : "secondary"}>
                <FileText /> Read the paper
              </ButtonLink>
            )}
            {project.links.docs && (
              <ButtonLink href={project.links.docs} variant="ghost">
                API docs <ArrowUpRight />
              </ButtonLink>
            )}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <ProjectMetrics metrics={project.metrics} size="lg" />
            <TagList items={project.stack} label="Technologies" className="lg:justify-end" />
          </div>
        </Container>
      </header>

      <Container>
        {project.demo !== "none" && (
          <section id="demo" aria-labelledby="demo-title" className="scroll-mt-24 border-t border-line py-12 sm:py-16">
            <h2 id="demo-title" className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {project.demo === "screenshots" ? "Real output" : "Live demo"}
            </h2>
            <Demo project={project} />
          </section>
        )}

        <Block id="overview" title="Overview">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-medium">The problem</h3>
              <p className="mt-2 leading-relaxed text-muted">{project.problem}</p>
            </div>
            <div>
              <h3 className="font-medium">Why it matters</h3>
              <p className="mt-2 leading-relaxed text-muted">{project.whyItMatters}</p>
            </div>
          </div>
        </Block>

        <Block id="architecture" title="Architecture">
          <ArchitectureFlow steps={project.architecture} label={`${project.title} pipeline`} />
        </Block>

        <Block id="built" title="What I built">
          <Bullets items={project.built} />
          <p className="mt-6 rounded-lg border border-line bg-elev p-4 text-sm leading-relaxed">
            <span className="font-medium">My role · </span>
            <span className="text-muted">{project.contribution}</span>
          </p>
        </Block>

        <Block id="interesting" title="Engineering notes">
          <Bullets items={project.interesting} />
        </Block>

        {project.results && (
          <Block id="results" title="Results">
            <Bullets items={project.results} />
          </Block>
        )}

        <Block id="challenges" title="Challenges">
          <div className="grid gap-4 md:grid-cols-2">
            {project.challenges.map((c) => (
              <div key={c.title} className="rounded-xl border border-line bg-elev p-5">
                <h3 className="font-medium">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </Block>

        {project.limitations && (
          <Block id="limitations" title="Limitations">
            <Bullets items={project.limitations} />
          </Block>
        )}

        <nav aria-label="Next project" className="border-t border-line py-12 sm:py-16">
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-line bg-elev p-6 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              <span className="block font-mono text-xs uppercase tracking-[0.14em] text-muted">Next project</span>
              <span className="mt-1 block text-xl font-semibold tracking-tight">{next.title}</span>
            </span>
            <ArrowRight className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg" />
          </Link>
        </nav>
      </Container>
    </article>
  );
}
