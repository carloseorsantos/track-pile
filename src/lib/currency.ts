const DEFAULT_CURRENCY = "BRL";

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  let formatter = formatterCache.get(currency);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency });
    } catch {
      // Unrecognized currency code — fall back to the default rather than throwing.
      formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: DEFAULT_CURRENCY });
    }
    formatterCache.set(currency, formatter);
  }
  return formatter;
}

/** Masks free-typed digits into a plain numeric amount as the user types (e.g. "800000" -> "8.000,00"). No currency symbol — that's added only when displaying the value. */
export function maskSalaryInput(raw: string, currency: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  const parts = getFormatter(currency).formatToParts(cents / 100);
  return parts
    .filter((p) => p.type !== "currency" && p.type !== "literal")
    .map((p) => p.value)
    .join("")
    .trim();
}

/** Formats a stored salary amount with its currency symbol for display (e.g. "8.000,00" + "USD" -> "US$ 8.000,00"). Falls back to the raw string for legacy free-text entries with no currency. */
export function formatSalaryDisplay(salary: string | null, currency: string | null): string {
  if (!salary) return "—";
  if (!currency) return salary;
  const digits = salary.replace(/\D/g, "");
  if (!digits) return salary;
  const cents = parseInt(digits, 10);
  return getFormatter(currency).format(cents / 100);
}
