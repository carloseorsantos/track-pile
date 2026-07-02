"use client";

import Link from "next/link";
import { CSSProperties, ReactNode } from "react";
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
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "3px solid #111" }}>
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Logo size={22} />
      </Link>
      <div style={{ display: "flex", gap: 28, alignItems: "center", fontWeight: 500, fontSize: 14 }}>
        <Link href="/pricing" style={{ color: "#111", textDecoration: "none" }}>Como funciona</Link>
        <Link href="/pricing" style={{ color: "#111", textDecoration: "none" }}>Planos</Link>
        <Link href="/login" style={{ color: "#111", textDecoration: "none" }}>Entrar</Link>
      </div>
      <LinkButton href="/pricing" variant="yellow">Começar grátis</LinkButton>
    </div>
  );
}
