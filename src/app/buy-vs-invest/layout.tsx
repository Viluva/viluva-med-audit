import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy vs Invest Calculator — The Opportunity Cost of Every Purchase",
  description:
    "See what any purchase actually costs when you factor in the opportunity cost of not investing. Calculate the true price of buying vs the compound growth of investing.",
  keywords: [
    "buy vs invest calculator",
    "opportunity cost calculator",
    "should I buy or invest",
    "cost of buying vs investing",
    "compound interest vs spending",
    "investment opportunity cost India",
    "personal finance calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/buy-vs-invest",
  },
  openGraph: {
    title: "Buy vs Invest Calculator | Viluva",
    description:
      "Every rupee you spend is a rupee that can't compound. See exactly how much your purchase costs in future wealth.",
    type: "website",
    url: "https://www.viluva.app/buy-vs-invest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy vs Invest Calculator | Viluva",
    description:
      "See what any purchase actually costs when you factor in the opportunity cost of not investing that money instead.",
  },
};

export default function BuyVsInvestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
