"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronUp, CreditCard, Info, RotateCcw, TrendingUp } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import { calculateEMI } from "@/lib/emiMath";
import { formatCurrency } from "@/lib/currency";
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
      <p className="text-orange-600 font-medium">Balance: {formatCurrency(payload[0].value)}</p>
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
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-400/15 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-2xl mx-auto relative z-10 px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-4">
            <CreditCard className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700">EMI True Cost Revealer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-3">
            That &quot;0% EMI&quot; Isn&apos;t Really 0%
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Enter your EMI offer and see the true cost — interest, processing fees, and the real premium you&apos;re paying over list price.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="glass p-1.5 rounded-2xl flex gap-1 mb-6">
          {(["zero-emi", "interest"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === m
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {m === "zero-emi" ? "0% EMI (with processing fee)" : "Interest-bearing EMI"}
            </button>
          ))}
        </div>

        {/* Input Card */}
        <div className="glass p-6 sm:p-8 rounded-3xl shadow-xl mb-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Product Price</label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Down Payment</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Tenure selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
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
                        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm"
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
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 mb-4">
                    <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-700">
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
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-500"
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
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1%</span><span>16% (credit card avg)</span><span>36%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Your Monthly Income <span className="font-normal text-slate-400">(optional — for affordability check)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 80000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 mb-6">
          {/* Primary result */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-5 rounded-2xl text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Monthly EMI</p>
              <p className="text-2xl font-black text-slate-800">{formatCurrency(result.monthlyEMI)}</p>
              {result.monthlyBurdenPercent !== null && (
                <p className={`text-xs font-bold mt-1 ${isHeavyBurden ? "text-red-500" : "text-emerald-600"}`}>
                  {result.monthlyBurdenPercent.toFixed(1)}% of income
                </p>
              )}
            </div>
            <div className={`p-5 rounded-2xl text-center border-2 ${isCostly ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
              <p className="text-xs text-slate-500 font-medium mb-1">True Total Cost</p>
              <p className="text-2xl font-black text-slate-800">{formatCurrency(result.totalPaid)}</p>
              <p className={`text-xs font-bold mt-1 ${isCostly ? "text-red-500" : "text-emerald-600"}`}>
                +{result.costPremiumPercent.toFixed(1)}% over list price
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Loan Amount</p>
              <p className="text-base font-black text-slate-800">{formatCurrency(result.loanAmount)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Total Extra Paid</p>
              <p className="text-base font-black text-red-600">{formatCurrency(result.totalInterest)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Effective APR</p>
              <p className="text-base font-black text-slate-800">{result.effectiveAnnualRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Warning banners */}
          {isCostly && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-black text-red-700">You&apos;re paying {result.costPremiumPercent.toFixed(1)}% more than list price</p>
                <p className="text-xs text-red-600 mt-0.5">
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
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <button
              type="button"
              onClick={() => setShowChart((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-bold text-slate-700"
            >
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
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
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} width={60} tickFormatter={(v) => formatCompactAxis(v)} />
                    <Tooltip content={<BalanceTooltip />} />
                    <Area type="monotone" dataKey="balance" stroke="#f97316" fill="url(#balanceGradient)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Amortisation schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
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
                        <td className="py-2 pr-3 text-red-600">{formatCurrency(row.interest)}</td>
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
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </main>
  );
}
