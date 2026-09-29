import { getProject, projects } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug)!;
  return renderOg({
    kicker: project.kicker,
    title: project.title,
    subtitle: project.oneLiner,
    chips: project.metrics.map((m) => `${m.value} ${m.label}`),
  });
}
