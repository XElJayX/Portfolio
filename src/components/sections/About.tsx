import Link from "next/link";
import { focusAreas, nowBuilding } from "@/lib/content";
import { ArrowUpRight } from "../icons";
import { Reveal } from "../Reveal";
import { Container, SectionHeading } from "../ui";

const proofStats = [
  { value: "92.3%", label: "F1 on financial NER with fine-tuned BERT" },
  { value: "273K", label: "parameter transformer written from scratch" },
  { value: "~500K", label: "raw SMS records turned into an NER corpus" },
  { value: "1", label: "first-author IEEE publication" },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading id="about-title" index="02" eyebrow="About" title="From idea to model to product." />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <Reveal className="space-y-5 text-base leading-relaxed text-muted text-pretty sm:text-lg">
            <p>
              I&apos;m an AI engineer and MS Data Science student at the{" "}
              <span className="text-fg">University of Wisconsin–Madison</span>. Before that I completed an integrated B.Tech +
              M.Tech in AI &amp; Machine Learning at Amity University.
            </p>
            <p>
              I care about the whole path of an AI product: getting messy data into shape, choosing — or building — the
              model, wrapping it in a reliable API, and shipping something people can use. My projects reflect that: a{" "}
              <span className="text-fg">transformer written from scratch</span> and served live, a{" "}
              <span className="text-fg">RAG system with its own evaluation harness</span>, and an{" "}
              <span className="text-fg">agent that runs unattended</span> on GitHub events.
            </p>
            <p>
              Right now I&apos;m a research assistant at the <span className="text-fg">N+1 Institute</span>, building a RAG
              application that helps surgery researchers draft grant applications — on AWS Bedrock, with HIPAA-protected
              data, where reliability and privacy aren&apos;t optional.
            </p>
          </Reveal>

          <Reveal delay={100} className="rounded-xl border border-line bg-elev p-5 sm:p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-accent">Currently building</h3>
            <ul className="mt-4 space-y-4">
              {nowBuilding.map((n) => (
                <li key={n.title} className="border-l-2 border-line pl-4">
                  <p className="font-medium">
                    {n.href ? (
                      <a href={n.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                        {n.title} <ArrowUpRight className="size-3.5" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      n.title
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{n.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="dl" className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {proofStats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 bg-elev p-5">
              <dt className="text-sm leading-snug text-muted">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
            </div>
          ))}
        </Reveal>

        <div className="mt-16">
          <h3 className="text-lg font-semibold tracking-tight">What I work on — and where to see it</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {focusAreas.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 60} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                <Link
                  href={f.proof.href}
                  className="group flex h-full flex-col rounded-xl border border-line bg-elev p-5 transition-colors hover:border-line-strong"
                >
                  <span className="font-medium">{f.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{f.body}</span>
                  <span className="mt-4 font-mono text-xs text-accent">
                    → {f.proof.label}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
