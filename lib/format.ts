/**
 * Dollar formatting rules for federal_action_obligation (net obligated).
 * - Values >= $1,000: no decimals, comma separators, dollar prefix -> $29,839,358
 * - Values < $1,000: two decimals -> $154.75
 * - Negative values: display as-is with minus sign -> -$17,564,322
 * - null / unparseable -> "—"
 * Never hide, zero out, or omit negative obligation values.
 */
export function formatObligated(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "number" ? value : parseFloat(value);
  if (!Number.isFinite(num)) return "—";

  const negative = num < 0;
  const abs = Math.abs(num);
  const decimals = abs < 1000 ? 2 : 0;
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${negative ? "-" : ""}$${formatted}`;
}

/** Compact form for hero/stat cards e.g. $6.64B, $226.9M */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }
  return value.toLocaleString("en-US");
}

/** action_date / period dates -> YYYY-MM-DD */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  // values already arrive as ISO or YYYY-MM-DD; take the date portion
  const datePart = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : value;
}

export function truncate(value: string | null | undefined, max: number): string {
  if (!value) return "—";
  if (value.length <= max) return value;
  return value.slice(0, max).trimEnd() + "…";
}

export const CONFIDENCE_LABEL: Record<string, string> = {
  high: "High",
  medium: "Med",
  low: "Low",
};

export const CONFIDENCE_FULL_LABEL: Record<string, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};
