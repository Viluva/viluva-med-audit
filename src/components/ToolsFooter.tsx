"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import {
  investmentCalculators,
  retirementCalculators,
  utilityTools,
} from "@/lib/siteLinks";

/**
 * Footer link item interface
 */
interface FooterLink {
  label: string;
  href: string;
}

/**
 * Footer section interface
 */
interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Social media link interface
 */
interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * ToolsFooter Props
 */
interface ToolsFooterProps {
  /** Company name - defaults to "Viluva" */
  companyName?: string;
  /** Tagline or description */
  tagline?: string;
  /** Enable/disable back to top button */
  showBackToTop?: boolean;
  /** Custom sections - overrides default sections */
  customSections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
}

/**
 * Professional, modern footer component for the entire application.
 *
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - Organized link sections
 * - Dark theme with accessible contrast
 * - Smooth hover effects
 * - Optional back-to-top button
 * - Fully customizable via props
 *
 * @example
 * ```tsx
 * <ToolsFooter
 *   companyName="Viluva"
 *   showBackToTop={true}
 * />
 * ```
 */
export default function ToolsFooter({
  companyName = "Viluva",
  tagline = "Building tools for smarter financial decisions.",
  showBackToTop = true,
  customSections,
  socialLinks,
}: ToolsFooterProps = {}) {
  // Default sections
  const defaultSections: FooterSection[] = [
    {
      title: "Retirement",
      links: retirementCalculators.map((link) => ({
        label: link.name,
        href: link.href,
      })),
    },
    {
      title: "Investments",
      links: investmentCalculators.map((link) => ({
        label: link.name,
        href: link.href,
      })),
    },
    {
      title: "Tools",
      links: utilityTools.map((link) => ({
        label: link.name,
        href: link.href,
      })),
    },
    // {
    //   title: "Company",
    //   links: [
    //     { label: "About", href: "/#about" },
    //     { label: "Contact", href: "/#contact" },
    //   ],
    // },
    // {
    //   title: "Legal",
    //   links: [
    //     { label: "Privacy Policy", href: "/privacy" },
    //     { label: "Terms of Service", href: "/terms" },
    //   ],
    // },
  ];

  const sections = customSections || defaultSections;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block group">
              <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
                {companyName}
              </h3>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              {tagline}
            </p>
            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-cyan-400 transition-colors inline-block"
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

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
              For educational purposes only. Not financial advice.
            </p>

            {/* Back to Top Button */}
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors group"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
