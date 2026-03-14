"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "CGHS BillCheck", path: "/" },
    { name: "True Cost Calculator", path: "/time-converter" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm mb-6 sm:mb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <div key={item.path} className="flex items-center gap-2 sm:gap-4">
                {index > 0 && (
                  <div className="hidden sm:block h-4 w-px bg-slate-300"></div>
                )}
                <Link
                  href={item.path}
                  className={`text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 hover:text-cyan-600"
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
          <div className="hidden sm:block h-4 w-px bg-slate-300"></div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold px-2">
            More tools coming soon...
          </div>
        </div>
      </div>
    </nav>
  );
}
