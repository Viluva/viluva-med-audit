import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator",
  description:
    "See how many months and how much interest it takes to clear your credit card balance — and how much paying only the minimum actually costs you.",
  keywords: [
    "credit card payoff calculator",
    "credit card debt calculator",
    "minimum payment calculator",
    "credit card interest calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/credit-card-payoff-calculator",
  },
  openGraph: {
    title: "Credit Card Payoff Calculator | Viluva",
    description:
      "See how many months and how much interest it takes to clear your credit card balance, and what paying only the minimum really costs.",
    type: "website",
    url: "https://www.viluva.app/credit-card-payoff-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Card Payoff Calculator | Viluva",
    description:
      "See how many months and how much interest it takes to clear your credit card balance, and what paying only the minimum really costs.",
  },
};

export default function CreditCardPayoffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
