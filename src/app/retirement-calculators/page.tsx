import Link from "next/link";
import { ArrowRight, Flame, Briefcase, Compass, Crown } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import { retirementCalculators } from "@/lib/siteLinks";

const icons = [Flame, Briefcase, Compass, Crown];

export default function RetirementCalculatorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative">
      <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none dot-grid noise-fade opacity-40" aria-hidden="true" />

      <HomePageNavigation />

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-10 sm:py-14">
        <header className="text-center mb-9">
          <div className="badge bg-white mb-5 inline-flex">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-orange-700">Retirement Calculators</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-4">
            Plan Your Financial Independence Path
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore multiple FIRE paths including traditional, Barista, Coast,
            and Fat FIRE so you can align your retirement timeline with your
            lifestyle goals.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retirementCalculators.map((calculator, index) => {
            const Icon = icons[index];

            return (
              <Link
                key={calculator.href}
                href={calculator.href}
                className="card card-hover p-6"
              >
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 text-white mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  {calculator.name}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-5">
                  {calculator.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-700">
                  Open calculator
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 card p-6 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Which retirement model fits you?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">FIRE Calculator</p>
              <p>
                Best for complete financial independence with no mandatory work.
              </p>
            </div>
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">Barista FIRE</p>
              <p>
                Best if you want part-time income while your portfolio keeps
                growing.
              </p>
            </div>
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">Coast FIRE</p>
              <p>
                Best if you can invest aggressively now and coast with lower
                savings later.
              </p>
            </div>
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">Fat FIRE</p>
              <p>
                Best when you want financial independence with a premium
                lifestyle budget.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
