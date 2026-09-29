import Link from "next/link";
import type { Project } from "@/lib/content";
import { ArrowRight } from "./icons";
import { StatusDot, TagList } from "./ui";

export function ProjectMetrics({ metrics, size = "sm" }: { metrics: Project["metrics"]; size?: "sm" | "lg" }) {
  return (
    <dl className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line">
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col-reverse gap-0.5 px-3 py-2.5">
          <dt className="text-[11px] leading-tight text-muted">{m.label}</dt>
          <dd className={size === "lg" ? "text-2xl font-semibold tracking-tight tabular-nums" : "text-lg font-semibold tracking-tight tabular-nums"}>
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectStatus({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted">
      <StatusDot tone={status.tone} />
      {status.label}
    </span>
  );
}

/** Whole card is one link (via the title's ::after overlay) for a big, accessible hit area. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-elev p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{project.kicker}</p>
        <ProjectStatus status={project.status} />
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.oneLiner}</p>
      <div className="mt-5">
        <ProjectMetrics metrics={project.metrics} />
      </div>
      <TagList items={project.stack.slice(0, 5)} label={`${project.title} technologies`} className="mt-4" />
      <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg">
        Read case study
        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </p>
      {/* Keyboard focus ring for the overlay link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-accent group-has-[:focus-visible]:ring-2" />
    </article>
  );
}
