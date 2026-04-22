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
    name: "CGHS BillCheck",
    href: "/cghs-billcheck",
    description: "Audit CGHS medical bills instantly",
  },
  {
    name: "True Cost Calculator",
    href: "/time-converter",
    description: "See the time and opportunity cost of spending",
  },
];

export const investmentCalculatorHub: SiteLink = {
  name: "Investment Calculators",
  href: "/investment-calculators",
  description: "SIP, lumpsum, combined investing, and SWP tools",
};

export const sitemapLinks: SitemapLink[] = [
  { href: "/", priority: 1 },
  { href: investmentCalculatorHub.href, priority: 0.95 },
  ...retirementCalculators.map((link) => ({ href: link.href, priority: 0.9 })),
  ...investmentCalculators.map((link) => ({ href: link.href, priority: 0.9 })),
  ...utilityTools.map((link) => ({ href: link.href, priority: 0.8 })),
];
