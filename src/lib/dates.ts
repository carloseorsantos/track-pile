const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const memberSinceFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "Membro desde" style label, e.g. "Jul 2026". */
export function formatMemberSince(d: Date): string {
  const raw = memberSinceFormatter.format(d); // pt-BR gives "jul. de 2026"
  const cleaned = raw.replace(/\./g, "").replace(/\bde\b/g, "").replace(/\s+/g, " ").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function formatDate(d: Date | null): string {
  return d ? dateFormatter.format(d) : "—";
}

export function formatDateTime(d: Date | null): string {
  return d ? dateTimeFormatter.format(d).replace(", ", " · ") : "—";
}

export function toDateInputValue(d: Date | null): string {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function toDateTimeInputValue(d: Date | null): string {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function fromDateInputValue(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function fromDateTimeInputValue(v: string): Date | null {
  if (!v) return null;
  const [datePart, timePart] = v.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, min] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh, min);
}
