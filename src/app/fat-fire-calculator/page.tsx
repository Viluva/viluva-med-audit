"use client";
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Crown,
  Info,
  TrendingUp,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Gem,
  Star,
  DollarSign,
} from "lucide-react";

import HomePageNavigation from "@/components/HomePageNavigation";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtL = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return fmt(n);
};

function yearsToReach(
  current: number,
  target: number,
  annualSaving: number,
  rate: number
): number {
  if (current >= target) return 0;
  if (annualSaving <= 0 && rate <= 0) return Infinity;
  let lo = 0, hi = 200;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const fv =
      current * Math.pow(1 + rate, mid) +
      (rate > 0
        ? annualSaving * ((Math.pow(1 + rate, mid) - 1) / rate)
        : annualSaving * mid);
    if (fv >= target) hi = mid;
    else lo = mid;
  }
  return Math.ceil(hi);
}

function buildGrowthSeries(
  current: number,
  annualSaving: number,
  rate: number,
  maxYears: number,
  startAge: number
): { age: number; portfolio: number }[] {
  const data: { age: number; portfolio: number }[] = [];
  let pv = current;
  for (let y = 0; y <= maxYears; y++) {
    data.push({ age: startAge + y, portfolio: Math.round(pv) });
    pv = pv * (1 + rate) + annualSaving;
  }
  return data;
}

// Fat FIRE lifestyle buckets breakdown
interface LifestyleBucket {
  category: string;
  amount: number;
  color: string;
}

function buildLifestyleBuckets(totalExpenses: number): LifestyleBucket[] {
  // Rough proportions typical for Fat FIRE lifestyle
  return [
    { category: "Housing", amount: Math.round(totalExpenses * 0.28), color: "#8b5cf6" },
    { category: "Travel", amount: Math.round(totalExpenses * 0.18), color: "#a78bfa" },
    { category: "Food & Dining", amount: Math.round(totalExpenses * 0.15), color: "#c4b5fd" },
    { category: "Healthcare", amount: Math.round(totalExpenses * 0.12), color: "#7c3aed" },
    { category: "Lifestyle", amount: Math.round(totalExpenses * 0.15), color: "#6d28d9" },
    { category: "Misc / Buffer", amount: Math.round(totalExpenses * 0.12), color: "#ddd6fe" },
  ];
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  baseExpenses: string;
  luxuryMultiplier: number;
  swr: number;
  currentAge: string;
  currentSavings: string;
  annualSavings: string;
  returnRate: number;
}

