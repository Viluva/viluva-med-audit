import Link from "next/link";
import {
  ArrowRight,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import { investmentCalculators } from "@/lib/siteLinks";

const icons = [PiggyBank, Landmark, TrendingUp, Wallet];

export default function InvestmentCalculatorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative">
      <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none dot-grid noise-fade opacity-40" aria-hidden="true" />

      <HomePageNavigation />

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-10 sm:py-14">
        <header className="text-center mb-9">
          <div className="badge bg-white mb-5 inline-flex">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Investment Calculators</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-4">
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
                className="card card-hover p-6"
              >
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  {calculator.name}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-5">
                  {calculator.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  Open calculator
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 card p-6 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            What to use when
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">SIP Calculator</p>
              <p>
                Best when you invest a fixed amount monthly and want to see
                long-term compounding.
              </p>
            </div>
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">
                Lumpsum Calculator
              </p>
              <p>
                Best when you already have capital to deploy and want to
                estimate maturity value.
              </p>
            </div>
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">SIP + Lumpsum</p>
              <p>
                Best when you are investing an initial amount now and topping it
                up every month.
              </p>
            </div>
            <div className="card-inset p-5">
              <p className="font-bold text-slate-800 mb-1">SWP Calculator</p>
              <p>
                Best for retirement income planning when you need recurring
                withdrawals from an existing corpus.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
