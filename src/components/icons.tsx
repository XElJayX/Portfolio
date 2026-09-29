import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 16, height: 16, "aria-hidden": true, focusable: false } as const;
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowRight = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Download = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);
export const Mail = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Phone = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const Copy = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>
);
export const Check = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="m5 12 5 5 9-10" /></svg>
);
export const Sun = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const Moon = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
);
export const Menu = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Close = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const FileText = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
);
export const Refresh = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>
);

export const GitHub = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
export const LinkedIn = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
export const HuggingFace = (p: P) => (
  <svg {...base} viewBox="0 0 24 24" {...stroke} {...p}>
    <circle cx="12" cy="11" r="8" />
    <path d="M9 9.5v.5M15 9.5v.5M8.5 13.5a4.5 4.5 0 0 0 7 0" />
  </svg>
);
