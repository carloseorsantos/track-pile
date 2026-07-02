"use client";

import { useEffect } from "react";
import { useToast } from "./Toast";

const MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "Esse e-mail já está cadastrado com outro método de login.",
  AccessDenied: "O acesso foi negado pelo Google. Tente novamente.",
  Configuration: "Erro de configuração do login. Tente novamente mais tarde.",
  Verification: "Link de verificação inválido ou expirado.",
};

export function AuthErrorToast({ error }: { error?: string }) {
  const toast = useToast();

  useEffect(() => {
    if (!error) return;
    toast.error(MESSAGES[error] ?? "Não foi possível entrar com o Google. Tente novamente.");
  }, [error]);

  return null;
}
