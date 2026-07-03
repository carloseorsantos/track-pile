/**
 * TRACKPILE — Neo-Brutalist design tokens
 * Extracted verbatim from the Claude Design export (Trackpile_v1.html)
 * so the code implementation matches the prototype exactly.
 */

export const color = {
  cream: "#FDF6E9", // page background
  paper: "#FFFCF4", // surfaces / cards
  ink: "#111111", // text + borders
  blue: "#4361FF", // primary action
  yellow: "#FFD500", // accent / highlight
  coral: "#FF5A5F", // danger / rejected
  green: "#00C896", // success / offer
  gray: "#E4DFCF", // neutral badge
  line: "#E4DFCF", // table row divider
  dashed: "#ccc", // dashed dividers
} as const;

export const shadow = {
  card: "6px 6px 0 #111", // cards / modals surfaces
  sm: "3px 3px 0 #111", // buttons / badges / inputs
  badge: "2px 2px 0 #111",
  modal: "8px 8px 0 #111",
} as const;

export const font = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

/** The pressable button "sink" interaction from the prototype. */
export const pressStyle = {
  transform: "translate(3px,3px)",
  boxShadow: "0 0 0 #111",
} as const;

/** Status → badge color mapping (from the design). */
export type JobStatus =
  | "Salvo"
  | "Aplicado"
  | "Triagem RH"
  | "Entrevista técnica"
  | "Entrevista final"
  | "Oferta"
  | "Rejeitado";

export const STATUS_ORDER: JobStatus[] = [
  "Salvo",
  "Aplicado",
  "Triagem RH",
  "Entrevista técnica",
  "Entrevista final",
  "Oferta",
  "Rejeitado",
];

/** Kanban groups several statuses into 5 visual columns (per the design). */
export const KANBAN_COLUMNS: { name: string; statuses: JobStatus[] }[] = [
  { name: "SALVO", statuses: ["Salvo"] },
  { name: "APLICADO", statuses: ["Aplicado", "Triagem RH"] },
  { name: "ENTREVISTA", statuses: ["Entrevista técnica", "Entrevista final"] },
  { name: "OFERTA", statuses: ["Oferta"] },
  { name: "ENCERRADO", statuses: ["Rejeitado"] },
];

/** Currency → salary field mask/select mapping. ISO 4217 codes, curated to common ones. */
export type Currency = string;

export const CURRENCY_ORDER: Currency[] = [
  "BRL",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "CNY",
  "HKD",
  "SGD",
  "INR",
  "MXN",
  "ARS",
  "CLP",
  "COP",
  "PEN",
  "UYU",
  "ZAR",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "TRY",
  "AED",
  "NZD",
  "KRW",
  "RUB",
];

/** Editable profile language — cosmetic for now (no i18n UI translation yet). */
export const LANGUAGE_OPTIONS = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en", label: "English (US)" },
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number]["value"];

export function badgeColors(status: JobStatus): { bg: string; fg: string } {
  switch (status) {
    case "Entrevista técnica":
    case "Entrevista final":
      return { bg: color.blue, fg: color.paper };
    case "Aplicado":
      return { bg: color.yellow, fg: color.ink };
    case "Oferta":
      return { bg: color.green, fg: color.ink };
    case "Rejeitado":
      return { bg: color.coral, fg: color.paper };
    case "Salvo":
    case "Triagem RH":
    default:
      return { bg: color.gray, fg: color.ink };
  }
}
