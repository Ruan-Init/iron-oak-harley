const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const brlCents = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

/** Cents → "R$ 89.900" (no decimals, for big-ticket display). */
export function money(cents: number): string {
  return brl.format(cents / 100);
}

/** Cents → "R$ 1.290,00" (with decimals, for totals and line items). */
export function moneyExact(cents: number): string {
  return brlCents.format(cents / 100);
}

/** Simple 48x fixed-rate installment estimate, for indicative financing copy. */
export function installment(cents: number, months = 48, monthlyRate = 0.0129): string {
  const principal = (cents * 0.8) / 100;
  const factor =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  return brlCents.format(factor);
}

export function number(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function decimal(value: number, digits = 1): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** "2026-03-14" or ISO date → "14 mar 2026" */
export function shortDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function longDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export const paymentLabels: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão de crédito",
  financiamento: "Financiamento",
};
