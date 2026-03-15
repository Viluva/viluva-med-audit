"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePageNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              <div className="flex items-center">
                <Image
                  src="/Viluva.png"
                  alt="Viluva Logo"
                  width={32}
                  height={32}
                  priority
                  className="drop-shadow-md sm:w-10 sm:h-10"
                />
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Viluva
                </span>
              </div>
            </Link>
          </div>
          {/* Hamburger button */}
          <div className="absolute right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-cyan-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="mt-4">
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/cghs-billcheck"
                className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
              >
                CGHS BillCheck
              </Link>
              <Link
                href="/time-converter"
                className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
              >
                True Cost Calculator
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
