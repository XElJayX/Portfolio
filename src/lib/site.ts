/**
 * Site-wide identity and links. Everything here comes from the resume
 * (public/Jayanth_Ravimurugan_Resume.pdf). Update this file first when
 * something changes — the rest of the site reads from it.
 */
export const site = {
  name: "Jayanth Ravimurugan",
  shortName: "Jayanth R.",
  initials: "JR",
  role: "AI Engineer",
  tagline: "I build LLM systems end to end: retrieval, agents, models, APIs, and the product people actually use.",
  location: "Madison, WI",
  timezone: "America/Chicago",
  email: "jayanthravimurugan@gmail.com",
  phone: "+1 (608) 515-2600",
  phoneHref: "tel:+16085152600",
  links: {
    github: "https://github.com/XElJayX",
    linkedin: "https://www.linkedin.com/in/jayanth-r-x/",
    huggingface: "https://huggingface.co/ElJayy",
    ieee: "https://ieeexplore.ieee.org/document/11320704",
  },
  resume: {
    /** File in /public. The tracked route streams this same file. */
    file: "Jayanth_Ravimurugan_Resume.pdf",
    downloadName: "Jayanth_Ravimurugan_AI_Engineer_Resume.pdf",
    downloadHref: "/api/resume/download",
  },
  /**
   * TODO(Jayanth): confirm this line. The resume does not state what you are
   * currently seeking, so this is intentionally generic.
   */
  availability: "Open to AI / ML engineering roles",
} as const;

export function siteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);
  return (fromEnv ?? "http://localhost:3000").replace(/\/$/, "");
}
