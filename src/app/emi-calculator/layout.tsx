import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI True Cost Calculator — What Your EMI Really Costs",
  description:
    "Find out what your EMI or '0% EMI' offer actually costs. See the true interest, effective APR, and real price you pay vs the listed price.",
  keywords: [
    "EMI calculator India",
    "0 percent EMI true cost",
    "EMI interest calculator",
    "buy on EMI or cash",
    "true cost of EMI",
    "effective interest rate EMI",
    "processing fee EMI calculator",
    "personal finance India",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/emi-calculator",
  },
  openGraph: {
    title: "EMI True Cost Calculator | Viluva",
    description:
      "That '0% EMI' isn't really 0%. Calculate the actual cost of any EMI offer including processing fees and effective annual rate.",
    type: "website",
    url: "https://www.viluva.app/emi-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI True Cost Calculator | Viluva",
    description:
      "Find out what your EMI really costs. True interest, effective APR, and the real premium you pay over the list price.",
  },
};

export default function EMICalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
