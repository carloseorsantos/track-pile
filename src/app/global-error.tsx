"use client";

import { useEffect } from "react";
import { color, font, shadow } from "@/lib/tokens";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: color.cream, color: color.ink, fontFamily: "'Inter', sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 380,
              textAlign: "center",
              border: "3px solid #111",
              background: color.paper,
              boxShadow: shadow.card,
              padding: 32,
            }}
          >
            <h2 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>
              TRACKPILE travou
            </h2>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 26px", lineHeight: 1.5 }}>
              Algo deu muito errado. Recarregue a página para continuar.
            </p>
            <button
              onClick={reset}
              style={{
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 22px",
                border: "3px solid #111",
                background: color.blue,
                color: color.paper,
                cursor: "pointer",
                width: "100%",
                boxShadow: shadow.sm,
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
