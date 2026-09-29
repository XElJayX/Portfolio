import { skillGroups } from "@/lib/content";
import { Reveal } from "../Reveal";
import { Container, SectionHeading } from "../ui";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="skills-title"
          index="04"
          eyebrow="Skills"
          title="The toolkit."
          lead="Only what I've used in the work above — grouped by where it sits in an AI system."
        />
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.name} delay={i * 50} className="bg-elev p-5 sm:p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{g.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={g.name}>
                {g.items.map((s) => (
                  <li key={s} className="rounded-md border border-line bg-bg px-2.5 py-1 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
