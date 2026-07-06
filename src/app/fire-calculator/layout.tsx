import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIRE Calculator",
  description:
    "Calculate your FIRE (Financial Independence, Retire Early) number. Find out how much you need to save and invest to achieve financial freedom and retire early.",
  keywords: [
    "fire calculator",
    "financial independence",
    "retire early calculator",
    "fire movement",
    "personal finance",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/fire-calculator",
  },
  openGraph: {
    title: "FIRE Calculator | Viluva",
    description:
      "Calculate your FIRE (Financial Independence, Retire Early) number. Find out how much you need to save and invest to achieve financial freedom and retire early.",
    type: "website",
    url: "https://www.viluva.app/fire-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRE Calculator | Viluva",
    description:
      "Calculate your FIRE (Financial Independence, Retire Early) number. Find out how much you need to save and invest to achieve financial freedom and retire early.",
  },
};

export default function FireCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
