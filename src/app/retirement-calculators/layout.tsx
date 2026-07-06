import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retirement Calculators",
  description:
    "Explore Viluva's retirement calculators for FIRE, Barista FIRE, Coast FIRE, and Fat FIRE planning. Model your path to financial independence.",
  keywords: [
    "retirement calculators",
    "fire calculator",
    "barista fire calculator",
    "coast fire calculator",
    "fat fire calculator",
    "financial independence calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/retirement-calculators",
  },
  openGraph: {
    title: "Retirement Calculators | Viluva",
    description:
      "Explore FIRE, Barista FIRE, Coast FIRE, and Fat FIRE calculators to plan your path to financial independence.",
    type: "website",
    url: "https://www.viluva.app/retirement-calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Calculators | Viluva",
    description:
      "Explore FIRE, Barista FIRE, Coast FIRE, and Fat FIRE calculators to plan your path to financial independence.",
  },
};

export default function RetirementCalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
