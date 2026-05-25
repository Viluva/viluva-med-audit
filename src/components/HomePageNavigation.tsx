"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  investmentCalculatorHub,
  investmentCalculators,
  retirementCalculatorHub,
  retirementCalculators,
  utilityTools,
  decisionTools,
} from "@/lib/siteLinks";

/**
 * Professional navigation bar component for the entire application.
 *
 * Features:
 * - Responsive design with mobile side drawer menu
 * - Desktop dropdown menu for calculators
 * - Sticky header with backdrop blur
 * - Smooth animations and hover effects
 * - Brand logo and gradient text
 * - Organized navigation structure
 */
export default function HomePageNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/Viluva.png"
                alt="Viluva Logo"
                width={36}
                height={36}
                priority
                className="drop-shadow-sm transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-blue-500 transition-all">
                Viluva
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Calculators Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsCalculatorsOpen(true)}
                  onMouseLeave={() => setIsCalculatorsOpen(false)}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  Retirement Calculators
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isCalculatorsOpen && (
                  <div
                    onMouseEnter={() => setIsCalculatorsOpen(true)}
                    onMouseLeave={() => setIsCalculatorsOpen(false)}
                    className="absolute top-full left-0 mt-0 pt-2 w-56 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                      <Link
                        href={retirementCalculatorHub.href}
                        className="block px-4 py-2.5 text-sm text-cyan-700 hover:bg-cyan-50 transition-colors border-b border-slate-100"
                      >
                        <div className="font-semibold">
                          All Retirement Calculators
                        </div>
                        <div className="text-xs text-slate-500">
                          Overview of every FIRE and retirement planning tool
                        </div>
                      </Link>
                      {retirementCalculators.map((calc) => (
                        <Link
                          key={calc.href}
                          href={calc.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                        >
                          <div className="font-medium">{calc.name}</div>
                          <div className="text-xs text-slate-500">
                            {calc.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <button
                  onMouseEnter={() => setIsInvestmentsOpen(true)}
                  onMouseLeave={() => setIsInvestmentsOpen(false)}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  {investmentCalculatorHub.name}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isInvestmentsOpen && (
                  <div
                    onMouseEnter={() => setIsInvestmentsOpen(true)}
                    onMouseLeave={() => setIsInvestmentsOpen(false)}
                    className="absolute top-full left-0 mt-0 pt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                      <Link
                        href={investmentCalculatorHub.href}
                        className="block px-4 py-2.5 text-sm text-cyan-700 hover:bg-cyan-50 transition-colors border-b border-slate-100"
                      >
                        <div className="font-semibold">
                          All Investment Calculators
                        </div>
                        <div className="text-xs text-slate-500">
                          Overview of every investing and withdrawal tool
                        </div>
                      </Link>
                      {investmentCalculators.map((calculator) => (
                        <Link
                          key={calculator.href}
                          href={calculator.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                        >
                          <div className="font-medium">{calculator.name}</div>
                          <div className="text-xs text-slate-500">
                            {calculator.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Decision Tools Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsDecisionOpen(true)}
                  onMouseLeave={() => setIsDecisionOpen(false)}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  Decision Tools
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isDecisionOpen && (
                  <div
                    onMouseEnter={() => setIsDecisionOpen(true)}
                    onMouseLeave={() => setIsDecisionOpen(false)}
                    className="absolute top-full left-0 mt-0 pt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                      {[...decisionTools, ...utilityTools].map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                        >
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-slate-500">{tool.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/#waitlist"
                className="ml-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                Join Waitlist
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-700 hover:text-cyan-600 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu - Outside nav for proper overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[9998] md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Side Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] md:hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/Viluva.png"
                  alt="Viluva Logo"
                  width={32}
                  height={32}
                  className="drop-shadow-sm"
                />
                <span className="text-xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Viluva
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="px-6 py-6 overflow-y-auto h-[calc(100vh-73px)]">
              <div className="space-y-6">
                {/* Calculators Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Retirement Calculators
                    </div>
                    <Link
                      href={retirementCalculatorHub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[11px] font-bold text-cyan-700"
                    >
                      View all
                    </Link>
                  </div>
                  {retirementCalculators.map((calc) => (
                    <Link
                      key={calc.href}
                      href={calc.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-cyan-600 rounded-lg transition-colors border border-slate-100"
                    >
                      <div className="font-semibold">{calc.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {calc.description}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {investmentCalculatorHub.name}
                    </div>
                    <Link
                      href={investmentCalculatorHub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[11px] font-bold text-cyan-700"
                    >
                      View all
                    </Link>
                  </div>
                  {investmentCalculators.map((calculator) => (
                    <Link
                      key={calculator.href}
                      href={calculator.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-cyan-600 rounded-lg transition-colors border border-slate-100"
                    >
                      <div className="font-semibold">{calculator.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {calculator.description}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Decision Tools Section */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Decision Tools
                  </div>
                  {[...decisionTools, ...utilityTools].map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-cyan-600 rounded-lg transition-colors border border-slate-100"
                    >
                      <div className="font-semibold">{tool.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tool.description}</div>
                    </Link>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-3 border-t border-slate-200">
                  <Link
                    href="/#waitlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all text-center shadow-md"
                  >
                    Join Waitlist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
