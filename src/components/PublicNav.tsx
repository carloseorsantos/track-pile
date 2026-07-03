"use client";

import Link from "next/link";
import { CSSProperties, ReactNode, useState } from "react";
import { color, font, shadow } from "@/lib/tokens";
import { Logo } from "./ui";

const variants: Record<string, { bg: string; fg: string }> = {
  blue: { bg: color.blue, fg: color.paper },
  yellow: { bg: color.yellow, fg: color.ink },
  paper: { bg: color.paper, fg: color.ink },
};

export function LinkButton({
  href,
  children,
  variant = "paper",
  big,
}: {
  href: string;
  children: ReactNode;
  variant?: "blue" | "yellow" | "paper";
  big?: boolean;
}) {
  const v = variants[variant];
  const style: CSSProperties = {
    fontFamily: font.display,
    fontWeight: 700,
    fontSize: big ? 16 : 14,
    padding: big ? "16px 32px" : "12px 22px",
    border: "3px solid #111",
    background: v.bg,
    color: v.fg,
    boxShadow: shadow.sm,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div className="tp-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "3px solid #111" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }} onClick={() => setOpen(false)}>
          <Logo size={22} />
        </Link>
        <div className="tp-nav-links" style={{ display: "flex", gap: 28, alignItems: "center", fontWeight: 500, fontSize: 14 }}>
          <Link href="/pricing" style={{ color: "#111", textDecoration: "none" }}>Como funciona</Link>
          <Link href="/pricing" style={{ color: "#111", textDecoration: "none" }}>Planos</Link>
          <Link href="/login" style={{ color: "#111", textDecoration: "none" }}>Entrar</Link>
        </div>
        <div className="tp-nav-desktop-cta">
          <LinkButton href="/pricing" variant="yellow">Começar grátis</LinkButton>
        </div>
        <button
          className="tp-nav-burger"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "none",
            border: "2px solid #111",
            background: color.paper,
            width: 38,
            height: 38,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div
          className="tp-nav-mobile-menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: 4,
            padding: "16px 20px 20px",
            borderBottom: "3px solid #111",
            background: color.paper,
          }}
        >
          <Link href="/pricing" onClick={() => setOpen(false)} style={{ color: "#111", textDecoration: "none", fontWeight: 500, fontSize: 15, padding: "10px 0" }}>Como funciona</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} style={{ color: "#111", textDecoration: "none", fontWeight: 500, fontSize: 15, padding: "10px 0" }}>Planos</Link>
          <Link href="/login" onClick={() => setOpen(false)} style={{ color: "#111", textDecoration: "none", fontWeight: 500, fontSize: 15, padding: "10px 0" }}>Entrar</Link>
          <div style={{ marginTop: 8 }} onClick={() => setOpen(false)}>
            <LinkButton href="/pricing" variant="yellow">Começar grátis</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
