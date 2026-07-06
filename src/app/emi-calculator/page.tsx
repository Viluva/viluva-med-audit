"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronUp, CreditCard, Info, RotateCcw, TrendingUp } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  StatCard,
  SegmentedControl,
  formatCurrency,
} from "@/components/calculator/CalculatorShell";
import { calculateEMI } from "@/lib/emiMath";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactAxis } from "@/lib/currency";

const TENURE_OPTIONS = [3, 6, 9, 12, 18, 24, 36];

function BalanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-slate-700">Month {label}</p>
      <p className="text-violet-600 font-medium">Balance: {formatCurrency(payload[0].value)}</p>
    </div>
  );
}

type EMIMode = "interest" | "zero-emi";

export default function EMICalculatorPage() {
  const [mode, setMode] = useState<EMIMode>("zero-emi");
  const [productPrice, setProductPrice] = useState("50000");
  const [downPayment, setDownPayment] = useState("0");
  const [tenureMonths, setTenureMonths] = useState(12);
  const [annualInterestRate, setAnnualInterestRate] = useState(16);
  const [processingFeePercent, setProcessingFeePercent] = useState(2.5);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const result = useMemo(() => {
    const price = Math.max(0, Number(productPrice) || 0);
    const dp = Math.max(0, Math.min(Number(downPayment) || 0, price));
    const income = Number(monthlyIncome) || undefined;
    return calculateEMI(
      {
        productPrice: price,
        downPayment: dp,
        tenureMonths,
        annualInterestRate: mode === "zero-emi" ? 0 : annualInterestRate,
        processingFeePercent: mode === "zero-emi" ? processingFeePercent : 0,
      },
      income
    );
  }, [productPrice, downPayment, tenureMonths, annualInterestRate, processingFeePercent, mode, monthlyIncome]);

  const isCostly = result.costPremiumPercent > 5;
  const isHeavyBurden = result.monthlyBurdenPercent !== null && result.monthlyBurdenPercent > 30;

  // Chart: balance over time
  const chartData = result.breakdownByMonth.map((m) => ({
    month: m.month,
    balance: Math.round(m.balance),
    principal: Math.round(m.principal),
    interest: Math.round(m.interest),
  }));

  const handleReset = () => {
    setProductPrice("50000");
    setDownPayment("0");
    setTenureMonths(12);
    setAnnualInterestRate(16);
    setProcessingFeePercent(2.5);
    setMonthlyIncome("");
    setShowSchedule(false);
    setShowChart(false);
    setMode("zero-emi");
  };

  return (
    <CalculatorShell
      title={'That "0% EMI" Isn\'t Really 0%'}
      description="Enter your EMI offer and see the true cost — interest, processing fees, and the real premium you're paying over list price."
      badgeText="EMI True Cost Revealer"
      badgeIcon={CreditCard}
      accent="decision"
      maxWidthClass="max-w-2xl"
      assumptions={[
        "EMI is computed with the standard formula P × r × (1+r)^n / ((1+r)^n - 1) on the loan amount after down payment.",
        "\"0% EMI\" mode assumes no interest but applies an upfront processing fee on the loan amount, which is amortised into the effective APR via IRR.",
        "The affordability check compares monthly EMI to your monthly income; it does not account for other existing debts.",
      ]}
    >
      <div className="card p-6 sm:p-8 mb-6">
        <div className="space-y-5">
          <div className="flex justify-center">
            <SegmentedControl
              options={[
                { value: "zero-emi", label: "0% EMI (with processing fee)" },
                { value: "interest", label: "Interest-bearing EMI" },
              ]}
              value={mode}
              onChange={setMode}
              accent="decision"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Product Price"
              name="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              prefix="₹"
            />
            <NumberField
              label="Down Payment"
              name="downPayment"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              prefix="₹"
            />
          </div>

          {/* Tenure selector */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
              Tenure
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {TENURE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenureMonths(t)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    tenureMonths === t
                      ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "zero-emi" ? (
              <motion.div
                key="zero-emi"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-start gap-2 p-3 rounded-xl bg-violet-50 border border-violet-200 mb-4">
                  <Info className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-violet-700">
                    Most &quot;0% EMI&quot; offers charge a <strong>processing fee</strong> upfront (typically 1–3%) plus sometimes a subvention cost hidden in the product price.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-bold text-slate-700">Processing Fee</label>
                    <span className="text-sm font-black text-slate-700">{processingFeePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.25}
                    value={processingFeePercent}
                    onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span><span>2.5% (common)</span><span>5%</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="interest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-bold text-slate-700">Annual Interest Rate</label>
                  <span className="text-sm font-black text-slate-700">{annualInterestRate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={36}
                  step={0.5}
                  value={annualInterestRate}
                  onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1%</span><span>16% (credit card avg)</span><span>36%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <NumberField
            label="Your Monthly Income"
            name="monthlyIncome"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            hint="Optional — used for the affordability check."
            prefix="₹"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-6">
        {/* Primary result */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Monthly EMI"
            value={formatCurrency(result.monthlyEMI)}
            icon={<CreditCard className="w-4 h-4 text-violet-600" />}
            subtext={
              result.monthlyBurdenPercent !== null
                ? `${result.monthlyBurdenPercent.toFixed(1)}% of income`
                : undefined
            }
            tone={isHeavyBurden ? "danger" : "success"}
          />
          <StatCard
            label="True Total Cost"
            value={formatCurrency(result.totalPaid)}
            icon={<TrendingUp className="w-4 h-4 text-violet-600" />}
            subtext={`+${result.costPremiumPercent.toFixed(1)}% over list price`}
            tone={isCostly ? "danger" : "success"}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Loan Amount"
            value={formatCurrency(result.loanAmount)}
            icon={<Info className="w-4 h-4 text-slate-500" />}
          />
          <StatCard
            label="Total Extra Paid"
            value={formatCurrency(result.totalInterest)}
            icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
            tone="danger"
          />
          <StatCard
            label="Effective APR"
            value={`${result.effectiveAnnualRate.toFixed(1)}%`}
            icon={<TrendingUp className="w-4 h-4 text-violet-600" />}
          />
        </div>

        {/* Warning banners */}
        {isCostly && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200"
          >
            <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-black text-rose-700">You&apos;re paying {result.costPremiumPercent.toFixed(1)}% more than list price</p>
              <p className="text-xs text-rose-600 mt-0.5">
                An extra {formatCurrency(result.totalInterest)} goes to the lender, not toward the product.
                {mode === "zero-emi" && " That '0% EMI' processing fee adds up."}
              </p>
            </div>
          </motion.div>
        )}

        {isHeavyBurden && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-black text-amber-700">
                EMI exceeds 30% of your income
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                At {result.monthlyBurdenPercent?.toFixed(1)}%, this EMI significantly strains your monthly budget. Financial advisors recommend keeping all EMIs below 40% of take-home pay.
              </p>
            </div>
          </motion.div>
        )}

        {/* Balance chart */}
        <div className="card p-5">
          <button
            type="button"
            onClick={() => setShowChart((v) => !v)}
            className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
          >
            <span className="inline-flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              View outstanding balance over time
            </span>
            {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showChart && (
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={60} tickFormatter={(v) => formatCompactAxis(v)} />
                  <Tooltip content={<BalanceTooltip />} />
                  <Area type="monotone" dataKey="balance" stroke="#7c3aed" fill="url(#balanceGradient)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Amortisation schedule */}
        <div className="card p-5">
          <button
            type="button"
            onClick={() => setShowSchedule((v) => !v)}
            className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
          >
            <span>View full repayment schedule</span>
            {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showSchedule && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    {["Month", "EMI", "Principal", "Interest", "Balance"].map((h) => (
                      <th key={h} className="text-left py-2 pr-3 font-bold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.breakdownByMonth.map((row) => (
                    <tr key={row.month} className="border-b border-slate-100">
                      <td className="py-2 pr-3 text-slate-700 font-medium">{row.month}</td>
                      <td className="py-2 pr-3 text-slate-700">{formatCurrency(row.emi)}</td>
                      <td className="py-2 pr-3 text-emerald-700 font-medium">{formatCurrency(row.principal)}</td>
                      <td className="py-2 pr-3 text-rose-600">{formatCurrency(row.interest)}</td>
                      <td className="py-2 pr-3 text-slate-700">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reset */}
      <button onClick={handleReset} className="w-full btn-secondary py-3 sm:py-4">
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </CalculatorShell>
  );
}
