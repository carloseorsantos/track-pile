"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { color, font, shadow } from "@/lib/tokens";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const VARIANT_STYLE: Record<ToastVariant, { bg: string; fg: string; icon: string }> = {
  success: { bg: color.green, fg: color.ink, icon: "✓" },
  error: { bg: color.coral, fg: color.paper, icon: "✕" },
  warning: { bg: color.yellow, fg: color.ink, icon: "🔒" },
  info: { bg: color.ink, fg: color.cream, icon: "ℹ" },
};

const DURATION: Record<ToastVariant, number> = {
  success: 3200,
  info: 3200,
  warning: 4000,
  // errors need more reading time before they auto-dismiss
  error: 5200,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts, { id, message, variant }]);
      setTimeout(() => dismiss(id), DURATION[variant]);
    },
    [dismiss]
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      warning: (m) => push("warning", m),
      info: (m) => push("info", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 300,
          alignItems: "flex-end",
          width: "max-content",
          maxWidth: "calc(100vw - 32px)",
        }}
      >
        {toasts.map((t) => {
          const v = VARIANT_STYLE[t.variant];
          return (
            <div
              key={t.id}
              role={t.variant === "error" ? "alert" : "status"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: v.bg,
                color: v.fg,
                fontFamily: font.mono,
                fontSize: 13,
                fontWeight: 500,
                padding: "12px 14px 12px 16px",
                border: "3px solid #111",
                boxShadow: shadow.card,
                animation: "toast-slideup .2s ease-out",
                maxWidth: "min(420px, 100%)",
              }}
            >
              <span aria-hidden style={{ flexShrink: 0 }}>{v.icon}</span>
              <span style={{ lineHeight: 1.4 }}>{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Fechar aviso"
                style={{
                  marginLeft: 4,
                  border: "none",
                  background: "transparent",
                  color: v.fg,
                  cursor: "pointer",
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 15,
                  lineHeight: 1,
                  padding: 2,
                  flexShrink: 0,
                  opacity: 0.75,
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toast-slideup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
