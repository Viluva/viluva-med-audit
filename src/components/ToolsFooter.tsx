"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import {
  investmentCalculators,
  retirementCalculators,
  decisionTools,
  utilityTools,
} from "@/lib/siteLinks";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface ToolsFooterProps {
  companyName?: string;
  tagline?: string;
  showBackToTop?: boolean;
  customSections?: FooterSection[];
}

export default function ToolsFooter({
  companyName = "Viluva",
  tagline = "The one place for every money question — plan, calculate, and decide with confidence.",
  showBackToTop = true,
  customSections,
}: ToolsFooterProps = {}) {
  const defaultSections: FooterSection[] = [
    {
      title: "Retirement",
      links: retirementCalculators.map((link) => ({ label: link.name, href: link.href })),
    },
    {
      title: "Investing",
      links: investmentCalculators.map((link) => ({ label: link.name, href: link.href })),
    },
    {
      title: "Money Tools",
      links: [...decisionTools, ...utilityTools].map((link) => ({
        label: link.name,
        href: link.href,
      })),
    },
  ];

  const sections = customSections || defaultSections;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full bg-[#0b1120] text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image src="/Viluva.png" alt="Viluva" width={28} height={28} />
              <h3 className="text-xl font-black text-white">{companyName}</h3>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              {tagline}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 border border-slate-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Free to use · No account required
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-indigo-400 transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} {companyName}. For educational purposes only. Not financial advice.
            </p>
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-400 transition-colors group"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
