"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChevronDown,
  ChevronUp,
  Coins,
  Landmark,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import {
  NumberField,
  formatCompactCurrency,
  formatCurrency,
  CalculatorShell,
  SliderField,
  StatCard,
} from "@/components/calculator/CalculatorShell";
import { formatCompactAxis } from "@/lib/currency";
import {
  buildInvestmentProjectionSeries,
  calculateCombinedFutureValue,
  calculateLumpsumFutureValue,
  calculateSipFutureValue,
} from "@/lib/investmentMath";

interface FormData {
  initialInvestment: string;
  monthlyInvestment: string;
  years: string;
  annualReturn: number;
}

function CombinedTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { invested: number; gains: number };
  }>;
  label?: number;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-slate-800">Year {label}</p>
      <p className="text-slate-600">
        Value: {formatCurrency(payload[0].value)}
      </p>
      <p className="text-slate-500">
        Invested: {formatCurrency(payload[0].payload.invested)}
      </p>
      <p className="text-cyan-600">
        Gain: {formatCurrency(payload[0].payload.gains)}
      </p>
    </div>
  );
}

export default function SipLumpsumCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    initialInvestment: "500000",
    monthlyInvestment: "10000",
    years: "10",
    annualReturn: 12,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const calculation = useMemo(() => {
    const initialInvestment = Math.max(0, Number(formData.initialInvestment));
    const monthlyInvestment = Math.max(0, Number(formData.monthlyInvestment));
    const years = Math.max(1, Number(formData.years));
    const annualReturn = formData.annualReturn / 100;
    const projectedValue = calculateCombinedFutureValue(
      initialInvestment,
      monthlyInvestment,
      annualReturn,
      years,
    );
    const totalInvested = initialInvestment + monthlyInvestment * years * 12;
    const wealthGain = Math.max(0, projectedValue - totalInvested);
    const projection = buildInvestmentProjectionSeries(
      initialInvestment,
      monthlyInvestment,
      annualReturn,
      years,
    );
    const lumpsumValue = calculateLumpsumFutureValue(
      initialInvestment,
      annualReturn,
      years,
    );
    const sipValue = calculateSipFutureValue(
      monthlyInvestment,
      annualReturn,
      years,
    );

    return {
      initialInvestment,
      monthlyInvestment,
      years,
      projectedValue,
      totalInvested,
      wealthGain,
      projection,
      lumpsumValue,
      sipValue,
    };
  }, [formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setShowResult(false);
  };

  const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: Number(event.target.value),
    });
    setShowResult(false);
  };

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    setShowResult(true);
    setShowChart(false);
  };

  const handleReset = () => {
    setFormData({
      initialInvestment: "500000",
      monthlyInvestment: "10000",
      years: "10",
      annualReturn: 12,
    });
    setShowResult(false);
    setShowChart(false);
  };

  return (
    <CalculatorShell
      title="SIP + Lumpsum Calculator"
      description="Model a blended strategy where you start with an initial investment and keep adding monthly SIP contributions to build a larger corpus."
      badgeText="Start with capital. Keep compounding monthly."
      badgeIcon={Landmark}
      accent="investment"
      assumptions={[
        "Lumpsum portion uses annual compounding: FV = P × (1 + r)^n.",
        "SIP portion uses monthly compounding with start-of-month contributions.",
        "Combined result is the sum of individual lumpsum and SIP maturity values.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          <NumberField
            label="One-Time Investment Amount"
            name="initialInvestment"
            value={formData.initialInvestment}
            onChange={handleChange}
            hint="The amount you deploy at the start."
          />
          <NumberField
            label="Monthly SIP Amount"
            name="monthlyInvestment"
            value={formData.monthlyInvestment}
            onChange={handleChange}
            hint="The monthly amount you keep adding."
          />
          <NumberField
            label="Investment Duration (Years)"
            name="years"
            value={formData.years}
            onChange={handleChange}
            hint="Total duration for both the initial amount and SIP."
            min={1}
            max={40}
          />
          <SliderField
            label="Expected Annual Return"
            name="annualReturn"
            value={formData.annualReturn}
            onChange={handleSlider}
            min={1}
            max={20}
            step={0.5}
            leftLabel="1%"
            rightLabel="20%"
            accent="investment"
            hint="Assumes annual compounding for lumpsum and monthly SIP contributions at the start of each month."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full btn-primary py-3 sm:py-4"
            >
              Calculate Combined Growth
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full btn-secondary py-3 sm:py-4"
            >
              <RotateCcw className="w-4 h-4" />
              Reset inputs
            </button>
          </div>
        </form>

        {showResult && (
          <motion.div
            className="mt-8 space-y-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                <TrendingUp className="w-5 h-5" />
                Combined Portfolio Value
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCompactCurrency(calculation.projectedValue)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                Built from {formatCurrency(calculation.initialInvestment)} up
                front and {formatCurrency(calculation.monthlyInvestment)}{" "}
                monthly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Invested"
                value={formatCompactCurrency(calculation.totalInvested)}
                icon={<Coins className="w-4 h-4 text-cyan-500" />}
              />
              <StatCard
                label="Lumpsum Contribution"
                value={formatCompactCurrency(calculation.lumpsumValue)}
                icon={<Landmark className="w-4 h-4 text-sky-500" />}
                subtext="Projected value contributed by the starting investment alone."
              />
              <StatCard
                label="SIP Contribution"
                value={formatCompactCurrency(calculation.sipValue)}
                icon={<TrendingUp className="w-4 h-4 text-indigo-500" />}
                subtext="Projected value contributed by monthly investing alone."
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm font-bold text-slate-700 mb-2">
                Wealth gain
              </p>
              <p className="text-3xl font-black text-slate-900 mb-1">
                {formatCompactCurrency(calculation.wealthGain)}
              </p>
              <p className="text-xs text-slate-500">
                This is the excess over the{" "}
                {formatCompactCurrency(calculation.totalInvested)} you directly
                contributed.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <button
                type="button"
                onClick={() => setShowChart((currentValue) => !currentValue)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
              >
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-500" />
                  View yearly projection
                </span>
                {showChart ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showChart ? (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calculation.projection}>
                      <defs>
                        <linearGradient
                          id="combinedChartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#059669"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#059669"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        width={60}
                        tickFormatter={(value) => formatCompactAxis(value)}
                      />
                      <Tooltip content={<CombinedTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#059669"
                        fill="url(#combinedChartGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorShell>
  );
}
