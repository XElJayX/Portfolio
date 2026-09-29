import { site } from "@/lib/site";
import { CopyButton } from "../CopyButton";
import { ArrowUpRight, GitHub, HuggingFace, LinkedIn, Mail, Phone } from "../icons";
import { Reveal } from "../Reveal";
import { btn, Container, Eyebrow } from "../ui";

const channels = [
  { label: "LinkedIn", value: "in/jayanth-r-x", href: site.links.linkedin, Icon: LinkedIn },
  { label: "GitHub", value: "XElJayX", href: site.links.github, Icon: GitHub },
  { label: "Hugging Face", value: "ElJayy", href: site.links.huggingface, Icon: HuggingFace },
  { label: "Phone", value: site.phone, href: site.phoneHref, Icon: Phone },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <Eyebrow>
              <span className="text-faint">06 /</span> Contact
            </Eyebrow>
            <h2 id="contact-title" className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Let&apos;s build something that works.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Hiring for AI or ML engineering? Email is the fastest way to reach me.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <a href={`mailto:${site.email}`} className={btn.primary}>
                <Mail /> {site.email}
              </a>
              <CopyButton value={site.email} label="Copy email address" />
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {channels.map(({ label, value, href, Icon }) => {
              const external = href.startsWith("http");
              return (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-elev p-4 transition-colors hover:border-line-strong"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-subtle text-muted transition-colors group-hover:text-fg">
                      <Icon />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-muted">{label}</span>
                      <span className="block truncate text-sm font-medium">{value}</span>
                    </span>
                    {external && <ArrowUpRight className="text-faint transition-colors group-hover:text-fg" />}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
