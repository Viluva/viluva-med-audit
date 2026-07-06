import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAT FIRE Calculator",
  description:
    "Calculate your FAT FIRE number to plan for a luxurious retirement. See how much you need to save for a high-spending, financially independent lifestyle.",
  keywords: [
    "fat fire calculator",
    "financial independence",
    "luxury retirement",
    "fire movement",
    "personal finance",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/fat-fire-calculator",
  },
  openGraph: {
    title: "FAT FIRE Calculator | Viluva",
    description:
      "Calculate your FAT FIRE number to plan for a luxurious retirement. See how much you need to save for a high-spending, financially independent lifestyle.",
    type: "website",
    url: "https://www.viluva.app/fat-fire-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAT FIRE Calculator | Viluva",
    description:
      "Calculate your FAT FIRE number to plan for a luxurious retirement. See how much you need to save for a high-spending, financially independent lifestyle.",
  },
};

export default function FatFireCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
