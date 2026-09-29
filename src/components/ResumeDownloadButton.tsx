"use client";

import { track } from "@vercel/analytics";
import type { MouseEvent, ReactNode } from "react";
import { site } from "@/lib/site";
import { Download } from "./icons";
import { landingSource } from "./SourceCapture";
import { btn, cx } from "./ui";

/**
 * A plain link to the tracked download route — it works without JS. With JS,
 * we append the landing source so the notification can attribute the visit.
 */
export function ResumeDownloadButton({
  variant = "secondary",
  className,
  location,
  children = "Download resume",
}: {
  variant?: keyof typeof btn;
  className?: string;
  location: string;
  children?: ReactNode;
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const src = landingSource();
    if (src) e.currentTarget.href = `${site.resume.downloadHref}?src=${encodeURIComponent(src)}`;
    track("resume_download", { location });
  }

  return (
    <a
      href={site.resume.downloadHref}
      download={site.resume.downloadName}
      rel="nofollow"
      onClick={onClick}
      className={cx(btn[variant], className)}
    >
      <Download />
      {children}
    </a>
  );
}
