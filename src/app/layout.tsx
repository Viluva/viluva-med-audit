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
  title: {
    template: "%s | Viluva - AI Financial Tools & Calculators",
    default:
      "Viluva | AI Financial Tools, Calculators & Bill Audit for Smarter Decisions",
  },
  description:
    "Viluva is your AI-powered financial co-pilot. Instantly audit CGHS bills, calculate true costs, and benchmark your decisions with advanced tools for wealth building, medical bill validation, and personal finance confidence.",
  keywords: [
    "personal finance",
    "wealth building",
    "opportunity cost calculator",
    "CGHS bill check",
    "medical bill audit",
    "AI financial tools",
    "financial calculators",
    "cost calculator",
    "bill audit",
    "financial planning",
    "money management",
    "healthcare compliance",
    "financial decision making",
    "compare expenses",
    "save money",
    "financial wellness",
    "budgeting",
    "investment planning",
    "cost of living calculator",
    "peer benchmarking",
    "social proof finance",
  ],
  authors: [{ name: "Viluva" }],
  icons: {
    icon: "/Viluva.png",
    apple: "/Viluva.png",
  },
  openGraph: {
    title: "Viluva | AI Financial Tools & Calculators for Smarter Decisions",
    description:
      "Viluva is your AI-powered financial co-pilot. Instantly audit CGHS bills, calculate true costs, and benchmark your decisions with advanced tools for wealth building, medical bill validation, and personal finance confidence.",
    siteName: "Viluva",
    type: "website",
    url: "https://www.viluva.app/",
    images: [
      {
        url: "https://www.viluva.app/Viluva.png",
        width: 1200,
        height: 630,
        alt: "Viluva - AI Financial Tools & Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viluva | AI Financial Tools & Calculators for Smarter Decisions",
    description:
      "Viluva is your AI-powered financial co-pilot. Instantly audit CGHS bills, calculate true costs, and benchmark your decisions with advanced tools for wealth building, medical bill validation, and personal finance confidence.",
    images: ["https://www.viluva.app/Viluva.png"],
    site: "@viluva",
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
        {/* Canonical URL for SEO */}
        <link rel="canonical" href="https://www.viluva.app/" />
        {/* Favicon and Apple Touch Icon */}
        <link rel="icon" href="/Viluva.png" />
        <link rel="apple-touch-icon" href="/Viluva.png" />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Viluva | Smarter Financial Decisions"
        />
        <meta
          property="og:description"
          content="Viluva is your proactive financial co-pilot helping you make smart decisions for the future. Try our True Cost Calculator and CGHS BillCheck."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.viluva.app/" />
        <meta property="og:site_name" content="Viluva" />
        <meta property="og:image" content="https://www.viluva.app/Viluva.png" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Viluva | Smarter Financial Decisions"
        />
        <meta
          name="twitter:description"
          content="Viluva is your proactive financial co-pilot helping you make smart decisions for the future."
        />
        <meta
          name="twitter:image"
          content="https://www.viluva.app/Viluva.png"
        />
        {/* Robots and Sitemap */}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link
          rel="sitemap"
          type="application/xml"
          href="https://www.viluva.app/sitemap.xml"
        />
      </head>
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
                "Viluva is your proactive financial co-pilot. Make smart decisions for the future with our AI-powered True Cost Calculator and CGHS BillCheck compliance validator.",
              publisher: {
                "@type": "Organization",
                name: "Viluva",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.viluva.app/Viluva.png",
                },
              },
              sameAs: [
                "https://twitter.com/viluva",
                "https://www.linkedin.com/company/viluva",
              ],
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
