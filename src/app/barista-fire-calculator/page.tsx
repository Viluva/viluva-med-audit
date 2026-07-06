"use client";

import { motion } from "framer-motion";
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
import { Coffee, Zap, Info, TrendingUp, Target, RotateCcw } from "lucide-react";
import {
  fireNumber,
  baristaFireNumber,
  yearsToTarget,
  buildGrowthSeries,
} from "@/lib/fireMath";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  ResultHero,
  formatCurrency as fmt,
} from "@/components/calculator/CalculatorShell";
import { formatCompactAxis } from "@/lib/currency";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  expenses: string;
  baristaIncome: string;
  swr: number;
  currentSavings: string;
  currentAge: string;
  desiredBaristaAge: string;
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
  desiredBaristaAge: number;
  portfolioCovers: number;
  jobCovers: number;
  pctFaster: number;
  canReachByDesiredAge: boolean;
  requiredMonthlySavings: number | null;
  actualAchievableAge: number | null;
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
    desiredBaristaAge: "45",
    annualSavings: "300000",
    returnRate: 10,
    inflationRate: 5,
  });
  const [showResult, setShowResult] = useState(false);

  // ── Derived numbers ───────────────────────────────────────────────────────

  const calc = useMemo(() => {
    const expenses = Math.max(0, Number(formData.expenses));
    const baristaIncome = Math.max(0, Number(formData.baristaIncome));
    const swr = Number(formData.swr);
    const currentSavings = Math.max(0, Number(formData.currentSavings));
    const currentAge = Math.max(18, Number(formData.currentAge));
    const desiredBaristaAge = Math.max(
      currentAge + 1,
      Number(formData.desiredBaristaAge),
    );
    const annualSavings = Math.max(0, Number(formData.annualSavings));
    const returnRate = Number(formData.returnRate) / 100;
    const inflationRate = Number(formData.inflationRate) / 100;

    const realReturn = returnRate - inflationRate;
    const gap = Math.max(0, expenses - baristaIncome);
    const baristaTarget = baristaFireNumber(expenses, baristaIncome, swr);
    const fullFireTarget = fireNumber(expenses, swr);
    const savingsRate = expenses > 0 ? (annualSavings / expenses) * 100 : 0;

    // Calculate years and age with current savings rate
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

    // New logic: Check if can reach by desired age
    const yearsToDesiredAge = desiredBaristaAge - currentAge;
    let canReachByDesiredAge = false;
    let requiredMonthlySavings: number | null = null;
    let actualAchievableAge: number | null = null;

    if (baristaAge !== null && baristaAge <= desiredBaristaAge) {
      // Can reach earlier than or by desired age
      canReachByDesiredAge = true;
      actualAchievableAge = baristaAge;
    } else {
      // Need to calculate required monthly savings to reach by desired age
      // Using FV = PV * (1+r)^n + PMT * ((1+r)^n - 1) / r
      // Solving for PMT: PMT = (FV - PV*(1+r)^n) * r / ((1+r)^n - 1)
      const fv = baristaTarget;
      const pv = currentSavings;
      const n = yearsToDesiredAge;
      const r = realReturn;

      if (n > 0 && r !== 0) {
        const futureValue = pv * Math.pow(1 + r, n);
        const denominator = (Math.pow(1 + r, n) - 1) / r;

        if (futureValue >= fv) {
          // Already have enough, will reach even earlier
          canReachByDesiredAge = true;
          actualAchievableAge = baristaAge;
        } else if (denominator > 0) {
          const requiredAnnual = (fv - futureValue) / denominator;
          requiredMonthlySavings = requiredAnnual / 12;

          if (requiredMonthlySavings < 0) {
            requiredMonthlySavings = 0;
          }
        }
      }
    }

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
      desiredBaristaAge,
      portfolioCovers,
      jobCovers,
      pctFaster,
      canReachByDesiredAge,
      requiredMonthlySavings,
      actualAchievableAge,
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
      desiredBaristaAge: "45",
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
  const PIE_COLORS = ["#ea580c", "#d97706"];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <CalculatorShell
      title="Barista FIRE Calculator"
      description="Barista FIRE is when you step away from your full-time career early, but not completely retire—you take a simpler, low-stress job to cover your daily expenses. Meanwhile, your savings stay invested and keep growing in the background until you can fully retire later."
      badgeText="Barista FIRE = Work Less. Live More."
      badgeIcon={Coffee}
      accent="retirement"
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* All input fields stacked vertically */}
          <div className="flex flex-col gap-6">
            <NumberField
              label="Current Annual Expenses"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              hint="Your total yearly spending today (rent, food, lifestyle, etc.) before Barista FIRE."
              prefix="₹"
            />
            <NumberField
              label="Expected Annual Part-Time Income after Barista FIRE"
              name="baristaIncome"
              value={formData.baristaIncome}
              onChange={handleChange}
              hint="What you expect to earn per year from part-time or Barista work after leaving your main job."
              prefix="₹"
            />
            <NumberField
              label="Current Portfolio / Savings"
              name="currentSavings"
              value={formData.currentSavings}
              onChange={handleChange}
              hint="Total invested savings you have right now (before Barista FIRE)."
              prefix="₹"
            />
            <NumberField
              label="Annual Savings / Investments"
              name="annualSavings"
              value={formData.annualSavings}
              onChange={handleChange}
              hint="How much you plan to invest each year from now on."
              prefix="₹"
            />
            <NumberField
              label="Current Age"
              name="currentAge"
              value={formData.currentAge}
              onChange={handleChange}
              min={10}
              max={80}
              hint="Your age today."
            />
            <NumberField
              label="Desired Barista FIRE Age"
              name="desiredBaristaAge"
              value={formData.desiredBaristaAge}
              onChange={handleChange}
              min={Number(formData.currentAge) + 1}
              max={100}
              hint="At what age do you want to reach Barista FIRE?"
            />
          </div>
          {/* Sliders section visually separated */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 card-inset p-4 mt-2">
            <SliderField
              label="Safe Withdrawal Rate (SWR)"
              name="swr"
              value={formData.swr}
              onChange={handleSlider}
              min={2}
              max={6}
              step={0.1}
              leftLabel="2% (very conservative)"
              rightLabel="6% (aggressive)"
              accent="retirement"
              suffix="%"
              hint='The classic "4% rule" is a common starting point. Lower = safer, higher = smaller corpus needed but more risk.'
            />
            <SliderField
              label="Expected Annual Return (%)"
              name="returnRate"
              value={formData.returnRate}
              onChange={handleSlider}
              min={4}
              max={18}
              step={0.5}
              leftLabel="4%"
              rightLabel="18%"
              accent="retirement"
              hint="Global equity long-term avg: ~7–12%. Bonds: ~3–5%."
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
            Calculate My FIRE Numbers
          </button>
        </form>

        {/* ── Results ──────────────────────────────────────────────────── */}
        {showResult && (
          <motion.div
            className="mt-8 space-y-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* ── Row 1: headline number ─────────────────────────────── */}
            <ResultHero
              icon={<Coffee className="w-5 h-5" />}
              label="Barista FIRE Target"
              value={fmt(calc.baristaTarget)}
              detail={`${calc.pctFaster}% less than Full FIRE`}
              accent="retirement"
            />

            {/* ── Row 2: income breakdown pie + insight ───────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pie */}
              <div className="card p-5 flex flex-col items-center justify-center">
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
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                    Portfolio ({fmt(calc.gap)})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    Part-time ({fmt(calc.baristaIncome)})
                  </span>
                </div>
              </div>

              {/* Insight list */}
              <div className="card p-5 flex flex-col gap-3 justify-center">
                <InsightRow
                  icon={<Zap className="w-4 h-4 text-amber-500" />}
                  label="Gap your portfolio must cover"
                  value={fmt(calc.gap)}
                  sub="per year"
                />
                <InsightRow
                  icon={<Target className="w-4 h-4 text-orange-500" />}
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

            {/* ── Row 3: Barista FIRE Goal Status ─ */}
            <div className="grid grid-cols-1 gap-4">
              {calc.canReachByDesiredAge &&
              calc.actualAchievableAge !== null ? (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500 rounded-full">
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-emerald-900 mb-2">
                        🎉 Great News! You Can Reach Barista FIRE Earlier!
                      </h3>
                      <p className="text-slate-700 mb-3">
                        With your current savings plan, you can reach Barista
                        FIRE by age{" "}
                        <span className="font-bold text-emerald-700">
                          {Math.round(calc.actualAchievableAge)}
                        </span>
                        {calc.actualAchievableAge <
                          calc.desiredBaristaAge && (
                          <>
                            {" "}
                            — that&apos;s{" "}
                            <span className="font-bold text-emerald-700">
                              {Math.round(
                                calc.desiredBaristaAge -
                                  calc.actualAchievableAge,
                              )}{" "}
                              years earlier
                            </span>{" "}
                            than your desired age of {calc.desiredBaristaAge}!
                          </>
                        )}
                      </p>
                      <div className="bg-white/70 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            Years until Barista FIRE:
                          </span>
                          <span className="font-bold text-emerald-700">
                            {calc.baristaYears.toFixed(1)} years
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            Barista Phase Duration:
                          </span>
                          <span className="font-bold text-slate-700">
                            {calc.fullFireYears < Infinity
                              ? `${(calc.fullFireYears - calc.baristaYears).toFixed(1)} years`
                              : "Until Full FIRE"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : calc.requiredMonthlySavings !== null ? (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500 rounded-full">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-900 mb-2">
                        📈 Increase Your Savings to Reach Your Goal!
                      </h3>
                      <p className="text-slate-700 mb-3">
                        To reach Barista FIRE by your desired age of{" "}
                        <span className="font-bold text-amber-700">
                          {calc.desiredBaristaAge}
                        </span>
                        , you need to save more each month.
                      </p>
                      <div className="bg-white/70 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Required Monthly Savings:
                          </span>
                          <span className="text-2xl font-bold text-amber-700">
                            {fmt(calc.requiredMonthlySavings)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            Current Monthly Savings:
                          </span>
                          <span className="font-bold text-slate-700">
                            {fmt(Number(formData.annualSavings) / 12)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            Additional Monthly Savings Needed:
                          </span>
                          <span className="font-bold text-orange-600">
                            {fmt(
                              Math.max(
                                0,
                                calc.requiredMonthlySavings -
                                  Number(formData.annualSavings) / 12,
                              ),
                            )}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-amber-200">
                          <p className="text-xs text-slate-600">
                            💡 <strong>Tip:</strong> Consider increasing your
                            income, reducing expenses, or adjusting your
                            desired age to make your goal more achievable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-inset p-6 text-center">
                  <p className="text-slate-600">
                    Unable to calculate timeline. Please check your inputs.
                  </p>
                </div>
              )}
            </div>

            {/* ── Row 4: status banner (only show if reaching Barista FIRE) ─────────────────────── */}
            {calc.canReachByDesiredAge && calc.baristaAge !== null && (
              <StatusBanner calc={calc} />
            )}

            {/* ── Row 5: growth chart (always visible) ───────────────── */}
            <div className="mt-3 card p-5">
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
                          stopColor="#ea580c"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ea580c"
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
                      tickFormatter={(v) => formatCompactAxis(v)}
                      tick={{ fontSize: 10 }}
                      width={60}
                    />
                    <Tooltip content={<GrowthTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#ea580c"
                      strokeWidth={2.5}
                      fill="url(#portGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Milestones legend */}
              <div className="flex gap-4 mt-3 flex-wrap">
                {calc.baristaAge && (
                  <span className="text-xs flex items-center gap-1.5 text-orange-700 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    Barista FIRE @ age {calc.baristaAge} —{" "}
                    {fmt(calc.baristaTarget)}
                  </span>
                )}
                {calc.fullFireAge && (
                  <span className="text-xs flex items-center gap-1.5 text-amber-700 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
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
              className="w-full btn-secondary py-3"
            >
              <RotateCcw className="w-4 h-4" />
              Reset &amp; Start Over
            </button>
          </motion.div>
        )}

        {/* ── Info box ─────────────────────────────────────────────────── */}
        <div className="mt-8 card-inset px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
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
      <p className="text-orange-600">{fmt(value)}</p>
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
      <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <p className="text-sm text-violet-800 font-bold">
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
