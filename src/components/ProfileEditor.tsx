"use client";

import { CSSProperties, useRef, useState, useTransition } from "react";
import { color, font, LANGUAGE_OPTIONS, Language, shadow } from "@/lib/tokens";
import { updateProfile } from "@/app/app/settings-actions";
import { useToast } from "./Toast";

const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  padding: "16px 0",
};

const inputStyle: CSSProperties = {
  border: "3px solid #111",
  background: color.paper,
  padding: "8px 10px",
  fontFamily: font.body,
  fontSize: 13,
  boxShadow: shadow.sm,
  boxSizing: "border-box",
};

export function ProfileEditor({
  initialName,
  initialLanguage,
}: {
  initialName: string;
  initialLanguage: Language;
}) {
  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(initialName);
  const [, start] = useTransition();
  const toast = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  // Cancelling blurs the input itself (see cancelNameEdit), which would
  // otherwise re-trigger the onBlur save; this skips exactly that one blur.
  const skipBlurSave = useRef(false);

  function persist(next: { name: string; language: Language }, revert: () => void) {
    start(async () => {
      try {
        const res = await updateProfile(next);
        if (!res.ok) {
          revert();
          toast.error(res.error ?? "Não foi possível salvar o perfil.");
        } else {
          toast.success("Perfil atualizado.");
        }
      } catch {
        revert();
        toast.error("Erro de conexão. O perfil não foi salvo.");
      }
    });
  }

  function saveName() {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      toast.error("Nome é obrigatório");
      return;
    }
    const prev = name;
    setName(trimmed);
    setEditingName(false);
    persist({ name: trimmed, language }, () => {
      setName(prev);
      setEditingName(true);
    });
  }

  function cancelNameEdit() {
    skipBlurSave.current = true;
    // Blur explicitly, before the input unmounts, so exactly one (guarded)
    // blur event fires here instead of an unpredictable one from React
    // removing a still-focused node.
    nameInputRef.current?.blur();
    setNameDraft(name);
    setEditingName(false);
  }

  return (
    <>
      <div style={{ ...rowStyle, borderBottom: "2px dashed #ccc" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Nome de exibição</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>Como aparece no sistema</div>
        </div>
        {editingName ? (
          <input
            ref={nameInputRef}
            style={{ ...inputStyle, minWidth: 160 }}
            value={nameDraft}
            maxLength={120}
            aria-label="Nome de exibição"
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") cancelNameEdit();
            }}
            onBlur={() => {
              if (skipBlurSave.current) {
                skipBlurSave.current = false;
                return;
              }
              saveName();
            }}
            autoFocus
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 13, overflowWrap: "anywhere" }}>
              {name}
            </span>
            <button
              onClick={() => setEditingName(true)}
              aria-label="Editar nome"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
                padding: 2,
                color: "#777",
              }}
            >
              ✎
            </button>
          </div>
        )}
      </div>

      <div style={{ ...rowStyle, borderBottom: "2px dashed #ccc" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Idioma</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>
            Preferência salva — a interface ainda é exibida em português
          </div>
        </div>
        <select
          value={language}
          style={{ ...inputStyle, cursor: "pointer" }}
          onChange={(e) => {
            const prev = language;
            const next = e.target.value as Language;
            setLanguage(next);
            persist({ name, language: next }, () => setLanguage(prev));
          }}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
