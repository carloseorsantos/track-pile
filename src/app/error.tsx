"use client";

import { useEffect } from "react";
import { color, font, shadow } from "@/lib/tokens";
import { Logo, Button } from "@/components/ui";

export default function RootError({
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "repeating-linear-gradient(45deg, transparent, transparent 22px, #EFE9D8 22px, #EFE9D8 23px)",
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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Logo size={20} />
        </div>
        <h2 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>
          Algo deu errado
        </h2>
        <p style={{ color: "#555", fontSize: 14, margin: "0 0 26px", lineHeight: 1.5 }}>
          A página encontrou um erro inesperado. Tente novamente.
        </p>
        <Button variant="blue" full onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
