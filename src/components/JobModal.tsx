"use client";

import { CSSProperties, useState } from "react";
import { color, font, shadow, STATUS_ORDER } from "@/lib/tokens";
import { Button } from "./ui";
import { Job } from "@/lib/types";

const labelStyle: CSSProperties = {
  fontFamily: font.mono,
  fontWeight: 500,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: ".5px",
  color: "#555",
  display: "block",
  marginBottom: 6,
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "3px solid #111",
  background: color.paper,
  padding: "10px 12px",
  fontFamily: font.body,
  fontSize: 14,
  boxShadow: shadow.sm,
  boxSizing: "border-box",
};

const SOURCES = ["LinkedIn", "Indicação", "Gupy", "Site da empresa", "Outro"];

export type JobFormValue = Omit<Job, "id">;

const empty: JobFormValue = {
  company: "",
  role: "",
  status: "Salvo",
  source: "LinkedIn",
  link: "",
  appliedAt: "",
  nextDate: "",
  salary: "",
  notes: "",
};

export function JobModal({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial?: Job | null;
  onClose: () => void;
  onSave: (v: JobFormValue) => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<JobFormValue>(
    initial
      ? {
          company: initial.company,
          role: initial.role,
          status: initial.status,
          source: initial.source,
          link: initial.link ?? "",
          appliedAt: initial.appliedAt ?? "",
          nextDate: initial.nextDate ?? "",
          salary: initial.salary ?? "",
          notes: initial.notes ?? "",
        }
      : empty
  );

  const set = (k: keyof JobFormValue, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,17,17,.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        zIndex: 100,
        overflow: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: "100%",
          border: "3px solid #111",
          background: color.paper,
          boxShadow: shadow.modal,
          animation: "pop .16s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 22px",
            borderBottom: "3px solid #111",
            background: color.yellow,
          }}
        >
          <h2 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, margin: 0 }}>
            {initial ? "Editar vaga" : "Adicionar vaga"}
          </h2>
          <div
            onClick={onClose}
            style={{
              cursor: "pointer",
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1,
              width: 30,
              height: 30,
              border: "2px solid #111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: color.paper,
            }}
          >
            ×
          </div>
        </div>

        <div style={{ padding: 22 }}>
          <div className="tp-form2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Empresa</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Nimbus Tech" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Cargo</label>
              <input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Backend Pleno" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {STATUS_ORDER.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fonte</label>
              <select value={form.source} onChange={(e) => set("source", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Link da vaga</label>
              <input value={form.link ?? ""} onChange={(e) => set("link", e.target.value)} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data de aplicação</label>
              <input value={form.appliedAt ?? ""} onChange={(e) => set("appliedAt", e.target.value)} placeholder="02/07" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Próxima data</label>
              <input value={form.nextDate ?? ""} onChange={(e) => set("nextDate", e.target.value)} placeholder="08/07 · 14h" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>
                Faixa salarial <span style={{ color: "#aaa" }}>(opcional)</span>
              </label>
              <input value={form.salary ?? ""} onChange={(e) => set("salary", e.target.value)} placeholder="R$ 8k – 11k" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Notas</label>
              <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Recrutadora: Ana. Stack: Go + Postgres." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button variant="paper" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="blue" onClick={() => onSave(form)}>
              {saving ? "Salvando..." : initial ? "Salvar" : "Adicionar vaga"}
            </Button>
          </div>
        </div>
        <style>{`@keyframes pop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  );
}
