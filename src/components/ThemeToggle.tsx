"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "./icons";

type Theme = "light" | "dark";
const KEY = "theme";

/** Runs before paint (inlined in <head>) so there's no flash of the wrong theme. */
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('${KEY}');if(t==='light'||t==='dark')d.dataset.theme=t;}catch(e){}})();`;

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this page view */
    }
    listeners.forEach((l) => l());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        "inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle hover:text-fg " +
        (className ?? "")
      }
      aria-label={theme ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Toggle theme"}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
