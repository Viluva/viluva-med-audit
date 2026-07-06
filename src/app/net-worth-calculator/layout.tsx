import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Net Worth Calculator",
  description:
    "Add up your assets and liabilities to see your real net worth, your debt-to-asset ratio, and how your money is allocated.",
  keywords: [
    "net worth calculator",
    "net worth tracker",
    "personal net worth",
    "assets and liabilities calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/net-worth-calculator",
  },
  openGraph: {
    title: "Net Worth Calculator | Viluva",
    description:
      "Add up your assets and liabilities to see your real net worth and your debt-to-asset ratio.",
    type: "website",
    url: "https://www.viluva.app/net-worth-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Net Worth Calculator | Viluva",
    description:
      "Add up your assets and liabilities to see your real net worth and your debt-to-asset ratio.",
  },
};

export default function NetWorthCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
