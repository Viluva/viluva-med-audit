import Link from "next/link";
import { ArrowRight, Flame, Briefcase, Compass, Crown } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import { retirementCalculators } from "@/lib/siteLinks";

const icons = [Flame, Briefcase, Compass, Crown];
const gradients = [
  "from-orange-500 to-red-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-cyan-500",
  "from-fuchsia-500 to-purple-500",
];

export default function RetirementCalculatorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-8 sm:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-5">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700">
              Retirement Calculators
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
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
                className="glass rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] group"
              >
                <div
                  className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradients[index]} text-white mb-5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  {calculator.name}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-5">
                  {calculator.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 group-hover:text-orange-800 transition-colors">
                  Open calculator
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 glass rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Which retirement model fits you?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">FIRE Calculator</p>
              <p>
                Best for complete financial independence with no mandatory work.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">Barista FIRE</p>
              <p>
                Best if you want part-time income while your portfolio keeps
                growing.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">Coast FIRE</p>
              <p>
                Best if you can invest aggressively now and coast with lower
                savings later.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
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
