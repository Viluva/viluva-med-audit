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
  CalendarRange,
  ChevronDown,
  ChevronUp,
  Coins,
  PiggyBank,
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
  calculateSipFutureValue,
} from "@/lib/investmentMath";

interface FormData {
  monthlyInvestment: string;
  years: string;
  annualReturn: number;
}

function GrowthTooltip({
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

  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-slate-800">Year {label}</p>
      <p className="text-slate-600">
        Value: {formatCurrency(payload[0].value)}
      </p>
      <p className="text-slate-500">
        Invested: {formatCurrency(point.invested)}
      </p>
      <p className="text-emerald-600">Gain: {formatCurrency(point.gains)}</p>
    </div>
  );
}

export default function SIPCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    monthlyInvestment: "10000",
    years: "10",
    annualReturn: 12,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const calculation = useMemo(() => {
    const monthlyInvestment = Math.max(0, Number(formData.monthlyInvestment));
    const years = Math.max(1, Number(formData.years));
    const annualReturn = formData.annualReturn / 100;
    const totalInvested = monthlyInvestment * years * 12;
    const futureValue = calculateSipFutureValue(
      monthlyInvestment,
      annualReturn,
      years,
    );
    const wealthGain = Math.max(0, futureValue - totalInvested);
    const projection = buildInvestmentProjectionSeries(
      0,
      monthlyInvestment,
      annualReturn,
      years,
    );

    return {
      monthlyInvestment,
      years,
      futureValue,
      totalInvested,
      wealthGain,
      projection,
      multiple:
        totalInvested > 0 ? (futureValue / totalInvested).toFixed(2) : "0.00",
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
    setFormData({ monthlyInvestment: "10000", years: "10", annualReturn: 12 });
    setShowResult(false);
    setShowChart(false);
  };

  return (
    <CalculatorShell
      title="SIP Calculator"
      description="Estimate how disciplined monthly investing compounds over time and how much of your final corpus comes from returns versus contributions."
      badgeText="Monthly investing. Long-term compounding."
      badgeIcon={PiggyBank}
      accent="investment"
      assumptions={[
        "SIP contributions are made at the start of each month (annuity-due model).",
        "Annual return is converted to a monthly rate as annualRate / 12.",
        "Rate is assumed constant for the full duration; taxes, exit loads, and fund fees are not modeled.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          <NumberField
            label="Monthly SIP Amount"
            name="monthlyInvestment"
            value={formData.monthlyInvestment}
            onChange={handleChange}
            hint="Your fixed monthly contribution."
          />
          <NumberField
            label="Investment Duration (Years)"
            name="years"
            value={formData.years}
            onChange={handleChange}
            hint="How long you plan to continue the SIP."
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
            hint="Assumes monthly compounding and contributions at the start of each month."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full btn-primary py-3 sm:py-4"
            >
              Calculate SIP Returns
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
                <PiggyBank className="w-5 h-5" />
                Projected SIP Value
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCompactCurrency(calculation.futureValue)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                Investing {formatCurrency(calculation.monthlyInvestment)} every
                month for {calculation.years} years.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Invested"
                value={formatCompactCurrency(calculation.totalInvested)}
                icon={<Coins className="w-4 h-4 text-emerald-500" />}
              />
              <StatCard
                label="Wealth Gain"
                value={formatCompactCurrency(calculation.wealthGain)}
                icon={<TrendingUp className="w-4 h-4 text-cyan-500" />}
                subtext="Returns generated above your invested capital."
              />
              <StatCard
                label="Corpus Multiple"
                value={`${calculation.multiple}×`}
                icon={<CalendarRange className="w-4 h-4 text-emerald-500" />}
                subtext="Projected corpus divided by your total contributions."
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <button
                type="button"
                onClick={() => setShowChart((currentValue) => !currentValue)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
              >
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
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
                          id="sipChartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
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
                      <Tooltip content={<GrowthTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        fill="url(#sipChartGradient)"
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
