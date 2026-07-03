"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { color, shadow, font, badgeColors, JobStatus } from "@/lib/tokens";

/* ---------------- Logo ---------------- */
// SVG's text is set at font-size 30 inside a 44px-tall viewBox, so scaling
// the rendered height by 44/30 keeps `size` meaning "font size", matching
// the old text-based logo's API.
const LOGO_SVG_ASPECT = 44 / 30;

export function Logo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/logo.svg"
      alt="trackpile"
      style={{
        height: size * LOGO_SVG_ASPECT,
        width: "auto",
        userSelect: "none",
      }}
    />
  );
}

/* ---------------- Button ---------------- */
type BtnVariant = "blue" | "yellow" | "coral" | "paper";

const btnBg: Record<BtnVariant, { bg: string; fg: string }> = {
  blue: { bg: color.blue, fg: color.paper },
  yellow: { bg: color.yellow, fg: color.ink },
  coral: { bg: color.coral, fg: color.paper },
  paper: { bg: color.paper, fg: color.ink },
};

export function Button({
  children,
  variant = "paper",
  onClick,
  style,
  type = "button",
  full,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  style?: CSSProperties;
  type?: "button" | "submit";
  full?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const v = btnBg[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        fontFamily: font.display,
        fontWeight: 700,
        fontSize: 14,
        padding: "12px 22px",
        border: "3px solid #111",
        background: v.bg,
        color: v.fg,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: full ? "center" : undefined,
        width: full ? "100%" : undefined,
        boxShadow: pressed ? "0 0 0 #111" : shadow.sm,
        transform: pressed ? "translate(3px,3px)" : "none",
        transition: "transform .08s ease, box-shadow .08s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ---------------- Status badge ---------------- */
export function StatusBadge({
  status,
  flat = false,
}: {
  status: JobStatus;
  flat?: boolean;
}) {
  const { bg, fg } = badgeColors(status);
  return (
    <span
      style={{
        fontFamily: font.mono,
        fontWeight: 500,
        fontSize: 12,
        padding: "5px 10px",
        border: "2px solid #111",
        display: "inline-block",
        background: bg,
        color: fg,
        boxShadow: shadow.badge,
        transform: flat ? "none" : "rotate(-1.5deg)",
      }}
    >
      {status}
    </span>
  );
}

/* ---------------- Card ---------------- */
export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        border: "3px solid #111",
        background: color.paper,
        boxShadow: shadow.card,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
