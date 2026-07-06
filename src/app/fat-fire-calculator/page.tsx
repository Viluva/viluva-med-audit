"use client";

import { motion } from "framer-motion";
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
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Gem,
} from "lucide-react";
import { fireNumber, yearsToTarget, buildGrowthSeries } from "@/lib/fireMath";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  formatCurrency as fmt,
  formatCompactCurrency as fmtL,
} from "@/components/calculator/CalculatorShell";
import { formatCompactAxis } from "@/lib/currency";

// Fat FIRE lifestyle buckets breakdown
type LifestyleBucket = {
  category: string;
  amount: number;
  color: string;
};

interface FormData {
  baseExpenses: string;
  luxuryMultiplier: number;
  swr: number;
  currentAge: string;
  currentSavings: string;
  annualSavings: string;
  returnRate: number;
  inflationRate: number;
}

function buildLifestyleBuckets(totalExpenses: number): LifestyleBucket[] {
  // Rough proportions typical for Fat FIRE lifestyle
  return [
    {
      category: "Housing",
      amount: Math.round(totalExpenses * 0.28),
      color: "#ea580c",
    },
    {
      category: "Travel",
      amount: Math.round(totalExpenses * 0.18),
      color: "#f97316",
    },
    {
      category: "Food & Dining",
      amount: Math.round(totalExpenses * 0.15),
      color: "#fb923c",
    },
    {
      category: "Healthcare",
      amount: Math.round(totalExpenses * 0.12),
      color: "#d97706",
    },
    {
      category: "Lifestyle",
      amount: Math.round(totalExpenses * 0.15),
      color: "#b45309",
    },
    {
      category: "Misc / Buffer",
      amount: Math.round(totalExpenses * 0.12),
      color: "#fed7aa",
    },
  ];
}

