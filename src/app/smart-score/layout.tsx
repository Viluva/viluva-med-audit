import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Purchase Advisor — Know Before You Buy",
  description:
    "Get a 0–100 Smart Score on any purchase. Personalised to your income, goals, and financial health. A preview of Viluva AI's purchase intelligence engine.",
  keywords: [
    "should I buy this",
    "smart purchase decision",
    "purchase score calculator",
    "know before you buy",
    "viluva smart score",
    "financial decision calculator",
    "impulse buying calculator",
    "purchase affordability calculator",
    "India personal finance tool",
  ],
  alternates: {
    canonical: "https://www.viluva.app/smart-score",
  },
  openGraph: {
    title: "Smart Purchase Advisor | Viluva",
    description:
      "Get a personalised 0–100 Smart Score on any purchase before you buy. Built on Viluva AI's 4-pillar financial intelligence engine.",
    type: "website",
    url: "https://www.viluva.app/smart-score",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Purchase Advisor | Viluva",
    description:
      "Know before you buy. Get a 0–100 Smart Score personalised to your finances, goals, and spending patterns.",
  },
};

export default function SmartScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
