import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWP Calculator",
  description:
    "Plan monthly withdrawals from your investment corpus with Viluva's SWP calculator. Estimate sustainability, ending balance, and whether your withdrawals outlast your horizon.",
  keywords: [
    "swp calculator",
    "systematic withdrawal plan calculator",
    "retirement withdrawal calculator",
    "withdrawal sustainability calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/swp-calculator",
  },
  openGraph: {
    title: "SWP Calculator | Viluva",
    description:
      "Estimate how long your corpus lasts under monthly withdrawals and expected market returns.",
    type: "website",
    url: "https://www.viluva.app/swp-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "SWP Calculator | Viluva",
    description:
      "Estimate how long your corpus lasts under monthly withdrawals and expected market returns.",
  },
};

export default function SwpCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
