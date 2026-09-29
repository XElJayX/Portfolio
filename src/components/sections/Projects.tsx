import Link from "next/link";
import { getProject, projects } from "@/lib/content";
import { ArrowRight, GitHub } from "../icons";
import { MiniLlmDemo } from "../demos/MiniLlmDemo";
import { ProjectCard, ProjectMetrics, ProjectStatus } from "../ProjectCard";
import { Reveal } from "../Reveal";
import { btn, ButtonLink, Container, SectionHeading, TagList } from "../ui";

export function Projects() {
  const flagship = getProject("mini-llm")!;
  const rest = projects.filter((p) => p.slug !== flagship.slug);

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="projects-title"
          index="01"
          eyebrow="Selected work"
          title="Systems I've built, not just trained."
          lead="Each one covers the full path: data, model, API, deployment, and an interface. Start with the live one below — it's the real model, running on Hugging Face."
        />

        {/* Flagship: live, interactive, right on the homepage */}
        <Reveal>
          <article
            aria-labelledby="flagship-title"
            className="grid gap-8 rounded-2xl border border-line bg-subtle/40 p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10"
          >
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">Flagship · {flagship.kicker}</p>
                <ProjectStatus status={flagship.status} />
              </div>
              <h3 id="flagship-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {flagship.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted text-pretty">{flagship.oneLiner}</p>
              <ul className="mt-5 hidden space-y-2 text-sm text-muted sm:block">
                {flagship.built.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <ProjectMetrics metrics={flagship.metrics} size="lg" />
              </div>
              <TagList items={flagship.stack} label="Mini LLM technologies" className="mt-5" />
              <div className="mt-6 flex flex-wrap gap-2 lg:mt-auto lg:pt-6">
                <Link href={`/projects/${flagship.slug}`} className={btn.primary}>
                  Case study <ArrowRight />
                </Link>
                {flagship.links.github && (
                  <ButtonLink href={flagship.links.github} variant="secondary">
                    <GitHub /> Source
                  </ButtonLink>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <MiniLlmDemo compact />
            </div>
          </article>
        </Reveal>

        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
