"use client";

import { useEffect } from "react";
import { color, font, shadow } from "@/lib/tokens";
import { Button } from "@/components/ui";

export default function AppError({
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
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "100%",
          textAlign: "center",
          border: "3px solid #111",
          background: color.paper,
          boxShadow: shadow.card,
          padding: 32,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <h2 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22, margin: "0 0 10px" }}>
          Algo deu errado
        </h2>
        <p style={{ color: "#555", fontSize: 14, margin: "0 0 26px", lineHeight: 1.5 }}>
          Não conseguimos carregar essa página agora. Tente de novo — se persistir,
          volte mais tarde.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Button variant="paper" onClick={() => (window.location.href = "/app")}>
            Ir para o início
          </Button>
          <Button variant="blue" onClick={reset}>
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
