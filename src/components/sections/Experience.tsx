import { education, experience, publication } from "@/lib/content";
import { ArrowUpRight } from "../icons";
import { Reveal } from "../Reveal";
import { Container, SectionHeading, TagList } from "../ui";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading id="experience-title" index="03" eyebrow="Experience" title="Where I've done the work." />

        <ol className="space-y-6">
          {experience.map((job) => (
            <Reveal as="li" key={`${job.org}-${job.role}`}>
              <article className="grid gap-4 rounded-xl border border-line bg-elev p-5 sm:p-7 md:grid-cols-[11rem_1fr] md:gap-8">
                <div className="flex flex-row items-center gap-3 md:flex-col md:items-start md:gap-1.5">
                  <p className="font-mono text-xs text-muted tabular-nums">{job.period}</p>
                  {job.current && (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10.5px] text-accent">current</span>
                  )}
                  <p className="hidden text-xs text-faint md:block">{job.location}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {job.role} <span className="font-normal text-muted">· {job.org}</span>
                  </h3>
                  {job.orgDetail && <p className="text-sm text-muted">{job.orgDetail}</p>}
                  <p className="text-xs text-faint md:hidden">{job.location}</p>
                  <p className="mt-3 leading-relaxed text-fg/90">{job.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-line-strong" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {job.impact && (
                    <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {job.impact.map((m) => (
                        <div key={m.label} className="flex flex-col-reverse rounded-lg border border-line bg-subtle/50 px-3 py-2">
                          <dt className="text-[11px] leading-tight text-muted">{m.label}</dt>
                          <dd className="text-base font-semibold tabular-nums">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <TagList items={job.stack} label={`${job.org} technologies`} className="mt-5" />
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-xl border border-line bg-elev p-5 sm:p-7">
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-accent">Education</h3>
            <ul className="mt-4 space-y-4">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="font-medium">{e.school}</p>
                  <p className="text-sm text-muted">{e.degree}</p>
                  <p className="mt-0.5 font-mono text-xs text-faint">{e.period} · {e.location}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="rounded-xl border border-line bg-elev p-5 sm:p-7">
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-accent">Publication</h3>
            <p className="mt-4 font-medium leading-snug">
              <a href={publication.href} target="_blank" rel="noopener noreferrer" className="inline hover:text-accent">
                {publication.title}
                <ArrowUpRight className="ml-1 inline size-3.5 align-baseline" />
                <span className="sr-only"> (opens IEEE Xplore in a new tab)</span>
              </a>
            </p>
            <p className="mt-1 font-mono text-xs text-faint">
              {publication.role} · {publication.venue}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{publication.summary}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
