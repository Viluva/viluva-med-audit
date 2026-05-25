"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, TrendingUp, ShoppingCart, Coins } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import { calculateBuyVsInvest } from "@/lib/emiMath";
import { formatCurrency, formatCompactCurrency } from "@/lib/currency";
import { formatCompactAxis } from "@/lib/currency";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEPRECIATION_MAP: Record<string, number> = {
  electronics: 25,
  vehicle: 20,
  clothing: 30,
  furniture: 10,
  jewelry: 2,
  experience: 100, // fully "spent"
  other: 15,
};

const DEPRECIATION_LABELS: Record<string, string> = {
  electronics: "Electronics / Gadgets (~25%/yr)",
  vehicle: "Vehicle (~20%/yr)",
  clothing: "Clothing / Fashion (~30%/yr)",
  furniture: "Furniture / Home (~10%/yr)",
  jewelry: "Jewellery / Gold (~2%/yr)",
  experience: "Experience / Travel (fully spent)",
  other: "Other (~15%/yr)",
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-slate-700 mb-1">Year {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function BuyVsInvestPage() {
  const [purchasePrice, setPurchasePrice] = useState("100000");
  const [purchaseName, setPurchaseName] = useState("");
  const [years, setYears] = useState(10);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [category, setCategory] = useState("electronics");

  const depreciationRate = DEPRECIATION_MAP[category] ?? 15;

  const result = useMemo(() => {
    const price = Math.max(0, Number(purchasePrice) || 0);
    return calculateBuyVsInvest(price, years, annualReturnRate, depreciationRate);
  }, [purchasePrice, years, annualReturnRate, depreciationRate]);

  const purchaseLabel = purchaseName.trim() || "Your Purchase";
  const price = Number(purchasePrice) || 0;

  const handleReset = () => {
    setPurchasePrice("100000");
    setPurchaseName("");
    setYears(10);
    setAnnualReturnRate(12);
    setCategory("electronics");
  };

  // Ratio: invested value vs purchase value at end of period
  const growthMultiple =
    result.purchaseDepreciatedValue > 0
      ? (result.investmentFutureValue / result.purchaseDepreciatedValue).toFixed(1)
      : "∞";

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-2xl mx-auto relative z-10 px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">Opportunity Cost Calculator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Buy It or Invest It?
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Every rupee you spend is a rupee that can&apos;t compound. See exactly what your purchase costs in future wealth — and what the same money would be worth if invested.
          </p>
        </div>

        {/* Inputs */}
        <div className="glass p-6 sm:p-8 rounded-3xl shadow-xl mb-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">What is it? <span className="font-normal text-slate-400">(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. iPhone, Bike"
                  value={purchaseName}
                  onChange={(e) => setPurchaseName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="font-normal text-slate-400">(determines depreciation rate)</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all bg-white"
              >
                {Object.entries(DEPRECIATION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-700">Time Horizon</label>
                <span className="text-sm font-black text-slate-700">{years} years</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 yr</span><span>10 yrs</span><span>30 yrs</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-700">Expected Investment Return</label>
                <span className="text-sm font-black text-slate-700">{annualReturnRate}% /yr</span>
              </div>
              <input
                type="range"
                min={4}
                max={20}
                step={0.5}
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>4% (FD)</span><span>12% (equity avg)</span><span>20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {price > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-6"
          >
            {/* Hero comparison */}
            <div className="glass p-6 rounded-3xl shadow-xl">
              <h2 className="text-lg font-black text-slate-700 mb-5 text-center">
                In {years} year{years !== 1 ? "s" : ""}, the same {formatCurrency(price)} is worth…
              </h2>

              <div className="flex items-stretch gap-3 mb-6">
                {/* Buy side */}
                <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">If You Buy</p>
                  <p className="text-xl font-black text-slate-800">{formatCompactCurrency(result.purchaseDepreciatedValue)}</p>
                  <p className="text-xs text-slate-400 mt-1">(resale value after {years}yr)</p>
                  <p className="text-xs text-red-500 font-bold mt-2">
                    Lost {formatCompactCurrency(price - result.purchaseDepreciatedValue)} to depreciation
                  </p>
                </div>

                <div className="flex items-center text-slate-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Invest side */}
                <div className="flex-1 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wide">If You Invest</p>
                  <p className="text-xl font-black text-emerald-700">{formatCompactCurrency(result.investmentFutureValue)}</p>
                  <p className="text-xs text-emerald-500 mt-1">at {annualReturnRate}% annual return</p>
                  <p className="text-xs text-emerald-600 font-bold mt-2">
                    +{formatCompactCurrency(result.opportunityCost)} growth
                  </p>
                </div>
              </div>

              {/* True cost callout */}
              <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-5 text-white text-center">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">True Cost of Buying {purchaseLabel}</p>
                <p className="text-3xl font-black mb-1">{formatCompactCurrency(result.totalTrueCost)}</p>
                <p className="text-sm text-slate-300">
                  = {formatCurrency(price)} purchase price + {formatCompactCurrency(result.opportunityCost)} opportunity cost
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                  <p className="text-xs text-slate-500 font-medium">Investment grows</p>
                  <p className="text-lg font-black text-emerald-600">{growthMultiple}×</p>
                  <p className="text-xs text-slate-400">vs purchase resale</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                  <p className="text-xs text-slate-500 font-medium">Opportunity cost</p>
                  <p className="text-lg font-black text-slate-800">{formatCompactCurrency(result.opportunityCost)}</p>
                  <p className="text-xs text-slate-400">foregone wealth</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm font-bold text-slate-700 mb-4">Value over {years} years</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlySeries}>
                    <defs>
                      <linearGradient id="investGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} width={64} tickFormatter={(v) => formatCompactAxis(v)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="investmentValue"
                      name="If Invested"
                      stroke="#10b981"
                      fill="url(#investGradient)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="purchaseValue"
                      name="If Bought (resale)"
                      stroke="#94a3b8"
                      fill="url(#purchaseGradient)"
                      strokeWidth={2.5}
                      strokeDasharray="5 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insight */}
            <div className="glass p-5 rounded-2xl text-center">
              <Coins className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600 leading-relaxed">
                If you invest {formatCurrency(price)} today at {annualReturnRate}%,{" "}
                it grows to <strong className="text-emerald-700">{formatCompactCurrency(result.investmentFutureValue)}</strong> in {years} years.
                <br />
                The <strong>{purchaseLabel}</strong>, meanwhile, would have a resale value of roughly{" "}
                <strong className="text-slate-700">{formatCompactCurrency(result.purchaseDepreciatedValue)}</strong>.
                <br />
                <span className="text-slate-500 text-xs mt-1 block">
                  This isn&apos;t a reason to never buy — it&apos;s a lens to see the real cost of every decision.
                </span>
              </p>
            </div>
          </motion.div>
        )}

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
