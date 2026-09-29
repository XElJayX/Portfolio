import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md border border-line bg-subtle px-2 py-0.5 font-mono text-[11.5px] leading-5 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, label, className }: { items: string[]; label?: string; className?: string }) {
  return (
    <ul className={cx("flex flex-wrap gap-1.5", className)} aria-label={label}>
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-xs uppercase tracking-[0.14em] text-accent", className)}>{children}</p>
  );
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  lead,
  action,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <Eyebrow>
          <span className="text-faint">{index} /</span> {eyebrow}
        </Eyebrow>
        <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {lead && <p className="mt-4 text-base leading-relaxed text-muted text-pretty sm:text-lg">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";
export const btn = {
  primary: cx(btnBase, "bg-fg text-bg hover:bg-fg/85"),
  accent: cx(btnBase, "bg-accent text-accent-fg hover:bg-accent/85"),
  secondary: cx(btnBase, "border border-line-strong bg-elev text-fg hover:border-fg/40 hover:bg-subtle"),
  ghost: cx(btnBase, "text-muted hover:bg-subtle hover:text-fg"),
};

/** Internal or external link styled as a button. External links open in a new tab. */
export function ButtonLink({
  href,
  variant = "secondary",
  className,
  children,
  ...rest
}: { href: string; variant?: keyof typeof btn; className?: string; children: ReactNode } & Omit<
  ComponentProps<"a">,
  "href" | "className" | "children"
>) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cx(btn[variant], className)} {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cx(btn[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function StatusDot({ tone }: { tone: "live" | "idle" | "offline" | "paper" | "warn" }) {
  const color =
    tone === "live" ? "bg-accent" : tone === "warn" ? "bg-warn" : tone === "offline" ? "bg-danger" : "bg-faint";
  return (
    <span className="relative inline-flex size-2" aria-hidden>
      {tone === "live" && <span className={cx("absolute inset-0 rounded-full opacity-60 pulse-dot", color)} />}
      <span className={cx("relative inline-flex size-2 rounded-full", color)} />
    </span>
  );
}
