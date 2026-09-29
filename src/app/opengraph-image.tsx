import { ogSize, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    kicker: `${site.role} · ${site.location}`,
    title: site.name,
    subtitle: "LLM systems end to end: RAG, agents, transformers from scratch, and production APIs.",
    chips: ["RAG", "Agents", "PyTorch", "FastAPI", "AWS"],
  });
}
