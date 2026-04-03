"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Coffee,
  Zap,
  Info,
  TrendingUp,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import {
  fireNumber,
  baristaFireNumber,
  yearsToTarget,
  buildGrowthSeries,
} from "@/lib/fireMath";

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  expenses: string;
  baristaIncome: string;
  swr: number;
  currentSavings: string;
  currentAge: string;
  annualSavings: string;
  returnRate: number;
  inflationRate: number;
}

interface CalcResult {
  expenses: number;
  baristaIncome: number;
  gap: number;
  baristaTarget: number;
  fullFireTarget: number;
  savingsRate: number;
  baristaYears: number;
  fullFireYears: number;
  baristaAge: number | null;
  fullFireAge: number | null;
  currentSavings: number;
  currentAge: number;
  portfolioCovers: number;
  jobCovers: number;
  pctFaster: number;
  growthSeries: { age: number; portfolio: number }[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BaristaFIRECalculator() {
  const [formData, setFormData] = useState<FormData>({
    expenses: "600000",
    baristaIncome: "250000",
    swr: 4,
    currentSavings: "1000000",
    currentAge: "30",
    annualSavings: "300000",
    returnRate: 10,
    inflationRate: 5,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // ── Derived numbers ───────────────────────────────────────────────────────

  const calc = useMemo(() => {
    const expenses = Math.max(0, Number(formData.expenses));
    const baristaIncome = Math.max(0, Number(formData.baristaIncome));
    const swr = Number(formData.swr);
    const currentSavings = Math.max(0, Number(formData.currentSavings));
    const currentAge = Math.max(18, Number(formData.currentAge));
    const annualSavings = Math.max(0, Number(formData.annualSavings));
    const returnRate = Number(formData.returnRate) / 100;
    const inflationRate = Number(formData.inflationRate) / 100;

    const realReturn = returnRate - inflationRate;
    const gap = Math.max(0, expenses - baristaIncome);
    const baristaTarget = baristaFireNumber(expenses, baristaIncome, swr);
    const fullFireTarget = fireNumber(expenses, swr);
    const savingsRate = expenses > 0 ? (annualSavings / expenses) * 100 : 0;
    const baristaYears = yearsToTarget(
      currentSavings,
      baristaTarget,
      annualSavings,
      realReturn,
    );
    const fullFireYears = yearsToTarget(
      currentSavings,
      fullFireTarget,
      annualSavings,
      realReturn,
    );
    const baristaAge =
      baristaYears === Infinity ? null : currentAge + baristaYears;
    const fullFireAge =
      fullFireYears === Infinity ? null : currentAge + fullFireYears;
    const portfolioCovers = gap;
    const jobCovers = baristaIncome;
    const pctFaster =
      fullFireTarget > 0
        ? Math.round(((fullFireTarget - baristaTarget) / fullFireTarget) * 100)
        : 0;
    const chartYears = Math.min(
      60,
      (fullFireYears === Infinity ? 40 : fullFireYears) + 5,
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
      baristaIncome,
      gap,
      baristaTarget,
      fullFireTarget,
      savingsRate,
      baristaYears,
      fullFireYears,
      baristaAge,
      fullFireAge,
      currentSavings,
      currentAge,
      portfolioCovers,
      jobCovers,
      pctFaster,
      growthSeries,
    };
  }, [formData]);

  // ── Handlers ──────────────────────────────────────────────────────────────

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
  };

  const handleReset = () => {
    setFormData({
      expenses: "600000",
      baristaIncome: "250000",
      swr: 4,
      currentSavings: "1000000",
      currentAge: "30",
      annualSavings: "300000",
      returnRate: 10,
      inflationRate: 5,
    });
    setShowResult(false);
  };

  // ── Pie data ──────────────────────────────────────────────────────────────

  const pieData = [
    { name: "Portfolio Covers", value: calc.gap },
    { name: "Part-time Job Covers", value: calc.baristaIncome },
  ];
  const PIE_COLORS = ["#3b82f6", "#10b981"];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8 pb-12">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <br />
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Barista FIRE Calculator
          </h1>
          <p className="text-slate-600 font-semibold text-base mt-1 max-w-2xl px-4">
            Barista FIRE is when you step away from your full-time career early,
            but not completely retire—you take a simpler, low-stress job to
            cover your daily expenses. Meanwhile, your savings stay invested and
            keep growing in the background until you can fully retire later.
          </p>
          <div className="flex items-center gap-2 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 border border-amber-200 rounded-full">
            <Coffee className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wide">
              Barista FIRE = Work Less. Live More.
            </span>
          </div>
        </header>

        {/* ── Form card ─────────────────────────────────────────────────── */}
        <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* All input fields stacked vertically */}
            <div className="flex flex-col gap-6">
              <Field
                label="Current Annual Expenses (₹)"
                name="expenses"
                value={formData.expenses}
                onChange={handleChange}
                hint="Your total yearly spending today (rent, food, lifestyle, etc.) before Barista FIRE."
              />
              <Field
                label="Expected Annual Part-Time Income (₹) after Barista FIRE"
                name="baristaIncome"
                value={formData.baristaIncome}
                onChange={handleChange}
                hint="What you expect to earn per year from part-time or Barista work after leaving your main job."
              />
              <Field
                label="Current Portfolio / Savings (₹)"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleChange}
                hint="Total invested savings you have right now (before Barista FIRE)."
              />
              <Field
                label="Annual Savings / Investments (₹) going forward"
                name="annualSavings"
                value={formData.annualSavings}
                onChange={handleChange}
                hint="How much you plan to invest each year from now on."
              />
              <Field
                label="Current Age"
                name="currentAge"
                value={formData.currentAge}
                onChange={handleChange}
                min={10}
                max={80}
                hint="Your age today."
              />
            </div>
            {/* Sliders section visually separated */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 mt-2">
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Safe Withdrawal Rate (SWR)
                </label>
                <input
                  type="range"
                  name="swr"
                  min="2"
                  max="6"
                  step="0.1"
                  value={formData.swr}
                  onChange={handleSlider}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>2% (very conservative)</span>
                  <span className="font-bold text-blue-600">
                    {formData.swr}%
                  </span>
                  <span>6% (aggressive)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  The classic &quot;4% rule&quot; is a common starting point.
                  Lower = safer, higher = smaller corpus needed but more risk.
                </p>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="range"
                  name="returnRate"
                  min="4"
                  max="18"
                  step="0.5"
                  value={formData.returnRate}
                  onChange={handleSlider}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>4%</span>
                  <span className="font-bold text-emerald-600">
                    {formData.returnRate}% p.a.
                  </span>
                  <span>18%</span>
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
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.inflationRate}
                  onChange={handleSlider}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span className="font-bold text-cyan-600">
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
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
            >
              Calculate My FIRE Numbers
            </button>
          </form>

          {/* ── Results ──────────────────────────────────────────────────── */}
          {showResult && (
            <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ── Row 1: headline number ─────────────────────────────── */}
              <div className="grid grid-cols-1 gap-4">
                <NumberCard
                  label="Barista FIRE Target"
                  value={fmt(calc.baristaTarget)}
                  sub={`${calc.pctFaster}% less than Full FIRE`}
                  color="blue"
                  icon={<Coffee className="w-5 h-5" />}
                />
              </div>

              {/* ── Row 2: income breakdown pie + insight ───────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pie */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center justify-center">
                  <p className="text-sm font-bold text-slate-700 mb-3">
                    How your expenses are covered
                  </p>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={52}
                          outerRadius={72}
                          paddingAngle={4}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {pieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-5 text-xs mt-1">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Portfolio ({fmt(calc.gap)})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Part-time ({fmt(calc.baristaIncome)})
                    </span>
                  </div>
                </div>

                {/* Insight list */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 justify-center">
                  <InsightRow
                    icon={<Zap className="w-4 h-4 text-amber-500" />}
                    label="Gap your portfolio must cover"
                    value={fmt(calc.gap)}
                    sub="per year"
                  />
                  <InsightRow
                    icon={<Target className="w-4 h-4 text-blue-500" />}
                    label="Corpus reduction vs Full FIRE"
                    value={`${calc.pctFaster}% less`}
                    sub={`Save ${fmt(calc.fullFireTarget - calc.baristaTarget)} less`}
                  />
                  <InsightRow
                    icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                    label="Annual savings rate"
                    value={`${calc.savingsRate.toFixed(1)}%`}
                    sub="of your annual expenses"
                  />
                </div>
              </div>

              {/* ── Row 3: Barista FIRE timeline and phase duration ─ */}
              <div className="grid grid-cols-1 gap-4">
                <TimelineCard
                  label="Barista FIRE"
                  years={calc.baristaYears}
                  age={calc.baristaAge}
                  color="cyan"
                  icon={<Coffee className="w-5 h-5" />}
                />
                <BaristaPhaseCard
                  baristaYears={calc.baristaYears}
                  fullFireYears={calc.fullFireYears}
                />
              </div>

              {/* ── Row 4: status banner ─────────────────────── */}
              {calc.baristaAge !== null && <StatusBanner calc={calc} />}

              {/* ── Row 5: growth chart (always visible) ───────────────── */}
              <div className="mt-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-700 mb-4">
                  Portfolio Growth Over Time (Inflation-adjusted)
                </p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calc.growthSeries}>
                      <defs>
                        <linearGradient
                          id="portGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
                        width={60}
                      />
                      <Tooltip content={<GrowthTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fill="url(#portGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Milestones legend */}
                <div className="flex gap-4 mt-3 flex-wrap">
                  {calc.baristaAge && (
                    <span className="text-xs flex items-center gap-1.5 text-cyan-700 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      Barista FIRE @ age {calc.baristaAge} —{" "}
                      {fmt(calc.baristaTarget)}
                    </span>
                  )}
                  {calc.fullFireAge && (
                    <span className="text-xs flex items-center gap-1.5 text-purple-700 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      Full FIRE @ age {calc.fullFireAge} —{" "}
                      {fmt(calc.fullFireTarget)}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Output Transparency & Assumptions ─────────────── */}

              {/* ── Early Exit highlight ─────────────────────────────────── */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>🚀 The Early Exit Advantage:</strong> By earning{" "}
                  <strong>{fmt(calc.baristaIncome)}</strong> part-time, your
                  portfolio only needs to produce{" "}
                  <strong>{fmt(calc.gap)}/yr</strong> — requiring{" "}
                  <strong>{calc.pctFaster}% less corpus</strong> than Full FIRE.
                  That means you can leave your 9-to-5 years earlier.
                </p>
              </div>

              {/* Reset */}
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

          {/* ── Info box ─────────────────────────────────────────────────── */}
          <div className="mt-8 bg-slate-50 border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-slate-800">
                  How Barista FIRE works
                </p>
                <p>
                  You semi-retire into a low-stress part-time job (the
                  &quot;barista&quot;). Your investments cover the remainder.
                  You need a <em>much</em> smaller corpus — and you get your
                  freedom sooner.
                </p>
                <p>
                  Advanced mode uses compound growth:{" "}
                  <em>FV = PV × (1+r)ⁿ + PMT × ((1+r)ⁿ − 1) / r</em>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
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
      <p className="text-blue-600">{fmt(d.portfolio)}</p>
    </div>
  );
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
      <p className="font-bold text-slate-800">{name}</p>
      <p className="text-blue-600">{fmt(value)}</p>
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
        className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm sm:text-base bg-white/50"
      />
    </div>
  );
}

function NumberCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  color: "blue" | "indigo";
  icon: React.ReactNode;
}) {
  const bg =
    color === "blue"
      ? "from-blue-600 to-cyan-500"
      : "from-indigo-600 to-purple-500";
  return (
    <div
      className={`bg-gradient-to-br ${bg} text-white rounded-2xl shadow-lg p-6 flex flex-col gap-1`}
    >
      <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
        {icon}
        {label}
      </div>
      <p className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
        {value}
      </p>
      <p className="text-xs text-white/70 mt-1">{sub}</p>
    </div>
  );
}

function InsightRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-bold text-slate-800 text-sm">{value}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

function TimelineCard({
  label,
  years,
  age,
  color,
  icon,
}: {
  label: string;
  years: number;
  age: number | null;
  color: "cyan" | "purple";
  icon: React.ReactNode;
}) {
  const border = color === "cyan" ? "border-cyan-200" : "border-purple-200";
  const bg = color === "cyan" ? "bg-cyan-50" : "bg-purple-50";
  const text = color === "cyan" ? "text-cyan-700" : "text-purple-700";
  const badge =
    color === "cyan"
      ? "bg-cyan-100 text-cyan-800"
      : "bg-purple-100 text-purple-800";

  return (
    <div className={`${bg} border ${border} rounded-2xl p-5`}>
      <div className={`flex items-center gap-2 ${text} font-bold text-sm mb-3`}>
        {icon}
        {label}
      </div>
      {age === null || years === Infinity ? (
        <p className="text-sm text-slate-500">
          Not achievable with current savings rate. Increase your annual
          savings.
        </p>
      ) : (
        <>
          <p className={`text-3xl font-black ${text}`}>
            {years === 0 ? "Already there!" : `${years} yrs`}
          </p>
          <p className="text-xs text-slate-500 mt-1">from now</p>
          <span
            className={`inline-block mt-3 px-3 py-1 ${badge} text-xs font-bold rounded-full`}
          >
            <Clock className="inline w-3 h-3 mr-1" />
            Age {age}
          </span>
        </>
      )}
    </div>
  );
}

function StatusBanner({ calc }: { calc: CalcResult }): React.ReactElement {
  const alreadyBaristaFIRE = calc.currentSavings >= calc.baristaTarget;
  const fullFireBeforeBarista =
    calc.fullFireAge !== null &&
    calc.baristaAge !== null &&
    calc.fullFireAge <= calc.baristaAge;
  const onTrack = !alreadyBaristaFIRE && calc.baristaYears < calc.fullFireYears;

  if (alreadyBaristaFIRE) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-800 font-bold">
          🎉 You&apos;ve already hit your Barista FIRE number! You can
          semi-retire right now.
        </p>
      </div>
    );
  }
  if (fullFireBeforeBarista) {
    return (
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
        <p className="text-sm text-purple-800 font-bold">
          🚀 At your savings rate, you&apos;ll hit Full FIRE before Barista FIRE
          age — you might not even need to go the Barista FIRE route!
        </p>
      </div>
    );
  }
  if (onTrack) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800 font-bold">
          ✅ You&apos;re on track for Barista FIRE in{" "}
          <strong>{calc.baristaYears} years</strong> at age{" "}
          <strong>{calc.baristaAge}</strong>. Keep investing consistently!
        </p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
      <p className="text-sm text-red-800 font-bold">
        ⚠️ Your current savings rate may not be enough. Consider increasing
        annual savings, reducing expenses, or adjusting your return rate.
      </p>
    </div>
  );
}

