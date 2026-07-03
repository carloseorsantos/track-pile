"use client";

import { CSSProperties, useState } from "react";
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
  const [open, setOpen] = useState(false);

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
      <div
        style={style}
        onClick={() => {
          setOpen(false);
          router.push(href);
        }}
      >
        <span>{icon}</span>
        {label}
      </div>
    );
  };

  return (
    <div className="tp-app" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      {/* Mobile top bar — hidden on desktop, shown <=768px via CSS */}
      <div
        className="tp-topbar"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          zIndex: 30,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: color.paper,
          borderBottom: "3px solid #111",
        }}
      >
        <button
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          style={{
            border: "2px solid #111",
            background: color.paper,
            width: 36,
            height: 36,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ☰
        </button>
        <Logo size={16} />
        <div style={{ width: 36 }} />
      </div>

      {/* Backdrop — only rendered while drawer is open (mobile only, since
          the hamburger that sets `open` is itself hidden on desktop) */}
      {open && (
        <div
          className="tp-backdrop"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 35,
          }}
        />
      )}

      <div
        className={`tp-sidebar${open ? " tp-open" : ""}`}
        style={{ borderRight: "3px solid #111", background: color.paper, padding: "24px 18px", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpen(false);
              router.push("/app");
            }}
          >
            <Logo size={18} />
          </div>
          {/* Close button — only useful while the drawer overlays the page
              on mobile; hidden on desktop where the sidebar is static. */}
          <button
            className="tp-sidebar-close"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            style={{
              display: "none",
              border: "2px solid #111",
              background: color.paper,
              width: 30,
              height: 30,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            ×
          </button>
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
      <div className="tp-main" style={{ padding: "28px 36px" }}>{children}</div>
    </div>
  );
}
