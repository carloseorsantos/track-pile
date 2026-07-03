"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { color, font, shadow, KANBAN_COLUMNS, JobStatus } from "@/lib/tokens";
import { Job } from "@/lib/types";
import { formatDateTime } from "@/lib/dates";

function Kard({ job, onOpen, rotate }: { job: Job; onOpen: () => void; rotate: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      style={{
        border: "2.5px solid #111",
        background: color.paper,
        padding: 12,
        marginBottom: 12,
        boxShadow: shadow.sm,
        transform: `rotate(${rotate}deg)`,
        cursor: "grab",
        opacity: isDragging ? 0.3 : job.status === "Rejeitado" ? 0.6 : 1,
        touchAction: "none",
      }}
    >
      <strong style={{ display: "block", fontSize: 13, marginBottom: 2 }}>
        {job.company}
      </strong>
      <span style={{ fontSize: 12, color: "#666" }}>{job.role}</span>
      {job.nextDate && (
        <span
          style={{
            fontFamily: font.mono,
            fontWeight: 500,
            fontSize: 11,
            marginTop: 8,
            color: "#444",
            display: "block",
          }}
        >
          {formatDateTime(job.nextDate)}
        </span>
      )}
    </div>
  );
}

function Column({
  name,
  statuses,
  jobs,
  onOpen,
}: {
  name: string;
  statuses: JobStatus[];
  jobs: Job[];
  onOpen: (j: Job) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${statuses[0]}` });
  const cards = jobs.filter((j) => statuses.includes(j.status));
  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? "rgba(67,97,255,.08)" : "transparent",
        outline: isOver ? `2px dashed ${color.blue}` : "none",
        borderRadius: 2,
        minHeight: 60,
        padding: 2,
      }}
    >
      <div
        style={{
          fontFamily: font.mono,
          fontWeight: 700,
          fontSize: 12,
          padding: "8px 10px",
          border: "2px solid #111",
          background: color.ink,
          color: color.cream,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {name} · {cards.length}
      </div>
      {cards.map((j, i) => (
        <Kard key={j.id} job={j} onOpen={() => onOpen(j)} rotate={i % 2 ? 0.6 : -0.6} />
      ))}
      {cards.length === 0 && (
        <div
          style={{
            border: "2px dashed #ccc",
            padding: 16,
            textAlign: "center",
            fontFamily: font.mono,
            fontWeight: 500,
            fontSize: 11,
            color: "#bbb",
          }}
        >
          solte aqui
        </div>
      )}
    </div>
  );
}

export function Kanban({
  jobs,
  onOpen,
  onMove,
}: {
  jobs: Job[];
  onOpen: (j: Job) => void;
  onMove: (jobId: string, toStatus: JobStatus) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const active = jobs.find((j) => j.id === activeId);

  function handleStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function handleEnd(e: DragEndEvent) {
    setActiveId(null);
    const over = e.over?.id;
    if (!over || typeof over !== "string" || !over.startsWith("col:")) return;
    const target = over.slice(4) as JobStatus;
    const job = jobs.find((j) => j.id === e.active.id);
    if (job && job.status !== target) onMove(job.id, target);
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleStart} onDragEnd={handleEnd}>
      <div className="tp-kanban" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, alignItems: "start" }}>
        {KANBAN_COLUMNS.map((c) => (
          <Column key={c.name} name={c.name} statuses={c.statuses} jobs={jobs} onOpen={onOpen} />
        ))}
      </div>
      <DragOverlay>
        {active && (
          <div
            style={{
              border: "2.5px solid #111",
              background: color.paper,
              padding: 12,
              boxShadow: shadow.card,
            }}
          >
            <strong style={{ display: "block", fontSize: 13 }}>{active.company}</strong>
            <span style={{ fontSize: 12, color: "#666" }}>{active.role}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
