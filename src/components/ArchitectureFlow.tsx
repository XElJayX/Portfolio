import type { ArchitectureStep } from "@/lib/content";
import { cx } from "./ui";

/**
 * Data-driven pipeline diagram. Horizontal on wide screens, vertical on
 * phones. Rendered as an ordered list so screen readers get the sequence.
 */
export function ArchitectureFlow({ steps, label }: { steps: ArchitectureStep[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col lg:flex-row lg:items-stretch">
      {steps.map((s, i) => (
        <li key={s.label} className="flex flex-col items-stretch lg:min-w-0 lg:flex-1 lg:flex-row">
          <div
            className={cx(
              "group relative flex flex-1 items-center gap-3 rounded-lg border border-line bg-elev px-3 py-2.5 transition-colors hover:border-accent/60 lg:flex-col lg:items-start lg:gap-1",
              i === 0 && "border-accent/40",
            )}
          >
            <span className="font-mono text-[10.5px] text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium leading-tight">{s.label}</span>
            {s.detail && <span className="ml-auto font-mono text-[11px] leading-tight text-muted lg:ml-0">{s.detail}</span>}
          </div>
          {i < steps.length - 1 && (
            <span aria-hidden className="flex items-center justify-center text-faint lg:px-1">
              <svg className="h-5 w-4 lg:hidden" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2v14M4 12l4 4 4-4" />
              </svg>
              <svg className="hidden h-4 w-4 lg:block" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
