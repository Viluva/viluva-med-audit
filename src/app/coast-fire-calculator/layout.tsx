import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coast FIRE Calculator",
  description:
    "Find your Coast FIRE number and see how much you need to invest now to let compounding do the rest. Achieve financial independence by coasting to retirement.",
  keywords: [
    "coast fire calculator",
    "financial independence",
    "retirement planning",
    "fire movement",
    "personal finance",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/coast-fire-calculator",
  },
  openGraph: {
    title: "Coast FIRE Calculator | Viluva",
    description:
      "Find your Coast FIRE number and see how much you need to invest now to let compounding do the rest. Achieve financial independence by coasting to retirement.",
    type: "website",
    url: "https://www.viluva.app/coast-fire-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coast FIRE Calculator | Viluva",
    description:
      "Find your Coast FIRE number and see how much you need to invest now to let compounding do the rest. Achieve financial independence by coasting to retirement.",
  },
};

export default function CoastFireCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