// Shows how long user will need to work part-time after Barista FIRE before reaching Full FIRE
function BaristaPhaseCard({
  baristaYears,
  fullFireYears,
}: {
  baristaYears: number;
  fullFireYears: number;
}) {
  if (baristaYears === Infinity || fullFireYears === Infinity) {
    return (
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-sm text-slate-500">
          Unable to calculate Barista FIRE phase duration with current inputs.
        </p>
      </div>
    );
  }
  if (baristaYears >= fullFireYears) {
    return (
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-sm text-slate-500">
          You will reach Full FIRE before or at the same time as Barista FIRE.
        </p>
      </div>
    );
  }
  const phaseYears = fullFireYears - baristaYears;
  return (
    <div className="p-5 bg-cyan-50 border border-cyan-200 rounded-2xl">
      <p className="text-sm text-cyan-800 font-bold mb-1">
        Barista FIRE Phase Duration
      </p>
      <p className="text-sm text-cyan-700">
        After you reach Barista FIRE in <strong>{baristaYears} years</strong>,
        you will need to work part-time for{" "}
        <strong>{phaseYears} more years</strong> before you can fully retire
        (Full FIRE).
      </p>
      <p className="text-xs text-cyan-600 mt-2">
        During this phase, your investments keep growing in the background while
        your part-time work covers the rest of your expenses.
      </p>
    </div>
  );
}