// ─── Types ───────────────────────────────────────────────────────────────────

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
    inflationRate: 5,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showBuckets, setShowBuckets] = useState(false);

  const calc = useMemo((): CalcResult => {
    const baseExpenses = Math.max(0, Number(formData.baseExpenses));
    const luxuryMultiplier = Math.max(1, Number(formData.luxuryMultiplier));
    const swr = Number(formData.swr);
    const currentAge = Math.max(18, Number(formData.currentAge));
    const currentSavings = Math.max(0, Number(formData.currentSavings));
    const annualSavings = Math.max(0, Number(formData.annualSavings));
    const returnRate = Number(formData.returnRate) / 100;
    const inflationRate = Number(formData.inflationRate) / 100;
    const realReturn = returnRate - inflationRate;

    const fatExpenses = baseExpenses * luxuryMultiplier;
    const fatFireTarget = fireNumber(fatExpenses, swr);
    const leanFireTarget = fireNumber(baseExpenses * 0.7, swr);
    const standardFireTarget = fireNumber(baseExpenses, swr);

    const yearsToFatFire = yearsToTarget(
      currentSavings,
      fatFireTarget,
      annualSavings,
      realReturn,
    );
    const fatFireAge =
      yearsToFatFire === Infinity ? null : currentAge + yearsToFatFire;

    const yearsToStandardFire = yearsToTarget(
      currentSavings,
      standardFireTarget,
      annualSavings,
      realReturn,
    );
    const standardFireAge =
      yearsToStandardFire === Infinity
        ? null
        : currentAge + yearsToStandardFire;

    const pctOfFatFire =
      fatFireTarget > 0
        ? Math.min(100, Math.round((currentSavings / fatFireTarget) * 100))
        : 0;

    const extraCorpusVsStandard = Math.max(
      0,
      fatFireTarget - standardFireTarget,
    );

    // Keep lifestyle buckets logic as is (UI only)
    const buckets = buildLifestyleBuckets(fatExpenses);

    const chartYears = Math.min(
      60,
      (yearsToFatFire === Infinity ? 40 : yearsToFatFire) + 5,
    );
    const growthSeries = buildGrowthSeries(
      currentSavings,
      annualSavings,
      realReturn,
      chartYears,
      currentAge,
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
      inflationRate: 5,
    });
    setShowResult(false);
    setShowChart(false);
    setShowBuckets(false);
  };

  // Comparison bar data
  const comparisonData = [
    { name: "Lean FIRE", value: calc.leanFireTarget, color: "#fdba74" },
    { name: "Standard FIRE", value: calc.standardFireTarget, color: "#f97316" },
    { name: "Fat FIRE", value: calc.fatFireTarget, color: "#ea580c" },
  ];

  return (
    <CalculatorShell
      title="Fat FIRE Calculator"
      description="Retire with abundance — calculate the corpus for a luxury lifestyle with complete financial independence."
      badgeText="Fat FIRE = Retire Rich. Live Fully."
      badgeIcon={Crown}
      accent="retirement"
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* All input fields stacked vertically */}
          <NumberField
            label="Current Annual Expenses"
            name="baseExpenses"
            value={formData.baseExpenses}
            onChange={handleChange}
            hint="Your actual current yearly spend"
            prefix="₹"
          />
          <NumberField
            label="Current Portfolio / Savings"
            name="currentSavings"
            value={formData.currentSavings}
            onChange={handleChange}
            hint="Total invested assets you have right now"
            prefix="₹"
          />
          <NumberField
            label="Current Age"
            name="currentAge"
            value={formData.currentAge}
            onChange={handleChange}
            min={10}
            max={80}
            hint="Your age today"
          />
          <NumberField
            label="Annual Savings / Investments"
            name="annualSavings"
            value={formData.annualSavings}
            onChange={handleChange}
            hint="How much you invest each year"
            prefix="₹"
          />

          {/* Row 4: Assumptions - SWR, Return, Inflation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SliderField
              label="Safe Withdrawal Rate (SWR)"
              name="swr"
              value={formData.swr}
              onChange={handleSlider}
              min={2}
              max={5}
              step={0.1}
              leftLabel="2% (ultra-safe)"
              rightLabel="5%"
              accent="retirement"
              suffix="%"
              hint="Fat FIRE typically uses 3–3.5% for extra safety"
            />
            <SliderField
              label="Expected Annual Return"
              name="returnRate"
              value={formData.returnRate}
              onChange={handleSlider}
              min={4}
              max={18}
              step={0.5}
              leftLabel="4%"
              rightLabel="18%"
              accent="retirement"
              hint="Global equity long-term avg: ~7–12%"
            />
            <SliderField
              label="Inflation Rate"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={handleSlider}
              min={0}
              max={10}
              step={0.1}
              leftLabel="0%"
              rightLabel="10%"
              accent="retirement"
              hint="Typical inflation: 2–6% depending on your country"
            />
          </div>

          <button type="submit" className="w-full btn-primary py-3 sm:py-4">
            Calculate My Fat FIRE Number
          </button>
        </form>

        {/* Results */}
        {showResult && (
          <motion.div
            className="mt-8 space-y-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Headline numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-600 to-amber-500 text-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                  <Crown className="w-5 h-5" />
                  Fat FIRE Target
                </div>
                <p className="text-3xl sm:text-4xl font-black tracking-tight">
                  {fmtL(calc.fatFireTarget)}
                </p>
                <p className="text-xs text-white/70 mt-1">
                  {fmt(calc.fatExpenses)}/yr lifestyle ·{" "}
                  {formData.luxuryMultiplier}× multiplier
                </p>
                {calc.fatFireAge && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                    <Clock className="w-3 h-3" />
                    {calc.yearsToFatFire} yrs · Age {calc.fatFireAge}
                  </div>
                )}
              </div>

              <div className="card p-5 flex flex-col justify-between">
                <p className="text-sm font-bold text-slate-700 mb-3">
                  Progress to Fat FIRE
                </p>
                <div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${calc.pctOfFatFire}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{fmt(calc.currentSavings)}</span>
                    <span className="font-bold text-orange-600">
                      {calc.pctOfFatFire}%
                    </span>
                    <span>{fmtL(calc.fatFireTarget)}</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="card-inset p-2 text-center">
                    <p className="text-xs text-slate-500">vs Standard FIRE</p>
                    <p className="font-black text-sm text-orange-700">
                      +{fmtL(calc.extraCorpusVsStandard)}
                    </p>
                  </div>
                  <div className="card-inset p-2 text-center">
                    <p className="text-xs text-slate-500">
                      Extra years to save
                    </p>
                    <p className="font-black text-sm text-orange-700">
                      {calc.standardFireAge && calc.fatFireAge
                        ? `+${calc.fatFireAge - calc.standardFireAge} yrs`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FIRE comparison */}
            <div className="card p-5">
              <p className="text-sm font-bold text-slate-700 mb-4">
                FIRE Corpus Comparison
              </p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} barSize={52}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1e7
                          ? `${(v / 1e7).toFixed(0)}Cr`
                          : `${(v / 1e5).toFixed(0)}L`
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
                className="w-full flex items-center justify-between px-5 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-sm font-bold text-orange-700 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Gem className="w-4 h-4" />
                  View Fat FIRE Lifestyle Breakdown
                </span>
                {showBuckets ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showBuckets && (
                <div className="mt-3 card p-5">
                  <p className="text-xs text-slate-400 mb-4">
                    Estimated annual spend breakdown for{" "}
                    {fmt(calc.fatExpenses)}/yr lifestyle
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
                <div className="mt-3 card p-5">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={calc.growthSeries}>
                        <defs>
                          <linearGradient
                            id="fatGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ea580c"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ea580c"
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
                          tickFormatter={(v) => formatCompactAxis(v)}
                          tick={{ fontSize: 10 }}
                          width={62}
                        />
                        <Tooltip content={<GrowthTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="portfolio"
                          stroke="#ea580c"
                          strokeWidth={2.5}
                          fill="url(#fatGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-3 flex-wrap">
                    {calc.standardFireAge && (
                      <span className="text-xs flex items-center gap-1.5 text-amber-700 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Standard FIRE @ age {calc.standardFireAge}
                      </span>
                    )}
                    {calc.fatFireAge && (
                      <span className="text-xs flex items-center gap-1.5 text-orange-700 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                        Fat FIRE @ age {calc.fatFireAge} —{" "}
                        {fmtL(calc.fatFireTarget)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Fat FIRE callout */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm text-orange-800 leading-relaxed">
                <strong>👑 The Fat FIRE Premium:</strong> Choosing a{" "}
                <strong>{formData.luxuryMultiplier}× lifestyle</strong> means
                targeting <strong>{fmtL(calc.fatFireTarget)}</strong> —{" "}
                <strong>{fmtL(calc.extraCorpusVsStandard)} more</strong> than
                standard FIRE. That buys you business class, premium
                healthcare, luxury travel, and zero financial compromise in
                retirement.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full btn-secondary py-3"
            >
              <RotateCcw className="w-4 h-4" />
              Reset &amp; Start Over
            </button>
          </motion.div>
        )}
      </div>
    </CalculatorShell>
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
      <p className="text-orange-600">{fmt(d.value)}</p>
    </div>
  );
}

function FatFireStatusBanner({
  calc,
}: {
  calc: CalcResult;
}): React.ReactElement {
  if (calc.currentSavings >= calc.fatFireTarget) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-800 font-bold">
          🎉 You&apos;ve already reached Fat FIRE! You can retire in luxury
          right now.
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
  if (
    calc.standardFireAge !== null &&
    calc.fatFireAge - calc.standardFireAge <= 5
  ) {
    return (
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <p className="text-sm text-orange-800 font-bold">
          ✨ Only{" "}
          <strong>
            {calc.fatFireAge - (calc.standardFireAge ?? calc.fatFireAge)} extra
            years
          </strong>{" "}
          separates you from Standard FIRE to Fat FIRE! At age{" "}
          <strong>{calc.fatFireAge}</strong>, you retire in luxury.
        </p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <p className="text-sm text-blue-800 font-bold">
        ✅ On track for Fat FIRE in <strong>{calc.yearsToFatFire} years</strong>{" "}
        at age <strong>{calc.fatFireAge}</strong>. Keep maximising investments!
      </p>
    </div>
  );
}
