"use client";

import { useState, useTransition } from "react";
import { color, font, shadow } from "@/lib/tokens";
import { saveSettings } from "@/app/app/settings-actions";
import { useToast } from "./Toast";

function Switch({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: 44,
        height: 24,
        border: "2.5px solid #111",
        background: on ? color.green : color.paper,
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          background: color.ink,
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          transition: ".15s",
        }}
      />
    </div>
  );
}

export function SettingsToggles({
  isPro,
  initialDigest,
  initialInterview,
}: {
  isPro: boolean;
  initialDigest: boolean;
  initialInterview: boolean;
}) {
  const [digest, setDigest] = useState(initialDigest);
  const [interview, setInterview] = useState(initialInterview);
  const [, start] = useTransition();
  const toast = useToast();

  function persist(
    next: { weeklyDigest: boolean; interviewEmails: boolean },
    revert: () => void
  ) {
    start(async () => {
      try {
        const res = await saveSettings(next);
        if (!res.ok) {
          revert();
          toast.error(res.error ?? "Não foi possível salvar a preferência.");
        }
      } catch {
        revert();
        toast.error("Erro de conexão. A preferência não foi salva.");
      }
    });
  }

  return (
    <div style={{ border: "3px solid #111", background: color.paper, boxShadow: shadow.card, padding: 24, maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "2px dashed #ccc" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Lembrete de entrevista por e-mail</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>
            {isPro ? "Receba um e-mail antes de cada entrevista" : "Recurso do plano Pro"}
          </div>
        </div>
        <Switch
          on={interview}
          disabled={!isPro}
          onClick={() => {
            const prev = interview;
            const v = !interview;
            setInterview(v);
            persist({ weeklyDigest: digest, interviewEmails: v }, () => setInterview(prev));
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "2px dashed #ccc" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Resumo semanal</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>Receba um resumo das suas vagas toda segunda</div>
        </div>
        <Switch
          on={digest}
          onClick={() => {
            const prev = digest;
            const v = !digest;
            setDigest(v);
            persist({ weeklyDigest: v, interviewEmails: interview }, () => setDigest(prev));
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
        <div><div style={{ fontWeight: 600, fontSize: 14 }}>Idioma</div></div>
        <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 13 }}>Português (BR)</span>
      </div>
    </div>
  );
}
