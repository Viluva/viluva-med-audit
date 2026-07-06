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
  calculateLumpsumFutureValue,
} from "@/lib/investmentMath";

interface FormData {
  initialInvestment: string;
  years: string;
  annualReturn: number;
}

function LumpsumTooltip({
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
      <p className="text-violet-600">
        Gain: {formatCurrency(payload[0].payload.gains)}
      </p>
    </div>
  );
}

export default function LumpsumCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    initialInvestment: "500000",
    years: "10",
    annualReturn: 12,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const calculation = useMemo(() => {
    const initialInvestment = Math.max(0, Number(formData.initialInvestment));
    const years = Math.max(1, Number(formData.years));
    const annualReturn = formData.annualReturn / 100;
    const futureValue = calculateLumpsumFutureValue(
      initialInvestment,
      annualReturn,
      years,
    );
    const wealthGain = Math.max(0, futureValue - initialInvestment);
    const projection = buildInvestmentProjectionSeries(
      initialInvestment,
      0,
      annualReturn,
      years,
    );

    return {
      initialInvestment,
      years,
      futureValue,
      wealthGain,
      projection,
      multiple:
        initialInvestment > 0
          ? (futureValue / initialInvestment).toFixed(2)
          : "0.00",
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
    setFormData({ initialInvestment: "500000", years: "10", annualReturn: 12 });
    setShowResult(false);
    setShowChart(false);
  };

  return (
    <CalculatorShell
      title="Lumpsum Calculator"
      description="See how a one-time investment grows over time and compare your invested capital against the wealth created by compounding."
      badgeText="One capital injection. Long compounding runway."
      badgeIcon={Landmark}
      accent="investment"
      assumptions={[
        "Growth is calculated using annual compounding: FV = P × (1 + r)^n.",
        "The return entered is treated as annual effective return and applied once per year.",
        "Taxes, charges, and interim cash flows are excluded.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          <NumberField
            label="One-Time Investment Amount"
            name="initialInvestment"
            value={formData.initialInvestment}
            onChange={handleChange}
            hint="The amount you want to invest today."
          />
          <NumberField
            label="Investment Duration (Years)"
            name="years"
            value={formData.years}
            onChange={handleChange}
            hint="How long this investment stays invested."
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
            hint="Assumes annual compounding on the one-time investment."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full btn-primary py-3 sm:py-4"
            >
              Calculate Lumpsum Growth
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
                <Landmark className="w-5 h-5" />
                Projected Maturity Value
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCompactCurrency(calculation.futureValue)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                Starting with {formatCurrency(calculation.initialInvestment)}{" "}
                for {calculation.years} years.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Invested Today"
                value={formatCompactCurrency(calculation.initialInvestment)}
                icon={<Coins className="w-4 h-4 text-blue-500" />}
              />
              <StatCard
                label="Wealth Gain"
                value={formatCompactCurrency(calculation.wealthGain)}
                icon={<TrendingUp className="w-4 h-4 text-violet-500" />}
                subtext="Returns created on top of your original capital."
              />
              <StatCard
                label="Money Multiplier"
                value={`${calculation.multiple}×`}
                icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
                subtext="Projected corpus divided by your starting amount."
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <button
                type="button"
                onClick={() => setShowChart((currentValue) => !currentValue)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
              >
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
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
                          id="lumpsumChartGradient"
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
                      <Tooltip content={<LumpsumTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#059669"
                        fill="url(#lumpsumChartGradient)"
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
