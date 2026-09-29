import { site } from "@/lib/site";
import { ArrowUpRight, FileText } from "../icons";
import { Reveal } from "../Reveal";
import { ResumeDownloadButton } from "../ResumeDownloadButton";
import { btn, Container, SectionHeading } from "../ui";

export function Resume() {
  const pdf = `/${site.resume.file}`;
  return (
    <section id="resume" aria-labelledby="resume-title" className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="resume-title"
          index="05"
          eyebrow="Resume"
          title="One page, one click."
          lead="No sign-up, no form, no email wall. Preview it here or download the PDF."
        />
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-elev p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <FileText className="size-5" />
              </span>
              <div>
                <p className="font-medium">{site.name}</p>
                <p className="font-mono text-xs text-muted">{site.role} · PDF · 1 page</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Education, experience at the N+1 Institute and OneBanc, three projects, and the IEEE publication — the same
              content as this site, in recruiter-ready form.
            </p>
            <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row lg:flex-col">
              <ResumeDownloadButton variant="primary" location="resume-section" className="w-full" />
              <a href={pdf} target="_blank" rel="noopener" className={`${btn.secondary} w-full`}>
                Open in new tab <ArrowUpRight />
              </a>
            </div>
          </div>

          {/* Inline PDF viewers are unreliable on phones, so the preview is desktop/tablet only. */}
          <div className="hidden overflow-hidden rounded-xl border border-line bg-subtle md:block">
            <iframe
              src={`${pdf}#view=FitH&toolbar=0&navpanes=0`}
              title={`${site.name} resume preview`}
              loading="lazy"
              className="h-[46rem] w-full"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
