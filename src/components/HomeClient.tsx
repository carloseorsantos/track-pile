"use client";

import { useState, useTransition, CSSProperties } from "react";
import { color, font, shadow, JobStatus } from "@/lib/tokens";
import { Job } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/dates";
import { Button, StatusBadge } from "./ui";
import { Kanban } from "./Kanban";
import { JobModal, JobFormValue } from "./JobModal";
import { useToast } from "./Toast";
import {
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
} from "@/app/app/actions";
import { FREE_JOB_LIMIT } from "@/lib/validation";

type View = "table" | "kanban";

export function HomeClient({
  initialJobs,
  isPro,
}: {
  initialJobs: Job[];
  isPro: boolean;
}) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [view, setView] = useState<View>("table");
  const [detail, setDetail] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const toast = useToast();
  const [, startTransition] = useTransition();

  const counter = isPro ? `${jobs.length} vagas` : `${jobs.length} de ${FREE_JOB_LIMIT}`;

  const CONNECTION_ERROR = "Erro de conexão. Verifique sua internet e tente novamente.";

  function openNew() {
    if (!isPro && jobs.length >= FREE_JOB_LIMIT) {
      toast.warning(`Limite do plano grátis atingido (${FREE_JOB_LIMIT}). Faça upgrade!`);
      return;
    }
    setEditing(null);
    setModalOpen(true);
  }

  function handleSave(v: JobFormValue) {
    startTransition(async () => {
      try {
        if (editing) {
          const res = await updateJob(editing.id, v);
          if (res.ok) {
            setJobs((js) =>
              js.map((j) => (j.id === editing.id ? { ...j, ...v, status: v.status as JobStatus } : j))
            );
            toast.success("Vaga atualizada!");
          } else {
            toast.error(res.error ?? "Não foi possível salvar a vaga.");
            return;
          }
        } else {
          const res = await createJob(v);
          if (res.ok && res.job) {
            setJobs((js) => [...js, res.job as unknown as Job]);
            toast.success("Vaga adicionada!");
          } else {
            toast.error(res.error ?? "Não foi possível salvar a vaga.");
            return;
          }
        }
      } catch {
        toast.error(CONNECTION_ERROR);
        return;
      }
      setModalOpen(false);
      setEditing(null);
    });
  }

  function handleMove(jobId: string, to: JobStatus) {
    // optimistic
    const prev = jobs;
    setJobs((js) => js.map((j) => (j.id === jobId ? { ...j, status: to } : j)));
    startTransition(async () => {
      try {
        const res = await updateJobStatus(jobId, to);
        if (!res.ok) {
          setJobs(prev);
          toast.error(res.error ?? "Não foi possível mover a vaga.");
        }
      } catch {
        setJobs(prev);
        toast.error(CONNECTION_ERROR);
      }
    });
  }

  function handleDelete(jobId: string) {
    const prev = jobs;
    setJobs((js) => js.filter((j) => j.id !== jobId));
    setDetail(null);
    startTransition(async () => {
      try {
        const res = await deleteJob(jobId);
        if (!res.ok) {
          setJobs(prev);
          toast.error(res.error ?? "Não foi possível excluir a vaga.");
        } else {
          toast.success("Vaga excluída");
        }
      } catch {
        setJobs(prev);
        toast.error(CONNECTION_ERROR);
      }
    });
  }

  const togBase: CSSProperties = {
    border: "none",
    padding: "9px 16px",
    fontFamily: font.mono,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    borderRight: "2px solid #111",
  };
  const togOn: CSSProperties = { ...togBase, background: color.ink, color: color.yellow };
  const togOff: CSSProperties = { ...togBase, background: color.paper, color: color.ink };

  // ---------- DETAIL VIEW ----------
  if (detail) {
    return (
      <>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <Button variant="paper" style={{ fontSize: 13, padding: "9px 16px" }} onClick={() => setDetail(null)}>
              ← Voltar
            </Button>
            <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 12, color: "#999" }}>
              Detalhes da vaga
            </span>
          </div>
          <div style={{ border: "3px solid #111", background: color.paper, boxShadow: shadow.card, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 className="tp-detail-h1" style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: "-0.5px" }}>
                  {detail.company}
                </h1>
                <p style={{ fontSize: 16, color: "#555", margin: "4px 0 0" }}>{detail.role}</p>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            <div className="tp-detail2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, margin: "26px 0" }}>
              <DetailField label="Aplicado em" value={formatDate(detail.appliedAt)} />
              <DetailField label="Próxima data" value={formatDateTime(detail.nextDate)} />
              <DetailField label="Fonte" value={detail.source} />
              <DetailField label="Faixa salarial" value={detail.salary || "—"} />
            </div>

            {detail.notes && (
              <div style={{ marginBottom: 22 }}>
                <FieldLabel>Notas</FieldLabel>
                <div style={{ border: "2px solid #111", background: color.cream, padding: 14, fontSize: 14, lineHeight: 1.6 }}>
                  {detail.notes}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {detail.link && (
                <Button variant="blue" onClick={() => window.open(detail.link!, "_blank")}>
                  Abrir vaga ↗
                </Button>
              )}
              <Button
                variant="yellow"
                onClick={() => {
                  setEditing(detail);
                  setModalOpen(true);
                }}
              >
                Editar
              </Button>
              <Button variant="coral" onClick={() => handleDelete(detail.id)}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
        {modalOpen && (
          <JobModal
            initial={editing}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSave={handleSave}
          />
        )}
      </>
    );
  }

  // ---------- LIST (TABLE / KANBAN) ----------
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <h1 className="tp-nowrap-heading" style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26, margin: 0, whiteSpace: "nowrap" }}>
          Minhas vagas{" "}
          <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 13, color: "#777" }}>— {counter}</span>
        </h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: "3px solid #111", boxShadow: shadow.sm }}>
            <button style={view === "table" ? togOn : togOff} onClick={() => setView("table")}>
              Tabela
            </button>
            <button style={view === "kanban" ? togOn : togOff} onClick={() => setView("kanban")}>
              Kanban
            </button>
            <button
              style={{ ...togBase, borderRight: "none", color: "#999", cursor: "not-allowed", display: "flex", alignItems: "center", gap: 5 }}
              onClick={() =>
                isPro
                  ? toast.info("Calendário em breve!")
                  : toast.warning("Calendário é um recurso do plano Pro.")
              }
            >
              {isPro ? "Calendário" : "🔒 Calendário"}
            </button>
          </div>
          <Button variant="blue" style={{ padding: "11px 20px" }} onClick={openNew}>
            + Nova vaga
          </Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : view === "table" ? (
        <>
          <div className="tp-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", border: "3px solid #111", background: color.paper }}>
            <thead>
              <tr>
                {["Empresa / cargo", "Status", "Aplicado em", "Próxima data", "Fonte", ""].map((h, i) => (
                  <th
                    key={i}
                    className={i >= 2 ? "tp-col-hide-mobile" : undefined}
                    style={{
                      textAlign: "left",
                      fontFamily: font.mono,
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: ".5px",
                      background: color.ink,
                      color: color.cream,
                      padding: "10px 14px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} style={{ cursor: "pointer" }} onClick={() => setDetail(j)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FBF3DD")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600 }}>{j.company}</span>
                    <span style={{ display: "block", fontWeight: 400, color: "#666", fontSize: 12, marginTop: 2 }}>{j.role}</span>
                  </td>
                  <td style={tdStyle}><StatusBadge status={j.status} /></td>
                  <td className="tp-col-hide-mobile" style={{ ...tdStyle, fontFamily: font.mono, fontWeight: 500, fontSize: 13 }}>{formatDate(j.appliedAt)}</td>
                  <td className="tp-col-hide-mobile" style={{ ...tdStyle, fontFamily: font.mono, fontWeight: 500, fontSize: 13 }}>{formatDateTime(j.nextDate)}</td>
                  <td className="tp-col-hide-mobile" style={tdStyle}>{j.source}</td>
                  <td className="tp-col-hide-mobile" style={{ ...tdStyle, textAlign: "center", fontSize: 16 }}>↗</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 12, color: "#999", marginTop: 14 }}>
            Dica: mude para o Kanban pra arrastar as vagas entre etapas.
          </div>
        </>
      ) : (
        <Kanban jobs={jobs} onOpen={setDetail} onMove={handleMove} />
      )}

      {modalOpen && (
        <JobModal
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}

const tdStyle: CSSProperties = {
  padding: "13px 14px",
  borderTop: `2px solid ${color.line}`,
  fontSize: 14,
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "#777", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 15 }}>{value}</div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ border: "3px dashed #ccc", padding: "60px 24px", textAlign: "center", background: color.paper }}>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
        Nenhuma vaga ainda.
      </div>
      <p style={{ color: "#666", marginBottom: 22 }}>Adicione a primeira vaga que você está acompanhando.</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="blue" onClick={onAdd}>+ Adicionar primeira vaga</Button>
      </div>
    </div>
  );
}
