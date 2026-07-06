import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "True Cost Calculator",
  description:
    "Calculate the true cost of your purchases. Find out how many hours you have to work for something, and how much that money could grow if you invested it instead.",
  keywords: [
    "opportunity cost calculator",
    "time converter",
    "true cost of a purchase",
    "time equals money",
    "financial independence",
    "viluva",
  ],
  alternates: {
    canonical: "https://www.viluva.app/time-converter",
  },
  openGraph: {
    title: "True Cost Calculator | Viluva",
    description:
      "Find out the real time cost and opportunity cost of your purchases. Time = Money.",
    type: "website",
    url: "https://www.viluva.app/time-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "True Cost Calculator | Viluva",
    description:
      "Find out the real time cost and opportunity cost of your purchases. Time = Money.",
  },
};

export default function TimeConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
