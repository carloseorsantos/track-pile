"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { useToast } from "./Toast";
import { startProSubscription } from "@/app/app/billing-actions";

/**
 * Starts an AbacatePay subscription checkout and redirects the browser to the
 * hosted checkout page. Used on both /pricing (may not be signed in yet) and
 * /app/profile (already signed in).
 */
export function UpgradeProButton({
  label = "Assinar Pro",
  variant = "blue",
  full,
  big,
}: {
  label?: string;
  variant?: "blue" | "yellow" | "coral" | "paper";
  full?: boolean;
  big?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await startProSubscription();
      if (!result.ok) {
        if ("needsAuth" in result && result.needsAuth) {
          router.push("/login");
          return;
        }
        toast.error(result.error ?? "Não foi possível iniciar a assinatura.");
        return;
      }
      window.location.href = result.url;
    });
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      full={full}
      style={{
        ...(big ? { padding: "16px 32px", fontSize: 16 } : {}),
        ...(isPending ? { opacity: 0.6, cursor: "wait" } : {}),
        ...(full ? { justifyContent: "center" } : {}),
      }}
    >
      {isPending ? "Redirecionando…" : label}
    </Button>
  );
}
