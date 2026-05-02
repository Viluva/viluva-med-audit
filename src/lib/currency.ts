const REGION_CURRENCY: Record<string, string> = {
  AE: "AED", AR: "ARS", AT: "EUR", AU: "AUD", BD: "BDT", BE: "EUR",
  BR: "BRL", CA: "CAD", CH: "CHF", CL: "CLP", CN: "CNY", CO: "COP",
  CZ: "CZK", DE: "EUR", DK: "DKK", EG: "EGP", ES: "EUR", FI: "EUR",
  FR: "EUR", GB: "GBP", GR: "EUR", HK: "HKD", HU: "HUF", ID: "IDR",
  IE: "EUR", IL: "ILS", IN: "INR", IT: "EUR", JP: "JPY", KE: "KES",
  KR: "KRW", LK: "LKR", MX: "MXN", MY: "MYR", NG: "NGN", NL: "EUR",
  NO: "NOK", NZ: "NZD", PH: "PHP", PK: "PKR", PL: "PLN", PT: "EUR",
  RO: "RON", RU: "RUB", SA: "SAR", SE: "SEK", SG: "SGD", TH: "THB",
  TR: "TRY", TW: "TWD", US: "USD", VN: "VND", ZA: "ZAR",
};

export function getLocale(): string {
  if (typeof window === "undefined") return "en-US";
  return window.navigator.language || "en-US";
}

export function getCurrencyForLocale(locale: string): string {
  const region = locale.split("-")[1]?.toUpperCase() ?? locale.toUpperCase();
  return REGION_CURRENCY[region] ?? "USD";
}

function getCurrencySymbol(locale: string, currency: string): string {
  return (
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? currency
  );
}

export function formatCurrency(value: number): string {
  const locale = getLocale();
  const currency = getCurrencyForLocale(locale);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCompactCurrency(value: number): string {
  const locale = getLocale();
  const currency = getCurrencyForLocale(locale);
  const abs = Math.abs(value);

  // Indian compact notation (lakh/crore) for Indian locale
  if (locale === "en-IN" || locale.endsWith("-IN")) {
    const sym = getCurrencySymbol(locale, currency);
    if (abs >= 1e7) return `${sym}${(value / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `${sym}${(value / 1e5).toFixed(1)} L`;
    return formatCurrency(value);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCompactAxis(value: number): string {
  const locale = getLocale();
  const currency = getCurrencyForLocale(locale);
  const abs = Math.abs(value);

  if (locale === "en-IN" || locale.endsWith("-IN")) {
    const sym = getCurrencySymbol(locale, currency);
    if (abs >= 1e7) return `${sym}${(value / 1e7).toFixed(1)}Cr`;
    if (abs >= 1e5) return `${sym}${(value / 1e5).toFixed(0)}L`;
    return formatCurrency(value);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
