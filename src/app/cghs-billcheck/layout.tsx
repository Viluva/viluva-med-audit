import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGHS BillCheck - Medical Bill Validator",
  description:
    "Professional medical bill auditing tool. Verify CGHS compliance, check for overcharges, and ensure fair pricing using official 2026 MoHFW guidelines.",
  keywords: [
    "CGHS rates",
    "medical bill audit",
    "hospital bill check",
    "overcharge detection",
    "MoHFW guidelines",
    "NABH rates",
    "viluva",
  ],
  openGraph: {
    title: "CGHS BillCheck | Viluva",
    description:
      "Verify your hospital bills against official CGHS approved rates and detect potential overcharges instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGHS BillCheck | Viluva",
    description:
      "Verify your hospital bills against official CGHS approved rates and detect potential overcharges instantly.",
  },
};

export default function CGHSBillCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
