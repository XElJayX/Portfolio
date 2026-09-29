import { site } from "@/lib/site";
import { GitHub, LinkedIn, Mail } from "./icons";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/XElJayX/Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-faint transition-colors hover:text-fg"
          >
            Next.js · Vercel · view source
          </a>
          <span className="flex items-center gap-1">
            <a href={`mailto:${site.email}`} aria-label="Email" className="rounded-md p-1.5 hover:bg-subtle hover:text-fg">
              <Mail />
            </a>
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-md p-1.5 hover:bg-subtle hover:text-fg">
              <GitHub />
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-md p-1.5 hover:bg-subtle hover:text-fg">
              <LinkedIn />
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
