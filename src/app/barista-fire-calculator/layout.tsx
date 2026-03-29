import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barista FIRE Calculator",
  description:
    "Calculate your Barista FIRE number and plan your path to semi-retirement. See how much you need to save to work part-time and achieve financial independence early.",
  keywords: [
    "barista fire calculator",
    "financial independence",
    "early retirement",
    "semi-retirement calculator",
    "fire movement",
    "personal finance",
    "viluva",
  ],
  openGraph: {
    title: "Barista FIRE Calculator | Viluva",
    description:
      "Calculate your Barista FIRE number and plan your path to semi-retirement. See how much you need to save to work part-time and achieve financial independence early.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barista FIRE Calculator | Viluva",
    description:
      "Calculate your Barista FIRE number and plan your path to semi-retirement. See how much you need to save to work part-time and achieve financial independence early.",
  },
};

export default function BaristaFireCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
