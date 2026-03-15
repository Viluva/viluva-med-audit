import Image from "next/image";
import Link from "next/link";

export default function HomePageNavigation() {
  return (
    <nav className="w-full sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="relative flex items-center justify-between">
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
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4">
            <Link
              href="/cghs-billcheck"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              CGHS BillCheck
            </Link>
            <br />
            <Link
              href="/time-converter"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              True Cost Calculator
            </Link>
          </div>
          <div></div>
        </div>
      </div>
    </nav>
  );
}
