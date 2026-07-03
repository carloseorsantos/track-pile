import { Currency } from "./tokens";

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
};

const formatterCache = new Map<Currency, Intl.NumberFormat>();

function getFormatter(currency: Currency): Intl.NumberFormat {
  let formatter = formatterCache.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
      style: "currency",
      currency,
    });
    formatterCache.set(currency, formatter);
  }
  return formatter;
}

/** Masks free-typed digits into a currency string as the user types (e.g. "800000" -> "R$ 8.000,00"). */
export function maskCurrencyInput(raw: string, currency: Currency): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  return getFormatter(currency).format(cents / 100);
}
