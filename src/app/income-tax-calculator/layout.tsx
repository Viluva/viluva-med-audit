import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income Tax Calculator: Old vs New Regime (FY 2025-26)",
  description:
    "Compare your income tax under the old and new tax regimes for FY 2025-26. Enter your income and deductions to see which regime saves you more.",
  keywords: [
    "income tax calculator",
    "old vs new tax regime",
    "income tax calculator india",
    "new tax regime calculator",
    "tax regime comparison",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/income-tax-calculator",
  },
  openGraph: {
    title: "Income Tax Calculator: Old vs New Regime | Viluva",
    description:
      "Compare your income tax under the old and new tax regimes for FY 2025-26 and find out which one saves you more.",
    type: "website",
    url: "https://www.viluva.app/income-tax-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Income Tax Calculator: Old vs New Regime | Viluva",
    description:
      "Compare your income tax under the old and new tax regimes for FY 2025-26 and find out which one saves you more.",
  },
};

export default function IncomeTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
