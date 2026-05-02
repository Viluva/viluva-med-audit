import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Calculators",
  description:
    "Explore Viluva's investment calculators for SIP, lumpsum, SIP plus lumpsum, and SWP planning. Compare scenarios and make smarter long-term investing decisions.",
  keywords: [
    "investment calculators",
    "sip calculator",
    "lumpsum calculator",
    "swp calculator",
    "sip lumpsum calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/investment-calculators",
  },
  openGraph: {
    title: "Investment Calculators | Viluva",
    description:
      "Explore SIP, lumpsum, SIP plus lumpsum, and SWP calculators for smart long-term investing.",
    type: "website",
    url: "https://www.viluva.app/investment-calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Calculators | Viluva",
    description:
      "Explore SIP, lumpsum, SIP plus lumpsum, and SWP calculators for smart long-term investing.",
  },
};

export default function InvestmentCalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