interface CalcResult {
  baseExpenses: number;
  fatExpenses: number;
  fatFireTarget: number;
  leanFireTarget: number;
  standardFireTarget: number;
  currentSavings: number;
  currentAge: number;
  yearsToFatFire: number;
  fatFireAge: number | null;
  yearsToStandardFire: number;
  standardFireAge: number | null;
  pctOfFatFire: number;
  extraCorpusVsStandard: number;
  buckets: LifestyleBucket[];
  growthSeries: { age: number; portfolio: number }[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FatFIRECalculator() {
  const [formData, setFormData] = useState<FormData>({
    baseExpenses: "600000",
    luxuryMultiplier: 2.5,
    swr: 3.5,
    currentAge: "32",
    currentSavings: "2000000",
    annualSavings: "600000",
    returnRate: 12,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showBuckets, setShowBuckets] = useState(false);

  const calc = useMemo((): CalcResult => {
    const baseExpenses = Math.max(0, Number(formData.baseExpenses));
    const luxuryMultiplier = Math.max(1, Number(formData.luxuryMultiplier));
    const swr = Number(formData.swr) / 100;
    const currentAge = Math.max(18, Number(formData.currentAge));
    const currentSavings = Math.max(0, Number(formData.currentSavings));
    const annualSavings = Math.max(0, Number(formData.annualSavings));
    const returnRate = Number(formData.returnRate) / 100;

    const fatExpenses = baseExpenses * luxuryMultiplier;
    const fatFireTarget = swr > 0 ? fatExpenses / swr : 0;
    const leanFireTarget = swr > 0 ? (baseExpenses * 0.7) / swr : 0;
    const standardFireTarget = swr > 0 ? baseExpenses / swr : 0;

    const yearsToFatFire = yearsToReach(currentSavings, fatFireTarget, annualSavings, returnRate);
    const fatFireAge = yearsToFatFire === Infinity ? null : currentAge + yearsToFatFire;

    const yearsToStandardFire = yearsToReach(currentSavings, standardFireTarget, annualSavings, returnRate);
    const standardFireAge = yearsToStandardFire === Infinity ? null : currentAge + yearsToStandardFire;

    const pctOfFatFire =
      fatFireTarget > 0 ? Math.min(100, Math.round((currentSavings / fatFireTarget) * 100)) : 0;

    const extraCorpusVsStandard = Math.max(0, fatFireTarget - standardFireTarget);

    const buckets = buildLifestyleBuckets(fatExpenses);

    const chartYears = Math.min(60, (yearsToFatFire === Infinity ? 40 : yearsToFatFire) + 5);
    const growthSeries = buildGrowthSeries(
      currentSavings,
      annualSavings,
      returnRate,
      chartYears,
      currentAge
    );

    return {
      baseExpenses,
      fatExpenses,
      fatFireTarget,
      leanFireTarget,
      standardFireTarget,
      currentSavings,
      currentAge,
      yearsToFatFire,
      fatFireAge,
      yearsToStandardFire,
      standardFireAge,
      pctOfFatFire,
      extraCorpusVsStandard,
      buckets,
      growthSeries,
    };
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowResult(false);
  };
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
    setShowResult(false);
  };
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
    setShowChart(false);
    setShowBuckets(false);
  };
  const handleReset = () => {
    setFormData({
      baseExpenses: "600000",
      luxuryMultiplier: 2.5,
      swr: 3.5,
      currentAge: "32",
      currentSavings: "2000000",
      annualSavings: "600000",
      returnRate: 12,
    });
    setShowResult(false);
    setShowChart(false);
    setShowBuckets(false);
  };

  // Comparison bar data
  const comparisonData = [
    { name: "Lean FIRE", value: calc.leanFireTarget, color: "#6ee7b7" },
    { name: "Standard FIRE", value: calc.standardFireTarget, color: "#60a5fa" },
    { name: "Fat FIRE", value: calc.fatFireTarget, color: "#8b5cf6" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8 pb-12">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <br />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Fat FIRE Calculator
          </h1>
          <p className="text-slate-600 font-semibold text-base sm:text-lg mt-1 max-w-2xl px-4">
            Retire with abundance — calculate the corpus for a luxury
            lifestyle with complete financial independence.
          </p>
          <div className="flex items-center gap-2 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-violet-50 border border-violet-200 rounded-full">
            <Crown className="w-4 h-4 text-violet-600" />
            <span className="text-[10px] sm:text-xs font-black text-violet-700 uppercase tracking-wide">
              Fat FIRE = Retire Rich. Live Fully.
            </span>
          </div>
        </header>

        {/* Card */}
        <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
          <form onSubmit={handleCalculate} className="space-y-5 sm:space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Current Annual Expenses (₹)"
                name="baseExpenses"
                value={formData.baseExpenses}
                onChange={handleChange}
                hint="Your actual current yearly spend"
                accentColor="violet"
              />
              <Field
                label="Current Savings / Portfolio (₹)"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleChange}
                hint="Total invested assets right now"
                accentColor="violet"
              />
            </div>

            {/* Luxury multiplier slider */}
            <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
              <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1">
                Luxury Multiplier
              </label>
              <p className="text-xs text-slate-500 mb-3">
                How many times your current expenses would your ideal Fat FIRE lifestyle cost?
                (2x = comfortable luxury, 3x = high-end, 4x+ = ultra-wealthy)
              </p>
              <input
                type="range"
                name="luxuryMultiplier"
                min={1.5}
                max={5}
                step={0.1}
                value={formData.luxuryMultiplier}
                onChange={handleSlider}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-slate-400">1.5× (modest)</span>
                <span className="font-black text-violet-700 text-sm">
                  {formData.luxuryMultiplier}× = {fmt(Number(formData.baseExpenses) * formData.luxuryMultiplier)}/yr
                </span>
                <span className="text-slate-400">5× (ultra)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Current Age"
                name="currentAge"
                value={formData.currentAge}
                onChange={handleChange}
                min={10}
                max={80}
                accentColor="violet"
              />
              <Field
                label="Annual Savings / Investment (₹)"
                name="annualSavings"
                value={formData.annualSavings}
                onChange={handleChange}
                hint="How much you invest each year"
                accentColor="violet"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SliderField
                label="Safe Withdrawal Rate (SWR)"
                name="swr"
                min={2}
                max={5}
                step={0.1}
                value={formData.swr}
                onChange={handleSlider}
                display={`${formData.swr}%`}
                leftLabel="2% (ultra-safe)"
                rightLabel="5%"
                hint="Fat FIRE typically uses 3–3.5% for extra safety"
              />
              <SliderField
                label="Expected Annual Return"
                name="returnRate"
                min={4}
                max={18}
                step={0.5}
                value={formData.returnRate}
                onChange={handleSlider}
                display={`${formData.returnRate}% p.a.`}
                leftLabel="4%"
                rightLabel="18%"
                hint="Indian equity long-term avg: ~12–14%"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
            >
              Calculate My Fat FIRE Number
            </button>
          </form>

          {/* Results */}
          {showResult && (
            <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Headline numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                    <Crown className="w-5 h-5" />
                    Fat FIRE Target
                  </div>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight">{fmtL(calc.fatFireTarget)}</p>
                  <p className="text-xs text-white/70 mt-1">
                    {fmt(calc.fatExpenses)}/yr lifestyle · {formData.luxuryMultiplier}× multiplier
                  </p>
                  {calc.fatFireAge && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                      <Clock className="w-3 h-3" />
                      {calc.yearsToFatFire} yrs · Age {calc.fatFireAge}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
                  <p className="text-sm font-bold text-slate-700 mb-3">Progress to Fat FIRE</p>
                  <div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
                        style={{ width: `${calc.pctOfFatFire}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{fmt(calc.currentSavings)}</span>
                      <span className="font-bold text-violet-600">{calc.pctOfFatFire}%</span>
                      <span>{fmtL(calc.fatFireTarget)}</span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-500">vs Standard FIRE</p>
                      <p className="font-black text-sm text-violet-700">+{fmtL(calc.extraCorpusVsStandard)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-500">Extra years to save</p>
                      <p className="font-black text-sm text-violet-700">
                        {calc.standardFireAge && calc.fatFireAge
                          ? `+${calc.fatFireAge - calc.standardFireAge} yrs`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIRE comparison */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-sm font-bold text-slate-700 mb-4">
                  FIRE Corpus Comparison
                </p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} barSize={52}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis
                        tickFormatter={(v) =>
                          v >= 1e7 ? `${(v / 1e7).toFixed(0)}Cr` : `${(v / 1e5).toFixed(0)}L`
                        }
                        tick={{ fontSize: 10 }}
                        width={40}
                      />
                      <Tooltip content={<BarChartTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {comparisonData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status banner */}
              <FatFireStatusBanner calc={calc} />

              {/* Lifestyle breakdown toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowBuckets((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-sm font-bold text-violet-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Gem className="w-4 h-4" />
                    View Fat FIRE Lifestyle Breakdown
                  </span>
                  {showBuckets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showBuckets && (
                  <div className="mt-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-slate-400 mb-4">
                      Estimated annual spend breakdown for {fmt(calc.fatExpenses)}/yr lifestyle
                    </p>
                    <div className="space-y-2">
                      {calc.buckets.map((b) => (
                        <div key={b.category}>
                          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                            <span>{b.category}</span>
                            <span>{fmt(b.amount)}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(b.amount / calc.fatExpenses) * 100}%`,
                                backgroundColor: b.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Growth chart toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowChart((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    View Portfolio Growth Chart
                  </span>
                  {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showChart && (
                  <div className="mt-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={calc.growthSeries}>
                          <defs>
                            <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Age", position: "insideBottomRight", offset: -5, fontSize: 11 }} />
                          <YAxis
                            tickFormatter={(v) =>
                              v >= 1e7 ? `₹${(v / 1e7).toFixed(1)}Cr` : `₹${(v / 1e5).toFixed(0)}L`
                            }
                            tick={{ fontSize: 10 }}
                            width={62}
                          />
                          <Tooltip content={<GrowthTooltip />} />
                          <Area type="monotone" dataKey="portfolio" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#fatGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-3 flex-wrap">
                      {calc.standardFireAge && (
                        <span className="text-xs flex items-center gap-1.5 text-blue-600 font-medium">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          Standard FIRE @ age {calc.standardFireAge}
                        </span>
                      )}
                      {calc.fatFireAge && (
                        <span className="text-xs flex items-center gap-1.5 text-violet-700 font-medium">
                          <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                          Fat FIRE @ age {calc.fatFireAge} — {fmtL(calc.fatFireTarget)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Fat FIRE callout */}
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                <p className="text-sm text-violet-800 leading-relaxed">
                  <strong>👑 The Fat FIRE Premium:</strong> Choosing a{" "}
                  <strong>{formData.luxuryMultiplier}× lifestyle</strong> means targeting{" "}
                  <strong>{fmtL(calc.fatFireTarget)}</strong> — {" "}
                  <strong>{fmtL(calc.extraCorpusVsStandard)} more</strong> than standard FIRE.
                  That buys you business class, premium healthcare, luxury travel, and zero
                  financial compromise in retirement.
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset &amp; Start Over
              </button>
            </div>
          )}

          {/* Info box */}
          <div className="mt-8 bg-slate-50 border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-slate-800">What is Fat FIRE?</p>
                <p>
                  Fat FIRE means retiring with enough to fund a premium lifestyle —
                  typically 2–3× normal expenses. The lower SWR (3–3.5%) provides extra
                  safety for a longer, more expensive retirement.
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-6 text-center space-y-1">
            <p className="text-xs font-bold text-slate-500">Part of Viluva Tools Suite</p>
            <p className="text-xs text-slate-400">© 2026 Viluva. For educational purposes only. Not financial advice.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GrowthTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { age: number; portfolio: number } }[];
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
      <p className="font-bold text-slate-800">Age {d.age}</p>
      <p className="text-violet-600">{fmt(d.portfolio)}</p>
    </div>
  );
}

function BarChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; value: number } }[];
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
      <p className="font-bold text-slate-800">{d.name}</p>
      <p className="text-violet-600">{fmt(d.value)}</p>
    </div>
  );
}

function FatFireStatusBanner({ calc }: { calc: CalcResult }): React.ReactElement {
  if (calc.currentSavings >= calc.fatFireTarget) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-800 font-bold">
          🎉 You&apos;ve already reached Fat FIRE! You can retire in luxury right now.
        </p>
      </div>
    );
  }
  if (calc.fatFireAge === null) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-800 font-bold">
          ⚠️ Fat FIRE is not achievable at your current savings rate. Consider
          increasing annual investments or adjusting your lifestyle multiplier.
        </p>
      </div>
    );
  }
  if (calc.standardFireAge !== null && calc.fatFireAge - calc.standardFireAge <= 5) {
    return (
      <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <p className="text-sm text-violet-800 font-bold">
          ✨ Only <strong>{calc.fatFireAge - (calc.standardFireAge ?? calc.fatFireAge)} extra years</strong> separates
          you from Standard FIRE to Fat FIRE! At age{" "}
          <strong>{calc.fatFireAge}</strong>, you retire in luxury.
        </p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <p className="text-sm text-blue-800 font-bold">
        ✅ On track for Fat FIRE in <strong>{calc.yearsToFatFire} years</strong> at age{" "}
        <strong>{calc.fatFireAge}</strong>. Keep maximising investments!
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  hint,
  min,
  max,
  accentColor = "violet",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  min?: number;
  max?: number;
  accentColor?: string;
}) {
  const focusClass =
    accentColor === "violet"
      ? "focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
      : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  return (
    <div>
      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      <input
        type="number"
        name={name}
        min={min ?? 0}
        max={max}
        value={value}
        onChange={onChange}
        required
        className={`w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 ${focusClass} outline-none transition-all text-sm sm:text-base bg-white/50`}
      />
    </div>
  );
}

function SliderField({
  label,
  name,
  min,
  max,
  step,
  value,
  onChange,
  display,
  leftLabel,
  rightLabel,
  hint,
}: {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  display: string;
  leftLabel: string;
  rightLabel: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">{label}</label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{leftLabel}</span>
        <span className="font-bold text-violet-600">{display}</span>
        <span>{rightLabel}</span>
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}