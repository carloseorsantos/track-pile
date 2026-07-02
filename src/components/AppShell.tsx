"use client";

import { CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { color, font, shadow } from "@/lib/tokens";
import { Logo } from "./ui";

function initialsOf(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function AppShell({
  children,
  userName,
  planLabel,
  image,
}: {
  children: React.ReactNode;
  userName: string;
  planLabel: string;
  image?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const link = (href: string, label: string, icon: string) => {
    const active =
      href === "/app" ? pathname === "/app" : pathname.startsWith(href);
    const style: CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 12px",
      fontWeight: 500,
      fontSize: 14,
      marginBottom: 6,
      cursor: "pointer",
      border: active ? "2px solid #111" : "2px solid transparent",
      background: active ? color.yellow : "transparent",
      boxShadow: active ? shadow.badge : "none",
    };
    return (
      <div style={style} onClick={() => router.push(href)}>
        <span>{icon}</span>
        {label}
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <div style={{ borderRight: "3px solid #111", background: color.paper, padding: "24px 18px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 36, cursor: "pointer" }} onClick={() => router.push("/app")}>
          <Logo size={18} />
        </div>
        {link("/app", "Home", "🏠")}
        {link("/app/profile", "Perfil", "👤")}
        {link("/app/settings", "Configurações", "⚙️")}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "2px dashed #ccc", paddingTop: 16, fontSize: 13 }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "2px solid #111",
              background: color.coral,
              color: color.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
              backgroundImage: image ? `url(${image})` : undefined,
              backgroundSize: "cover",
            }}
          >
            {!image && initialsOf(userName)}
          </div>
          <div style={{ fontWeight: 700 }}>
            {userName}
            <div style={{ fontSize: 12, color: "#777", fontWeight: 400 }}>{planLabel}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "28px 36px" }}>{children}</div>
    </div>
  );
}
