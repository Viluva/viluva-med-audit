import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";
import ToolsFooter from "@/components/ToolsFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.viluva.app"),
  title: {
    template: "%s | Viluva",
    default: "Viluva | Know the Real Worth, Before You Decide",
  },
  description:
    "Free calculators for retirement, investing, loans, and everyday spending decisions. Clear math, honest breakdowns, no sign-up — built for India.",
  keywords: [
    "personal finance",
    "wealth building",
    "opportunity cost calculator",
    "FIRE calculator",
    "SIP calculator",
    "financial calculators",
    "cost calculator",
    "financial planning",
    "money management",
    "financial decision making",
    "compare expenses",
    "save money",
    "financial wellness",
    "budgeting",
    "investment planning",
    "cost of living calculator",
    "retirement planning",
    "SWP calculator",
    "coast FIRE",
  ],
  authors: [{ name: "Viluva" }],
  icons: {
    icon: "/Viluva.png",
    apple: "/Viluva.png",
  },
  alternates: {
    canonical: "https://www.viluva.app/",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Viluva | Know the Real Worth, Before You Decide",
    description:
      "Free calculators for retirement, investing, loans, and everyday spending decisions. Clear math, honest breakdowns, no sign-up — built for India.",
    siteName: "Viluva",
    type: "website",
    url: "https://www.viluva.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viluva | Know the Real Worth, Before You Decide",
    description:
      "Free calculators for retirement, investing, loans, and everyday spending decisions. Clear math, honest breakdowns, no sign-up — built for India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Viluva",
              url: "https://www.viluva.app/",
              description:
                "Free calculators for retirement, investing, loans, and everyday spending decisions — clear math, honest breakdowns, built for India.",
              publisher: {
                "@type": "Organization",
                name: "Viluva",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.viluva.app/Viluva.png",
                },
              },
            }),
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1902822890921555"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <GoogleAnalytics />
        {children}
        <ToolsFooter />
      </body>
    </html>
  );
}
