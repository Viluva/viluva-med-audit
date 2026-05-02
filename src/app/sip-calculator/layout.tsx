import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Calculate the future value of your SIP with monthly contributions, expected returns, and total wealth gain. Plan long-term financial goals with precision.",
  keywords: [
    "sip calculator",
    "systematic investment plan calculator",
    "mutual fund sip calculator",
    "investment growth calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/sip-calculator",
  },
  openGraph: {
    title: "SIP Calculator | Viluva",
    description:
      "Estimate the future value of your SIP and the wealth created from consistent monthly investing.",
    type: "website",
    url: "https://www.viluva.app/sip-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator | Viluva",
    description:
      "Estimate the future value of your SIP and the wealth created from consistent monthly investing.",
  },
};

export default function SipCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
