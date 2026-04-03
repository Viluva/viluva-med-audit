"use client";
import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Flame,
  Info,
  TrendingUp,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Shield,
} from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import { fireNumber, yearsToTarget, buildGrowthSeries } from "@/lib/fireMath";

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtL = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return fmt(n);
};
const buildSWRSensitivity = (expenses: number, swrRates: number[]) =>
  swrRates.map((r) => ({
    swr: `${r}%`,
    corpus: Math.round(fireNumber(expenses, r)),
    monthly: Math.round(expenses / 12),
  }));

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  expenses: string;
  swr: number;
  currentAge: string;
  currentSavings: string;
  annualIncome: string;
  annualSavings: string;
  returnRate: number;
  inflationRate: number;
}

interface CalcResult {
  expenses: number;
  fireTarget: number;
  leanFireTarget: number;
  fatFireTarget: number;
  currentSavings: number;
  currentAge: number;
  yearsToFire: number;
  fireAge: number | null;
  pctOfFire: number;
  savingsRate: number;
  annualIncome: number;
  annualSavings: number;
  monthlyExpenses: number;
  monthlyPassiveIncome: number;
  swrSensitivity: { swr: string; corpus: number; monthly: number }[];
  growthSeries: { age: number; portfolio: number }[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FIRECalculator() {
  const [formData, setFormData] = useState<FormData>({
    expenses: "600000",
    swr: 4,
    currentAge: "30",
    currentSavings: "1000000",
    annualIncome: "1200000",
    annualSavings: "400000",
    returnRate: 12,
    inflationRate: 5,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showSensitivity, setShowSensitivity] = useState(false);

  const calc = useMemo((): CalcResult => {
    const expenses = Math.max(0, Number(formData.expenses));
    const swr = Number(formData.swr);
    const currentAge = Math.max(18, Number(formData.currentAge));
    const currentSavings = Math.max(0, Number(formData.currentSavings));
    const annualIncome = Math.max(0, Number(formData.annualIncome));
    const annualSavings = Math.max(0, Number(formData.annualSavings));
    const returnRate = Number(formData.returnRate) / 100;
    const inflationRate = Number(formData.inflationRate) / 100;
    const realReturn = returnRate - inflationRate;

    const fireTarget = fireNumber(expenses, swr);
    const leanFireTarget = fireNumber(expenses * 0.7, swr);
    const fatFireTarget = fireNumber(expenses * 2.5, swr);

    const yearsToFire = yearsToTarget(
      currentSavings,
      fireTarget,
      annualSavings,
      realReturn,
    );
    const fireAge = yearsToFire === Infinity ? null : currentAge + yearsToFire;

    const pctOfFire =
      fireTarget > 0
        ? Math.min(100, Math.round((currentSavings / fireTarget) * 100))
        : 0;

    const savingsRate =
      annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;
    const monthlyExpenses = Math.round(expenses / 12);
    const monthlyPassiveIncome = Math.round(
      (currentSavings * (swr / 100)) / 12,
    );

    const swrSensitivity = buildSWRSensitivity(
      expenses,
      [2.5, 3, 3.5, 4, 4.5, 5],
    );

    const chartYears = Math.min(
      60,
      (yearsToFire === Infinity ? 40 : yearsToFire) + 5,
    );
    const growthSeries = buildGrowthSeries(
      currentSavings,
      annualSavings,
      realReturn,
      chartYears,
      currentAge,
    );

    return {
      expenses,
      fireTarget,
      leanFireTarget,
      fatFireTarget,
      currentSavings,
      currentAge,
      yearsToFire,
      fireAge,
      pctOfFire,
      savingsRate,
      annualIncome,
      annualSavings,
      monthlyExpenses,
      monthlyPassiveIncome,
      swrSensitivity,
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
    setShowSensitivity(false);
  };
  const handleReset = () => {
    setFormData({
      expenses: "600000",
      swr: 4,
      currentAge: "30",
      currentSavings: "1000000",
      annualIncome: "1200000",
      annualSavings: "400000",
      returnRate: 12,
      inflationRate: 5,
    });
    setShowResult(false);
    setShowChart(false);
    setShowSensitivity(false);
  };

  // FIRE spectrum comparison bar data
  const spectrumData = [
    { name: "Lean FIRE", value: calc.leanFireTarget, color: "#34d399" },
    { name: "FIRE", value: calc.fireTarget, color: "#f97316" },
    { name: "Fat FIRE", value: calc.fatFireTarget, color: "#8b5cf6" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
      </div>
      <HomePageNavigation />
      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8 pb-12">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <br />
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-3">
            FIRE Calculator
          </h1>
          <p className="text-slate-600 font-semibold text-base mt-1 max-w-2xl px-4">
            Financial Independence, Retire Early — your complete number,
            timeline, and SWR sensitivity analysis.
          </p>
          <div className="flex items-center gap-2 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-50 border border-orange-200 rounded-full">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] sm:text-xs font-black text-orange-700 uppercase tracking-wide">
              FIRE = Financial Independence. Retire Early.
            </span>
          </div>
        </header>
        {/* Card */}
        <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* All input fields stacked vertically */}
            <Field
              label="Current Annual Expenses (₹)"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              hint="Your total yearly spend — this is your FIRE foundation"
            />
            <Field
              label="Expected Annual Income (₹) at Retirement"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              hint="Your gross annual income (used for savings rate)"
            />
            <Field
              label="Current Age"
              name="currentAge"
              value={formData.currentAge}
              onChange={handleChange}
              min={10}
              max={80}
              hint="Your age today"
            />
            <Field
              label="Current Portfolio / Savings (₹)"
              name="currentSavings"
              value={formData.currentSavings}
              onChange={handleChange}
              hint="Total invested assets today"
            />
            <Field
              label="Annual Savings / Investments (₹) going forward"
              name="annualSavings"
              value={formData.annualSavings}
              onChange={handleChange}
              hint="How much you invest each year"
            />
            {/* Assumptions: SWR, Return, Inflation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Safe Withdrawal Rate (SWR)
                </label>
                <input
                  type="range"
                  name="swr"
                  min={2}
                  max={6}
                  step={0.1}
                  value={formData.swr}
                  onChange={handleSlider}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-400">2% (safe)</span>
                  <span className="font-bold text-orange-600">
                    {formData.swr}%
                  </span>
                  <span className="text-slate-400">6% (bold)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  The classic &quot;4% rule&quot; (25× expenses) is the most
                  common starting point.
                </p>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Expected Annual Return
                </label>
                <input
                  type="range"
                  name="returnRate"
                  min={4}
                  max={18}
                  step={0.5}
                  value={formData.returnRate}
                  onChange={handleSlider}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-400">4%</span>
                  <span className="font-bold text-amber-600">
                    {formData.returnRate}% p.a.
                  </span>
                  <span className="text-slate-400">18%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Indian equity long-term avg: ~12–14%. Debt: ~7%.
                </p>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Inflation Rate (%)
                </label>
                <input
                  type="range"
                  name="inflationRate"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.inflationRate}
                  onChange={handleSlider}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span className="font-bold text-orange-600">
                    {formData.inflationRate}% p.a.
                  </span>
                  <span>10%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Typical Indian inflation: 4–6%.
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
            >
              Calculate My FIRE Number
            </button>
          </form>
          {/* Results */}
          {showResult && (
            <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Headline */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                  <Flame className="w-5 h-5" />
                  Your FIRE Number
                </div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight">
                  {fmtL(calc.fireTarget)}
                </p>
                <p className="text-sm text-white/80 mt-2">
                  = {fmt(calc.expenses)}/yr ÷ {formData.swr}% SWR
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-white/70">Monthly expenses</p>
                    <p className="font-black text-base">
                      {fmt(calc.monthlyExpenses)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-white/70">
                      Portfolio covers/mo now
                    </p>
                    <p className="font-black text-base">
                      {fmt(calc.monthlyPassiveIncome)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-white/70">Savings rate</p>
                    <p className="font-black text-base">
                      {calc.savingsRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              {/* Timeline cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<Clock className="w-4 h-4 text-orange-500" />}
                  label="Years to FIRE"
                  value={
                    calc.currentSavings >= calc.fireTarget
                      ? "You're FIRE!"
                      : calc.fireAge === null
                        ? "Increase savings"
                        : `${calc.yearsToFire} years`
                  }
                />
                <StatCard
                  icon={<Target className="w-4 h-4 text-amber-500" />}
                  label="FIRE Age"
                  value={calc.fireAge !== null ? `Age ${calc.fireAge}` : "—"}
                />
                <StatCard
                  icon={<Shield className="w-4 h-4 text-orange-500" />}
                  label="Savings Rate"
                  value={`${calc.savingsRate.toFixed(1)}%`}
                  sub={
                    calc.savingsRate >= 50
                      ? "🔥 Excellent!"
                      : calc.savingsRate >= 30
                        ? "👍 Good"
                        : undefined
                  }
                />
              </div>
              {/* Status banner */}
              <FIREStatusBanner calc={calc} />
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-sm font-bold text-slate-700 mb-1">
                  Your FIRE Spectrum
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Lean vs Standard vs Fat FIRE corpus comparison
                </p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spectrumData} barSize={52}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <YAxis
                        tickFormatter={(v) =>
                          v >= 1e7
                            ? `${(v / 1e7).toFixed(0)}Cr`
                            : `${(v / 1e5).toFixed(0)}L`
                        }
                        tick={{ fontSize: 10 }}
                        width={40}
                      />
                      <Tooltip content={<SpectrumTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {spectrumData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2 flex-wrap text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Lean{" "}
                    {fmtL(calc.leanFireTarget)}
                  </span>
                  <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />{" "}
                    Standard {fmtL(calc.fireTarget)}
                  </span>
                  <span className="flex items-center gap-1.5 text-violet-600 font-medium">
                    <div className="w-2 h-2 rounded-full bg-violet-500" /> Fat{" "}
                    {fmtL(calc.fatFireTarget)}
                  </span>
                </div>
              </div>
              {/* SWR Sensitivity toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowSensitivity((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-sm font-bold text-orange-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    SWR Sensitivity Table
                  </span>
                  {showSensitivity ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {showSensitivity && (
                  <div className="mt-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-x-auto">
                    <p className="text-xs text-slate-400 mb-3">
                      How your FIRE corpus changes with different withdrawal
                      rates
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left font-bold text-slate-600 pb-2 pr-4">
                            SWR
                          </th>
                          <th className="text-left font-bold text-slate-600 pb-2 pr-4">
                            Corpus Needed
                          </th>
                          <th className="text-left font-bold text-slate-600 pb-2">
                            Rule
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {calc.swrSensitivity.map((row) => {
                          const isSelected = row.swr === `${formData.swr}%`;
                          return (
                            <tr
                              key={row.swr}
                              className={`border-b border-slate-50 ${isSelected ? "bg-orange-50" : ""}`}
                            >
                              <td
                                className={`py-2 pr-4 font-bold ${isSelected ? "text-orange-600" : "text-slate-700"}`}
                              >
                                {row.swr} {isSelected && "← you"}
                              </td>
                              <td
                                className={`py-2 pr-4 font-bold ${isSelected ? "text-orange-600" : "text-slate-700"}`}
                              >
                                {fmtL(row.corpus)}
                              </td>
                              <td className="py-2 text-slate-500">
                                {(100 / parseFloat(row.swr)).toFixed(0)}×
                                expenses
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    View Portfolio Growth Chart
                  </span>
                  {showChart ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {showChart && (
                  <div className="mt-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={calc.growthSeries}>
                          <defs>
                            <linearGradient
                              id="fireGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f97316"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f97316"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="age"
                            tick={{ fontSize: 11 }}
                            label={{
                              value: "Age",
                              position: "insideBottomRight",
                              offset: -5,
                              fontSize: 11,
                            }}
                          />
                          <YAxis
                            tickFormatter={(v) =>
                              v >= 1e7
                                ? `₹${(v / 1e7).toFixed(1)}Cr`
                                : `₹${(v / 1e5).toFixed(0)}L`
                            }
                            tick={{ fontSize: 10 }}
                            width={62}
                          />
                          <Tooltip content={<GrowthTooltip />} />
                          {calc.fireAge !== null && (
                            <ReferenceLine
                              x={calc.fireAge}
                              stroke="#f97316"
                              strokeDasharray="4 3"
                              label={{
                                value: "FIRE 🔥",
                                position: "top",
                                fontSize: 10,
                                fill: "#f97316",
                              }}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="portfolio"
                            stroke="#f97316"
                            strokeWidth={2.5}
                            fill="url(#fireGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {calc.fireAge && (
                      <div className="flex gap-4 mt-3">
                        <span className="text-xs flex items-center gap-1.5 text-orange-600 font-medium">
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          FIRE @ age {calc.fireAge} — {fmtL(calc.fireTarget)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* FIRE principle callout */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-sm text-orange-800 leading-relaxed">
                  <strong>🔥 The FIRE Formula:</strong> Save{" "}
                  <strong>{fmt(calc.annualSavings)}/yr</strong> at{" "}
                  <strong>{formData.returnRate}%</strong> returns (real return:{" "}
                  {formData.returnRate - formData.inflationRate}%). Your
                  portfolio hits <strong>{fmtL(calc.fireTarget)}</strong>
                  {calc.fireAge ? ` at age ${calc.fireAge}` : ""}. Then withdraw{" "}
                  <strong>{formData.swr}%</strong> — covering all your expenses
                  forever, with high probability your money outlives you.
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
          <footer className="mt-6 text-center space-y-1">
            <p className="text-xs font-bold text-slate-500">
              Part of Viluva Tools Suite
            </p>
            <p className="text-xs text-slate-400">
              © 2026 Viluva. For educational purposes only. Not financial
              advice.
            </p>
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
      <p className="text-orange-600">{fmt(d.portfolio)}</p>
    </div>
  );
}

function SpectrumTooltip({
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
      <p className="text-orange-600">{fmt(d.value)}</p>
    </div>
  );
}

function FIREStatusBanner({ calc }: { calc: CalcResult }): React.ReactElement {
  if (calc.currentSavings >= calc.fireTarget) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-800 font-bold">
          🎉 You&apos;ve hit your FIRE number! Financial independence is yours
          right now.
        </p>
      </div>
    );
  }
  if (calc.fireAge === null) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-800 font-bold">
          ⚠️ FIRE is not achievable at your current savings rate. Increasing
          your savings rate is the single highest-impact lever you can pull.
        </p>
      </div>
    );
  }
  if (calc.savingsRate >= 50) {
    return (
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <p className="text-sm text-orange-800 font-bold">
          🔥 Exceptional savings rate of{" "}
          <strong>{calc.savingsRate.toFixed(1)}%</strong>! You&apos;re on an
          accelerated FIRE path — reaching financial independence at age{" "}
          <strong>{calc.fireAge}</strong>.
        </p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <p className="text-sm text-blue-800 font-bold">
        ✅ On track for FIRE in <strong>{calc.yearsToFire} years</strong> at age{" "}
        <strong>{calc.fireAge}</strong>. Every % increase in your savings rate
        shaves years off this timeline.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center text-center gap-1">
      <div className="mb-1">{icon}</div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-black text-slate-800 text-lg">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  min?: number;
  max?: number;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm sm:text-base font-bold text-slate-800 mb-1"
      >
        {label}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      <input
        id={id}
        type="number"
        name={name}
        min={min ?? 0}
        max={max}
        value={value}
        onChange={onChange}
        required
        className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm sm:text-base bg-white/50"
      />
    </div>
  );
}
