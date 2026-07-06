// Viluva's calculators (SIP, EMI, CGHS-style tiers, income tax slabs) are all
// India-specific, so currency is always INR — it should not depend on the
// visitor's browser locale, which would otherwise show USD/other symbols for
// numbers that are only meaningful in rupees.

const LOCALE = "en-IN";
const CURRENCY = "INR";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(1)} L`;
  return formatCurrency(value);
}

export function formatCompactAxis(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(0)}L`;
  return formatCurrency(value);
}
