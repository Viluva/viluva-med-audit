"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import {
  investmentCalculatorHub,
  investmentCalculators,
  retirementCalculatorHub,
  retirementCalculators,
  utilityTools,
  decisionTools,
} from "@/lib/siteLinks";

const NAV_LINK =
  "flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer";

function DropdownPanel({
  hub,
  items,
  isOpen,
  onEnter,
  onLeave,
}: {
  hub: { name: string; href: string; description: string };
  items: { name: string; href: string; description: string }[];
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 overflow-hidden">
        <Link
          href={hub.href}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm text-indigo-700 hover:bg-indigo-50 transition-colors mb-1"
        >
          <div>
            <div className="font-bold">{hub.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{hub.description}</div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
        </Link>
        <div className="h-px bg-slate-100 mx-2 mb-1" />
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-3.5 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePageNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<
    "retirement" | "investment" | "money" | null
  >(null);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const moneyTools = [...decisionTools, ...utilityTools];

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <Image
                src="/Viluva.png"
                alt="Viluva"
                width={32}
                height={32}
                priority
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Viluva
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("retirement")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className={NAV_LINK}>
                  Retirement
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <DropdownPanel
                  hub={retirementCalculatorHub}
                  items={retirementCalculators}
                  isOpen={openMenu === "retirement"}
                  onEnter={() => setOpenMenu("retirement")}
                  onLeave={() => setOpenMenu(null)}
                />
              </div>

              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("investment")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className={NAV_LINK}>
                  Investing
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <DropdownPanel
                  hub={investmentCalculatorHub}
                  items={investmentCalculators}
                  isOpen={openMenu === "investment"}
                  onEnter={() => setOpenMenu("investment")}
                  onLeave={() => setOpenMenu(null)}
                />
              </div>

              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("money")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className={NAV_LINK}>
                  Money Tools
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {openMenu === "money" && (
                  <div
                    onMouseEnter={() => setOpenMenu("money")}
                    onMouseLeave={() => setOpenMenu(null)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2">
                      {moneyTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="block px-3.5 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <div className="font-semibold">{tool.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{tool.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/#waitlist" className="btn-primary text-sm py-2.5 px-5">
                Get Early Access
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-700 p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] md:hidden animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <Image src="/Viluva.png" alt="Viluva" width={28} height={28} />
                <span className="text-lg font-black text-slate-900">Viluva</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-2" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-5 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 mb-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retirement</div>
                  <Link href={retirementCalculatorHub.href} className="text-[11px] font-bold text-indigo-600">View all</Link>
                </div>
                {retirementCalculators.map((calc) => (
                  <Link key={calc.href} href={calc.href} className="block px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    {calc.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 mb-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investing</div>
                  <Link href={investmentCalculatorHub.href} className="text-[11px] font-bold text-indigo-600">View all</Link>
                </div>
                {investmentCalculators.map((calc) => (
                  <Link key={calc.href} href={calc.href} className="block px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    {calc.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Money Tools</div>
                {moneyTools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="block px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex-shrink-0">
              <Link
                href="/#waitlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full py-3"
              >
                Get Early Access
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
