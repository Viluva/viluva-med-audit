import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Comparison Calculator",
  description:
    "Compare two loan offers side by side — interest rate, tenure, and processing fees — to see which one actually costs less over its full term.",
  keywords: [
    "loan comparison calculator",
    "home loan comparison",
    "personal loan comparison",
    "compare loan offers",
    "EMI comparison calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/loan-comparison-calculator",
  },
  openGraph: {
    title: "Loan Comparison Calculator | Viluva",
    description:
      "Compare two loan offers side by side to see which one actually costs less over its full term.",
    type: "website",
    url: "https://www.viluva.app/loan-comparison-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Comparison Calculator | Viluva",
    description:
      "Compare two loan offers side by side to see which one actually costs less over its full term.",
  },
};

export default function LoanComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
