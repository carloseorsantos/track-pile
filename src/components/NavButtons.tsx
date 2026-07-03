"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { deleteAccount } from "@/app/app/settings-actions";
import { Button } from "./ui";
import { useToast } from "./Toast";

export function UpgradeButton() {
  const router = useRouter();
  return (
    <Button variant="blue" onClick={() => router.push("/pricing")}>
      Ver planos e upgrade →
    </Button>
  );
}

export function LogoutButton({ label = "Logout" }: { label?: string }) {
  return (
    <Button variant="paper" onClick={() => signOut({ callbackUrl: "/" })}>
      {label}
    </Button>
  );
}

export function DeleteAccountButton() {
  const [isPending, start] = useTransition();
  const toast = useToast();

  return (
    <Button
      variant="coral"
      onClick={() => {
        if (isPending) return;
        if (!confirm("Tem certeza? Essa ação não pode ser desfeita e apagará todas as suas vagas.")) {
          return;
        }
        start(async () => {
          try {
            const res = await deleteAccount();
            if (res.ok) {
              signOut({ callbackUrl: "/" });
            } else {
              toast.error(res.error ?? "Não foi possível excluir a conta.");
            }
          } catch {
            toast.error("Erro de conexão. A conta não foi excluída.");
          }
        });
      }}
    >
      {isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}

export function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/app" })}
      style={{
        width: "100%",
        justifyContent: "center",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 15,
        padding: "12px 22px",
        border: "3px solid #111",
        background: "#FFFCF4",
        color: "#111",
        cursor: "pointer",
        boxShadow: "3px 3px 0 #111",
      }}
    >
      <svg width={18} height={18} viewBox="0 0 48 48">
        <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.9 6.6-9.6 6.6-16.6z" />
        <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.5-9.1H4.2v5.7C7.9 41.1 15.4 46 24 46z" />
        <path fill="#FBBC05" d="M11.5 28.1c-.5-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.2C2.8 17 2 20.4 2 24s.8 7 2.2 9.8l7.3-5.7z" />
        <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4.2 30 2 24 2 15.4 2 7.9 6.9 4.2 14.2l7.3 5.7c1.8-5.2 6.7-9.1 12.5-9.1z" />
      </svg>
      Continuar com Google
    </button>
  );
}
