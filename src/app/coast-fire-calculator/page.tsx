"use client";

import { motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  Waves,
  TrendingUp,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Anchor,
  Sparkles,
} from "lucide-react";
import {
  fireNumber,
  coastNumber,
  yearsToTarget,
  yearsToCoastAlone,
  buildCoastSeries,
} from "@/lib/fireMath";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  formatCurrency as fmt,
} from "@/components/calculator/CalculatorShell";
import { formatCompactAxis } from "@/lib/currency";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  expenses: string;
  swr: number;
  currentAge: string;
  retirementAge: string;
  currentSavings: string;
  annualSavings: string;
  returnRate: number;
  inflationRate: number;
}

interface CalcResult {
  expenses: number;
  fullFireTarget: number;
  coastTarget: number;
  currentSavings: number;
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  yearsToCoast: number;
  coastAge: number | null;
  alreadyCoasting: boolean;
  pctOfCoast: number;
  annualSavings: number;
  growthSeries: {
    age: number;
    portfolio: number;
    phase: "accumulate" | "coast";
  }[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CoastFIRECalculator() {
  const [formData, setFormData] = useState<FormData>({
    expenses: "600000",
    swr: 4,
    currentAge: "28",
    retirementAge: "55",
    currentSavings: "500000",
    annualSavings: "240000",
    returnRate: 12,
    inflationRate: 5,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const calc = useMemo((): CalcResult => {
    const expenses = Math.max(0, Number(formData.expenses));
    const swr = Number(formData.swr);
    const currentAge = Math.max(18, Number(formData.currentAge));
    const retirementAge = Math.max(
      currentAge + 1,
      Number(formData.retirementAge),
    );
    const currentSavings = Math.max(0, Number(formData.currentSavings));
    const annualSavings = Math.max(0, Number(formData.annualSavings));
    const returnRate = Number(formData.returnRate) / 100;
    const inflationRate = Number(formData.inflationRate) / 100;
    const realReturn = returnRate - inflationRate;

    const fullFireTarget = fireNumber(expenses, swr);
    const yearsToRetirement = retirementAge - currentAge;
    const coastTarget = coastNumber(
      fullFireTarget,
      yearsToRetirement,
      realReturn,
    );

    const alreadyCoasting = currentSavings >= coastTarget;
    const yearsToCoastRaw = alreadyCoasting
      ? 0
      : yearsToTarget(currentSavings, coastTarget, annualSavings, realReturn);
    const yearsToCoast =
      yearsToCoastRaw === Infinity ? Infinity : Math.ceil(yearsToCoastRaw);
    const coastAge =
      yearsToCoast === Infinity ? null : currentAge + yearsToCoast;

    const pctOfCoast =
      coastTarget > 0
        ? Math.min(100, Math.round((currentSavings / coastTarget) * 100))
        : 0;

    const growthSeries = buildCoastSeries(
      currentSavings,
      annualSavings,
      realReturn,
      coastTarget,
      fullFireTarget,
      currentAge,
      retirementAge,
    );

    return {
      expenses,
      fullFireTarget,
      coastTarget,
      currentSavings,
      currentAge,
      retirementAge,
      yearsToRetirement,
      yearsToCoast,
      coastAge,
      alreadyCoasting,
      pctOfCoast,
      annualSavings,
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
  };
  const handleReset = () => {
    setFormData({
      expenses: "600000",
      swr: 4,
      currentAge: "28",
      retirementAge: "55",
      currentSavings: "500000",
      annualSavings: "240000",
      returnRate: 12,
      inflationRate: 5,
    });
    setShowResult(false);
    setShowChart(false);
  };

  return (
    <CalculatorShell
      title="Coast FIRE Calculator"
      description="Find the number you need to save today — then stop, and let compound interest carry you to retirement."
      badgeText="Save hard early. Coast the rest."
      badgeIcon={Waves}
      accent="retirement"
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* All input fields stacked vertically */}
          <NumberField
            label="Expected Annual Expenses at Retirement"
            name="expenses"
            value={formData.expenses}
            onChange={handleChange}
            hint="Your estimated yearly spend in retirement (today's money)"
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
            label="Target Retirement Age"
            name="retirementAge"
            value={formData.retirementAge}
            onChange={handleChange}
            min={20}
            max={90}
            hint="Age you want to fully stop working"
          />
          <NumberField
            label="Annual Savings / Investments until Coast FIRE"
            name="annualSavings"
            value={formData.annualSavings}
            onChange={handleChange}
            hint="How much you invest each year while accumulating"
            prefix="₹"
          />

          {/* Assumptions: SWR, Return, Inflation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SliderField
              label="Safe Withdrawal Rate (SWR)"
              name="swr"
              value={formData.swr}
              onChange={handleSlider}
              min={2}
              max={6}
              step={0.1}
              leftLabel="2% (safe)"
              rightLabel="6% (bold)"
              accent="retirement"
              suffix="%"
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
              label="Inflation Rate (%)"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={handleSlider}
              min={0}
              max={10}
              step={0.1}
              leftLabel="0%"
              rightLabel="10%"
              accent="retirement"
              hint="Typical inflation: 2–6% depending on your country."
            />
          </div>

          <button type="submit" className="w-full btn-primary py-3 sm:py-4">
            Calculate My Coast FIRE Number
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
              <NumberCard
                label="Coast FIRE Number"
                value={fmt(calc.coastTarget)}
                sub={`Save this today, never invest again`}
                gradient="from-orange-600 to-amber-500"
                icon={<Anchor className="w-5 h-5" />}
              />
              <NumberCard
                label="Full FIRE Target"
                value={fmt(calc.fullFireTarget)}
                sub={`Needed by age ${calc.retirementAge}`}
                gradient="from-amber-600 to-yellow-500"
                icon={<Sparkles className="w-5 h-5" />}
              />
            </div>

            {/* Progress bar + insights */}
            <div className="card p-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Progress to Coast FIRE</span>
                  <span className="text-orange-600">{calc.pctOfCoast}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${calc.pctOfCoast}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{fmt(calc.currentSavings)} saved</span>
                  <span>{fmt(calc.coastTarget)} goal</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <InsightItem
                  icon={<Clock className="w-4 h-4 text-orange-500" />}
                  label="Years to coast"
                  value={
                    calc.alreadyCoasting
                      ? "You're coasting!"
                      : calc.coastAge === null
                        ? "Not achievable"
                        : `${calc.yearsToCoast} yrs`
                  }
                />
                <InsightItem
                  icon={<Target className="w-4 h-4 text-amber-500" />}
                  label="Coast age"
                  value={
                    calc.alreadyCoasting
                      ? `Age ${calc.currentAge}`
                      : calc.coastAge !== null
                        ? `Age ${calc.coastAge}`
                        : "—"
                  }
                />
                <InsightItem
                  icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
                  label="Years of coasting"
                  value={
                    calc.coastAge !== null
                      ? `${calc.retirementAge - (calc.alreadyCoasting ? calc.currentAge : calc.coastAge!)} yrs`
                      : "—"
                  }
                />
              </div>
            </div>

            {/* Status banner */}
            <CoastStatusBanner calc={calc} />

            {/* Key insight callout */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm text-orange-800 leading-relaxed">
                <strong>🌊 The Coast Advantage:</strong> Once you hit{" "}
                <strong>{fmt(calc.coastTarget)}</strong>, you can reduce your
                job to bare-minimum income needs — your portfolio coasts to{" "}
                <strong>{fmt(calc.fullFireTarget)}</strong> all by itself by
                age <strong>{calc.retirementAge}</strong>. No more aggressive
                saving required.
              </p>
            </div>

            {/* Chart toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowChart((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-all"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  View Two-Phase Growth Chart
                </span>
                {showChart ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showChart && (
                <div className="mt-3 card p-5">
                  <p className="text-sm font-bold text-slate-700 mb-1">
                    Accumulation → Coast phase (Inflation-adjusted)
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Amber = saving aggressively · Orange = coasting (no new
                    contributions)
                  </p>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={calc.growthSeries}>
                        <defs>
                          <linearGradient
                            id="coastGrad"
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
                        <Tooltip content={<CoastChartTooltip />} />
                        {calc.coastAge !== null && (
                          <ReferenceLine
                            x={calc.coastAge}
                            stroke="#ea580c"
                            strokeDasharray="4 3"
                            label={{
                              value: "Coast",
                              position: "top",
                              fontSize: 10,
                              fill: "#ea580c",
                            }}
                          />
                        )}
                        <ReferenceLine
                          x={calc.retirementAge}
                          stroke="#d97706"
                          strokeDasharray="4 3"
                          label={{
                            value: "Retire",
                            position: "top",
                            fontSize: 10,
                            fill: "#d97706",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="portfolio"
                          stroke="#ea580c"
                          strokeWidth={2.5}
                          fill="url(#coastGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Reset */}
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

function CoastChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { age: number; portfolio: number; phase: string } }[];
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
      <p className="font-bold text-slate-800">Age {d.age}</p>
      <p className="text-orange-600">{fmt(d.portfolio)}</p>
      <p className="text-xs text-slate-400 capitalize">{d.phase} phase</p>
    </div>
  );
}

function CoastStatusBanner({ calc }: { calc: CalcResult }): React.ReactElement {
  if (calc.alreadyCoasting) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-800 font-bold">
          🎉 You&apos;re already at your Coast FIRE number! You can stop making
          new investments. Your portfolio will grow to{" "}
          {fmt(calc.fullFireTarget)} by age {calc.retirementAge} on its own.
        </p>
      </div>
    );
  }
  if (calc.coastAge === null) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-800 font-bold">
          ⚠️ Coast FIRE is not achievable at your current savings rate. Try
          increasing annual investments or extending your retirement age.
        </p>
      </div>
    );
  }
  const coastingYears = calc.retirementAge - calc.coastAge;
  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
      <p className="text-sm text-orange-800 font-bold">
        ✅ You&apos;ll reach Coast FIRE at age <strong>{calc.coastAge}</strong>{" "}
        in <strong>{calc.yearsToCoast} years</strong>. Then enjoy{" "}
        <strong>{coastingYears} years</strong> of coasting before full
        retirement at age {calc.retirementAge}.
      </p>
    </div>
  );
}

function NumberCard({
  label,
  value,
  sub,
  gradient,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg p-6 flex flex-col gap-1`}
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

function InsightItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1 p-3 card-inset">
      <div className="mb-1">{icon}</div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-bold text-slate-800 text-sm">{value}</p>
    </div>
  );
}
