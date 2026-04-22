import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumpsum Calculator",
  description:
    "Calculate the maturity value of a one-time investment with expected returns and see the total wealth gain over your chosen time horizon.",
  keywords: [
    "lumpsum calculator",
    "one time investment calculator",
    "mutual fund lumpsum calculator",
    "investment maturity calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/lumpsum-calculator",
  },
  openGraph: {
    title: "Lumpsum Calculator | Viluva",
    description:
      "Project the future value of a one-time investment and understand the wealth created over time.",
    type: "website",
    url: "https://www.viluva.app/lumpsum-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumpsum Calculator | Viluva",
    description:
      "Project the future value of a one-time investment and understand the wealth created over time.",
  },
};

export default function LumpsumCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
