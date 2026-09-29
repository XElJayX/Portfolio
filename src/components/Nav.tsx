"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Close, Menu } from "./icons";
import { ResumeDownloadButton } from "./ResumeDownloadButton";
import { ThemeToggle } from "./ThemeToggle";
import { cx } from "./ui";

const sections = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (!onHome) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name}, home`}>
          <span className="flex size-8 items-center justify-center rounded-lg border border-line-strong bg-elev font-mono text-xs font-semibold tracking-tight transition-colors group-hover:border-accent">
            {site.initials}
          </span>
          <span className="hidden text-sm font-medium sm:inline">{site.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                href={`/#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={cx(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:text-fg",
                  active === s.id ? "text-fg" : "text-muted",
                )}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ResumeDownloadButton variant="primary" location="nav" className="!px-3 !py-2">
            Resume
          </ResumeDownloadButton>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-line md:hidden">
        <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:px-6">
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                href={`/#${s.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base text-fg hover:bg-subtle"
              >
                {s.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <ResumeDownloadButton variant="primary" location="mobile-menu" className="w-full">
              Download resume
            </ResumeDownloadButton>
          </li>
        </ul>
      </div>
    </header>
  );
}
