import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Viluva",
    default: "Viluva | From Financial Anxiety to Confident Decisions",
  },
  description:
    "Viluva is your proactive financial co-pilot. Make smart decisions for the future with our AI-powered True Cost Calculator and CGHS BillCheck compliance validator.",
  keywords: [
    "personal finance",
    "wealth building",
    "opportunity cost calculator",
    "CGHS bill check",
    "medical bill audit",
  ],
  authors: [{ name: "Viluva" }],
  icons: {
    icon: "/Viluva.png",
    apple: "/Viluva.png",
  },
  openGraph: {
    title: "Viluva | Smarter Financial Decisions",
    description:
      "Viluva is your proactive financial co-pilot helping you make smart decisions for the future. Try our True Cost Calculator and CGHS BillCheck.",
    siteName: "Viluva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viluva | Smarter Financial Decisions",
    description:
      "Viluva is your proactive financial co-pilot helping you make smart decisions for the future.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1902822890921555"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
