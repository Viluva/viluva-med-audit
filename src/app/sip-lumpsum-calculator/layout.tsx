import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP + Lumpsum Calculator",
  description:
    "Calculate the combined future value of a one-time investment plus monthly SIP contributions. Compare invested amount, total gains, and final corpus.",
  keywords: [
    "sip and lumpsum calculator",
    "combined investment calculator",
    "sip plus lumpsum calculator",
    "mutual fund calculator",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/sip-lumpsum-calculator",
  },
  openGraph: {
    title: "SIP + Lumpsum Calculator | Viluva",
    description:
      "Model a blended investing plan with an initial amount plus monthly SIP contributions.",
    type: "website",
    url: "https://www.viluva.app/sip-lumpsum-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP + Lumpsum Calculator | Viluva",
    description:
      "Model a blended investing plan with an initial amount plus monthly SIP contributions.",
  },
};

export default function SipLumpsumCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
