import { ImageResponse } from "next/og";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card: dark, typographic, no imagery. */
export function renderOg({ kicker, title, subtitle, chips }: { kicker: string; title: string; subtitle: string; chips: string[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0b0a",
          color: "#eceee9",
          backgroundImage:
            "linear-gradient(to right, rgba(236,238,233,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(236,238,233,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#a6ada3" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#7dd99a" }} />
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>{title}</div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#a6ada3", lineHeight: 1.35, maxWidth: 1000 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {chips.map((c) => (
              <div
                key={c}
                style={{ display: "flex", padding: "8px 16px", border: "1px solid #353d35", borderRadius: 8, fontSize: 22, color: "#a6ada3" }}
              >
                {c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, color: "#7c8479" }}>{site.name}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
