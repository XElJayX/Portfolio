"use client";

import { useState } from "react";
import { Check, Copy } from "./icons";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link next to this still works */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="text-accent" /> : <Copy />}
      <span role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
