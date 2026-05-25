export interface SiteLink {
  name: string;
  href: string;
  description: string;
}

export interface SitemapLink {
  href: string;
  priority: number;
}

export const retirementCalculators: SiteLink[] = [
  {
    name: "FIRE Calculator",
    href: "/fire-calculator",
    description: "Standard FIRE planning",
  },
  {
    name: "Barista FIRE",
    href: "/barista-fire-calculator",
    description: "Semi-retirement with part-time work",
  },
  {
    name: "Coast FIRE",
    href: "/coast-fire-calculator",
    description: "Invest early and coast later",
  },
  {
    name: "Fat FIRE",
    href: "/fat-fire-calculator",
    description: "Luxury retirement planning",
  },
];

export const investmentCalculators: SiteLink[] = [
  {
    name: "SIP Calculator",
    href: "/sip-calculator",
    description: "Monthly investing growth projection",
  },
  {
    name: "Lumpsum Calculator",
    href: "/lumpsum-calculator",
    description: "One-time investment growth projection",
  },
  {
    name: "SIP + Lumpsum",
    href: "/sip-lumpsum-calculator",
    description: "Combined monthly and one-time investing",
  },
  {
    name: "SWP Calculator",
    href: "/swp-calculator",
    description: "Retirement withdrawal sustainability",
  },
];

export const utilityTools: SiteLink[] = [
  {
    name: "True Cost Calculator",
    href: "/time-converter",
    description: "See the time and opportunity cost of spending",
  },
];

export const decisionTools: SiteLink[] = [
  {
    name: "Smart Purchase Advisor",
    href: "/smart-score",
    description: "Get a 0–100 Smart Score on any purchase before you buy",
  },
  {
    name: "EMI True Cost",
    href: "/emi-calculator",
    description: "See what your EMI or '0% EMI' really costs you",
  },
  {
    name: "Buy vs Invest",
    href: "/buy-vs-invest",
    description: "The opportunity cost of buying vs compounding your money",
  },
];

export const investmentCalculatorHub: SiteLink = {
  name: "Investment Calculators",
  href: "/investment-calculators",
  description: "SIP, lumpsum, combined investing, and SWP tools",
};

export const retirementCalculatorHub: SiteLink = {
  name: "Retirement Calculators",
  href: "/retirement-calculators",
  description: "FIRE, Barista FIRE, Coast FIRE, and Fat FIRE tools",
};

export const sitemapLinks: SitemapLink[] = [
  { href: "/", priority: 1 },
  { href: "/smart-score", priority: 0.98 },
  { href: retirementCalculatorHub.href, priority: 0.95 },
  { href: investmentCalculatorHub.href, priority: 0.95 },
  ...retirementCalculators.map((link) => ({ href: link.href, priority: 0.9 })),
  ...investmentCalculators.map((link) => ({ href: link.href, priority: 0.9 })),
  ...decisionTools.map((link) => ({ href: link.href, priority: 0.92 })),
  ...utilityTools.map((link) => ({ href: link.href, priority: 0.8 })),
];
