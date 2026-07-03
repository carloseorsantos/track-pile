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
  disabled,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  style?: CSSProperties;
  type?: "button" | "submit";
  full?: boolean;
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const v = btnBg[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
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
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
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

/* ---------------- Plan badge ---------------- */
export function PlanBadge({
  plan,
  compact = false,
}: {
  plan: "FREE" | "PRO";
  compact?: boolean;
}) {
  const fontSize = compact ? 10 : 11;
  const padding = compact ? "3px 7px" : "4px 9px";

  if (plan !== "PRO") {
    return (
      <span
        style={{
          fontFamily: font.mono,
          fontWeight: 500,
          fontSize,
          padding,
          border: "2px solid #111",
          boxShadow: shadow.badge,
          background: color.gray,
          color: color.ink,
          display: "inline-block",
        }}
      >
        Free
      </span>
    );
  }

  return (
    <>
      <span
        style={{
          position: "relative",
          overflow: "hidden",
          fontFamily: font.display,
          fontWeight: 700,
          fontSize,
          letterSpacing: 0.5,
          padding,
          border: "2px solid #111",
          boxShadow: shadow.badge,
          background: color.yellow,
          color: color.ink,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span aria-hidden style={{ lineHeight: 1 }}>✦</span>
        PRO
        <span className="tp-plan-shine" aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      </span>
      <style>{`
        .tp-plan-shine {
          background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.75) 45%, transparent 70%);
          background-size: 200% 100%;
          background-position: 150% 0;
        }
        @media (prefers-reduced-motion: no-preference) {
          .tp-plan-shine {
            animation: tp-plan-shine 2.6s ease-in-out infinite;
          }
        }
        @keyframes tp-plan-shine {
          0% { background-position: 150% 0; }
          60%, 100% { background-position: -50% 0; }
        }
      `}</style>
    </>
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
