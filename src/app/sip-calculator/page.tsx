"use client";

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
  Field,
  formatCompactCurrency,
  formatCurrency,
  InvestmentPageShell,
  SliderField,
  StatCard,
} from "@/components/investment/InvestmentCalculatorUI";
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
    <InvestmentPageShell
      title="SIP Calculator"
      description="Estimate how disciplined monthly investing compounds over time and how much of your final corpus comes from returns versus contributions."
      badgeText="Monthly investing. Long-term compounding."
      badgeIcon={PiggyBank}
      titleGradientClass="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"
      badgeBackgroundClass="bg-emerald-50"
      badgeBorderClass="border-emerald-200"
      badgeTextClass="text-emerald-700"
      backgroundBlobClasses={["bg-emerald-400/20", "bg-cyan-400/20"]}
      assumptions={[
        "SIP contributions are made at the start of each month (annuity-due model).",
        "Annual return is converted to a monthly rate as annualRate / 12.",
        "Rate is assumed constant for the full duration; taxes, exit loads, and fund fees are not modeled.",
      ]}
    >
      <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
        <form onSubmit={handleCalculate} className="space-y-6">
          <Field
            label="Monthly SIP Amount (₹)"
            name="monthlyInvestment"
            value={formData.monthlyInvestment}
            onChange={handleChange}
            hint="Your fixed monthly contribution."
          />
          <Field
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
            accentClass="accent-emerald-500"
            hint="Assumes monthly compounding and contributions at the start of each month."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Calculate SIP Returns
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full border border-slate-200 bg-white text-slate-700 font-bold py-3 sm:py-4 rounded-xl hover:bg-slate-50 transition-all inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset inputs
            </button>
          </div>
        </form>

        {showResult && (
          <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-2xl shadow-lg p-6">
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
                        tickFormatter={(value) =>
                          value >= 1e7
                            ? `₹${(value / 1e7).toFixed(1)}Cr`
                            : `₹${(value / 1e5).toFixed(0)}L`
                        }
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
          </div>
        )}
      </div>
    </InvestmentPageShell>
  );
}
