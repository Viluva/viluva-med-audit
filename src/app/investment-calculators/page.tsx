import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Landmark,
  PiggyBank,
  Wallet,
} from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import ToolsFooter from "@/components/ToolsFooter";
import { investmentCalculators } from "@/lib/siteLinks";

const icons = [PiggyBank, Landmark, BadgeIndianRupee, Wallet];
const gradients = [
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-indigo-500",
  "from-cyan-500 to-sky-500",
  "from-rose-500 to-orange-500",
];

export default function InvestmentCalculatorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-8 sm:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-5">
            <PiggyBank className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">
              Investment Calculators
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Plan Contributions, Growth, and Withdrawals in One Place
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Compare monthly SIPs, one-time investments, blended strategies, and
            retirement withdrawals with calculators built for realistic,
            decision-ready projections.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investmentCalculators.map((calculator, index) => {
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
                <span className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 group-hover:text-cyan-800 transition-colors">
                  Open calculator
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 glass rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            What to use when
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">SIP Calculator</p>
              <p>
                Best when you invest a fixed amount monthly and want to see
                long-term compounding.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">
                Lumpsum Calculator
              </p>
              <p>
                Best when you already have capital to deploy and want to
                estimate maturity value.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">SIP + Lumpsum</p>
              <p>
                Best when you are investing an initial amount now and topping it
                up every month.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">SWP Calculator</p>
              <p>
                Best for retirement income planning when you need recurring
                withdrawals from an existing corpus.
              </p>
            </div>
          </div>
        </section>
      </div>

      <ToolsFooter />
    </main>
  );
}
