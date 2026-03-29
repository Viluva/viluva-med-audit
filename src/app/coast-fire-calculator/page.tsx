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
  ReferenceLine,
} from "recharts";
import {
  Waves,
  Info,
  TrendingUp,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Anchor,
  Sparkles,
} from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import {
  fireNumber,
  coastNumber,
  yearsToTarget,
  yearsToCoastAlone,
  buildCoastSeries,
} from "@/lib/fireMath";

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  expenses: string;
  swr: number;
  currentAge: string;
  retirementAge: string;
  currentSavings: string;
  annualSavings: string;
  returnRate: number;
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

    const fullFireTarget = fireNumber(expenses, swr);
    const yearsToRetirement = retirementAge - currentAge;
    const coastTarget = coastNumber(
      fullFireTarget,
      yearsToRetirement,
      returnRate,
    );

    const alreadyCoasting = currentSavings >= coastTarget;
    const yearsToCoastRaw = alreadyCoasting
      ? 0
      : yearsToTarget(currentSavings, coastTarget, annualSavings, returnRate);
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
      returnRate,
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
    });
    setShowResult(false);
    setShowChart(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8 pb-12">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <br />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Coast FIRE Calculator
          </h1>
          <p className="text-slate-600 font-semibold text-base sm:text-lg mt-1 max-w-2xl px-4">
            Find the number you need to save today — then stop, and let compound
            interest carry you to retirement.
          </p>
          <div className="flex items-center gap-2 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-50 border border-teal-200 rounded-full">
            <Waves className="w-4 h-4 text-teal-600" />
            <span className="text-[10px] sm:text-xs font-black text-teal-700 uppercase tracking-wide">
              Save hard early. Coast the rest.
            </span>
          </div>
        </header>

        {/* Card */}
        <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
          <form onSubmit={handleCalculate} className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Annual Expenses at Retirement (₹)"
                name="expenses"
                value={formData.expenses}
                onChange={handleChange}
                hint="Your estimated yearly spend in retirement (today's ₹)"
              />
              <Field
                label="Current Savings / Portfolio (₹)"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleChange}
                hint="Total invested assets you have right now"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label="Target Retirement Age"
                name="retirementAge"
                value={formData.retirementAge}
                onChange={handleChange}
                min={20}
                max={90}
                hint="Age you want to fully stop working"
              />
            </div>

            <Field
              label="Annual Savings / Investment (₹)"
              name="annualSavings"
              value={formData.annualSavings}
              onChange={handleChange}
              hint="How much you invest each year while accumulating"
            />

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SliderField
                label="Safe Withdrawal Rate (SWR)"
                name="swr"
                min={2}
                max={6}
                step={0.1}
                value={formData.swr}
                onChange={handleSlider}
                display={`${formData.swr}%`}
                leftLabel="2% (safe)"
                rightLabel="6% (bold)"
                accentClass="accent-teal-600"
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
                accentClass="accent-cyan-600"
                hint="Indian equity long-term avg: ~12–14%"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
            >
              Calculate My Coast FIRE Number
            </button>
          </form>

          {/* Results */}
          {showResult && (
            <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Headline numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberCard
                  label="Coast FIRE Number"
                  value={fmt(calc.coastTarget)}
                  sub={`Save this today, never invest again`}
                  gradient="from-teal-600 to-cyan-500"
                  icon={<Anchor className="w-5 h-5" />}
                />
                <NumberCard
                  label="Full FIRE Target"
                  value={fmt(calc.fullFireTarget)}
                  sub={`Needed by age ${calc.retirementAge}`}
                  gradient="from-blue-600 to-indigo-500"
                  icon={<Sparkles className="w-5 h-5" />}
                />
              </div>

              {/* Progress bar + insights */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>Progress to Coast FIRE</span>
                    <span className="text-teal-600">{calc.pctOfCoast}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-700"
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
                    icon={<Clock className="w-4 h-4 text-teal-500" />}
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
                    icon={<Target className="w-4 h-4 text-blue-500" />}
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
                    icon={<TrendingUp className="w-4 h-4 text-cyan-500" />}
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
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="text-sm text-teal-800 leading-relaxed">
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
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                    View Two-Phase Growth Chart
                  </span>
                  {showChart ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showChart && (
                  <div className="mt-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm font-bold text-slate-700 mb-1">
                      Accumulation → Coast phase
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      Blue = saving aggressively · Teal = coasting (no new
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
                                stopColor="#0d9488"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#0d9488"
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
                          <Tooltip content={<CoastChartTooltip />} />
                          {calc.coastAge !== null && (
                            <ReferenceLine
                              x={calc.coastAge}
                              stroke="#0d9488"
                              strokeDasharray="4 3"
                              label={{
                                value: "Coast",
                                position: "top",
                                fontSize: 10,
                                fill: "#0d9488",
                              }}
                            />
                          )}
                          <ReferenceLine
                            x={calc.retirementAge}
                            stroke="#3b82f6"
                            strokeDasharray="4 3"
                            label={{
                              value: "Retire",
                              position: "top",
                              fontSize: 10,
                              fill: "#3b82f6",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="portfolio"
                            stroke="#0d9488"
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
              <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-slate-800">How Coast FIRE works</p>
                <p>
                  Coast FIRE = Full FIRE Number ÷ (1 + r)^years_to_retirement.
                  Once you hit this number, compound interest alone grows your
                  portfolio to your full retirement goal — no new investments
                  needed.
                </p>
              </div>
            </div>
          </div>

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
      <p className="text-teal-600">{fmt(d.portfolio)}</p>
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
    <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
      <p className="text-sm text-teal-800 font-bold">
        ✅ You&apos;ll reach Coast FIRE at age <strong>{calc.coastAge}</strong>{" "}
        in <strong>{calc.yearsToCoast} years</strong>. Then enjoy{" "}
        <strong>{coastingYears} years</strong> of coasting before full
        retirement at age {calc.retirementAge}.
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
        className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-sm sm:text-base bg-white/50"
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
  accentClass,
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
  accentClass: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
        {label}
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${accentClass}`}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{leftLabel}</span>
        <span className="font-bold text-teal-600">{display}</span>
        <span>{rightLabel}</span>
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
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
    <div className="flex flex-col items-center text-center gap-1 p-3 bg-slate-50 rounded-xl">
      <div className="mb-1">{icon}</div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-bold text-slate-800 text-sm">{value}</p>
    </div>
  );
}
