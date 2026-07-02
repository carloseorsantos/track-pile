import type { Metadata } from "next";
import { color } from "@/lib/tokens";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "TRACKPILE — Suas vagas numa tela só",
  description:
    "Organize sua busca de emprego em tabela, kanban e calendário. Chega de planilha bagunçada e aba perdida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          background: color.cream,
          color: color.ink,
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
        }}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
