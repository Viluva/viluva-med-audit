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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Coins,
  RotateCcw,
  TrendingUp,
  Wallet,
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
  calculateRequiredCorpusForSwp,
  calculateSwpPlan,
} from "@/lib/investmentMath";

interface FormData {
  initialCorpus: string;
  monthlyWithdrawal: string;
  years: string;
  annualReturn: number;
}

function formatDurationFromMonths(months: number | null): string {
  if (months === null) {
    return "Full horizon";
  }

  return `${(months / 12).toFixed(1)} years`;
}

function SwpTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { totalWithdrawn: number };
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
        Balance: {formatCurrency(payload[0].value)}
      </p>
      <p className="text-rose-600">
        Withdrawn: {formatCurrency(payload[0].payload.totalWithdrawn)}
      </p>
    </div>
  );
}

export default function SwpCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    initialCorpus: "2000000",
    monthlyWithdrawal: "15000",
    years: "20",
    annualReturn: 8,
  });
  const [showResult, setShowResult] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const calculation = useMemo(() => {
    const initialCorpus = Math.max(0, Number(formData.initialCorpus));
    const monthlyWithdrawal = Math.max(0, Number(formData.monthlyWithdrawal));
    const years = Math.max(1, Number(formData.years));
    const annualReturn = formData.annualReturn / 100;
    const plan = calculateSwpPlan(
      initialCorpus,
      monthlyWithdrawal,
      annualReturn,
      years,
    );
    const requiredCorpus = calculateRequiredCorpusForSwp(
      monthlyWithdrawal,
      annualReturn,
      years,
    );

    return {
      initialCorpus,
      monthlyWithdrawal,
      years,
      annualReturn,
      requiredCorpus,
      ...plan,
      coverageRatio:
        requiredCorpus > 0
          ? ((initialCorpus / requiredCorpus) * 100).toFixed(0)
          : "0",
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
      initialCorpus: "2000000",
      monthlyWithdrawal: "15000",
      years: "20",
      annualReturn: 8,
    });
    setShowResult(false);
    setShowChart(false);
  };

  const portfolioLastsFullHorizon = calculation.depletionMonth === null;

  return (
    <CalculatorShell
      title="SWP Calculator"
      description="Estimate whether your corpus can support monthly withdrawals across your chosen horizon and how much capital remains at the end."
      badgeText="Retirement cash flow. Withdrawal sustainability."
      badgeIcon={Wallet}
      accent="investment"
      assumptions={[
        "Each month applies return first and then withdrawal is deducted.",
        "Annual return is converted to a monthly rate as annualRate / 12.",
        "If balance reaches zero, depletion is reported and future withdrawals stop.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          <NumberField
            label="Starting Corpus"
            name="initialCorpus"
            value={formData.initialCorpus}
            onChange={handleChange}
            hint="The invested amount from which withdrawals begin."
          />
          <NumberField
            label="Monthly Withdrawal"
            name="monthlyWithdrawal"
            value={formData.monthlyWithdrawal}
            onChange={handleChange}
            hint="The fixed monthly amount you plan to withdraw."
          />
          <NumberField
            label="Withdrawal Horizon (Years)"
            name="years"
            value={formData.years}
            onChange={handleChange}
            hint="How long the withdrawals need to continue."
            min={1}
            max={40}
          />
          <SliderField
            label="Expected Annual Return"
            name="annualReturn"
            value={formData.annualReturn}
            onChange={handleSlider}
            min={0}
            max={15}
            step={0.5}
            leftLabel="0%"
            rightLabel="15%"
            accent="investment"
            hint="Assumes returns compound monthly before each month's withdrawal."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full btn-primary py-3 sm:py-4"
            >
              Plan My SWP
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
                <Wallet className="w-5 h-5" />
                SWP Outcome
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {portfolioLastsFullHorizon
                  ? formatCompactCurrency(calculation.endingBalance)
                  : formatDurationFromMonths(calculation.depletionMonth)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                {portfolioLastsFullHorizon
                  ? `Estimated ending balance after ${calculation.years} years.`
                  : `Corpus runs out after about ${formatDurationFromMonths(calculation.depletionMonth)}.`}
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 ${portfolioLastsFullHorizon ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
            >
              <div className="flex items-start gap-3">
                {portfolioLastsFullHorizon ? (
                  <CircleCheckBig className="w-5 h-5 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-slate-900">
                    {portfolioLastsFullHorizon
                      ? "Your corpus supports the full withdrawal horizon."
                      : "Your current corpus does not fully support the withdrawal horizon."}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Required corpus for this plan is about{" "}
                    {formatCompactCurrency(calculation.requiredCorpus)}.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Withdrawn"
                value={formatCompactCurrency(calculation.totalWithdrawn)}
                icon={<Coins className="w-4 h-4 text-rose-500" />}
              />
              <StatCard
                label="Ending Balance"
                value={formatCompactCurrency(calculation.endingBalance)}
                icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
              />
              <StatCard
                label="Coverage Ratio"
                value={`${calculation.coverageRatio}%`}
                icon={<Wallet className="w-4 h-4 text-rose-500" />}
                subtext="Starting corpus as a percentage of the estimated required corpus."
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <button
                type="button"
                onClick={() => setShowChart((currentValue) => !currentValue)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
              >
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  View yearly balance projection
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
                    <AreaChart data={calculation.series}>
                      <defs>
                        <linearGradient
                          id="swpChartGradient"
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
                      <Tooltip content={<SwpTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#059669"
                        fill="url(#swpChartGradient)"
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
