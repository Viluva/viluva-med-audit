"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, TrendingUp, ShoppingCart, Coins } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  StatCard,
  formatCurrency,
  formatCompactCurrency,
} from "@/components/calculator/CalculatorShell";
import { calculateBuyVsInvest } from "@/lib/emiMath";
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
    <CalculatorShell
      title="Buy It or Invest It?"
      description="Every rupee you spend is a rupee that can't compound. See exactly what your purchase costs in future wealth — and what the same money would be worth if invested."
      badgeText="Opportunity Cost Calculator"
      badgeIcon={TrendingUp}
      accent="decision"
      maxWidthClass="max-w-2xl"
      assumptions={[
        "Investment growth compounds annually at the entered expected return rate for the full time horizon.",
        "Depreciation is modeled as a constant annual percentage decline based on the selected category.",
        "Opportunity cost is the future value of the investment minus the original purchase price; taxes and inflation are not modeled.",
      ]}
    >
      {/* Inputs */}
      <div className="card p-6 sm:p-8 mb-6">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Purchase Price"
              name="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              prefix="₹"
            />
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                What is it? <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone, Bike"
                value={purchaseName}
                onChange={(e) => setPurchaseName(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
              Category <span className="font-normal text-slate-400">(determines depreciation rate)</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field bg-white"
            >
              {Object.entries(DEPRECIATION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <SliderField
            label="Time Horizon"
            name="years"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min={1}
            max={30}
            step={1}
            leftLabel="1 yr"
            rightLabel="30 yrs"
            accent="decision"
            suffix=" years"
          />

          <SliderField
            label="Expected Investment Return"
            name="annualReturnRate"
            value={annualReturnRate}
            onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
            min={4}
            max={20}
            step={0.5}
            leftLabel="4% (FD)"
            rightLabel="20%"
            accent="decision"
            suffix="% /yr"
          />
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
          <div className="card p-6">
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
                <p className="text-xs text-rose-500 font-bold mt-2">
                  Lost {formatCompactCurrency(price - result.purchaseDepreciatedValue)} to depreciation
                </p>
              </div>

              <div className="flex items-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Invest side */}
              <div className="flex-1 rounded-2xl bg-violet-50 border border-violet-200 p-4 text-center">
                <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-violet-600 mb-1 uppercase tracking-wide">If You Invest</p>
                <p className="text-xl font-black text-violet-700">{formatCompactCurrency(result.investmentFutureValue)}</p>
                <p className="text-xs text-violet-500 mt-1">at {annualReturnRate}% annual return</p>
                <p className="text-xs text-violet-600 font-bold mt-2">
                  +{formatCompactCurrency(result.opportunityCost)} growth
                </p>
              </div>
            </div>

            {/* True cost callout */}
            <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-purple-600 p-5 text-white text-center">
              <p className="text-xs uppercase tracking-widest text-white/70 mb-2">True Cost of Buying {purchaseLabel}</p>
              <p className="text-3xl font-black mb-1">{formatCompactCurrency(result.totalTrueCost)}</p>
              <p className="text-sm text-white/80">
                = {formatCurrency(price)} purchase price + {formatCompactCurrency(result.opportunityCost)} opportunity cost
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <StatCard
                label="Investment grows"
                value={`${growthMultiple}×`}
                icon={<TrendingUp className="w-4 h-4 text-violet-600" />}
                subtext="vs purchase resale"
                tone="success"
              />
              <StatCard
                label="Opportunity cost"
                value={formatCompactCurrency(result.opportunityCost)}
                icon={<Coins className="w-4 h-4 text-slate-500" />}
                subtext="foregone wealth"
              />
            </div>
          </div>

          {/* Chart */}
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-700 mb-4">Value over {years} years</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlySeries}>
                  <defs>
                    <linearGradient id="investGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
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
                    stroke="#7c3aed"
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
          <div className="card p-5 text-center">
            <Coins className="w-6 h-6 text-violet-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600 leading-relaxed">
              If you invest {formatCurrency(price)} today at {annualReturnRate}%,{" "}
              it grows to <strong className="text-violet-700">{formatCompactCurrency(result.investmentFutureValue)}</strong> in {years} years.
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
      <button onClick={handleReset} className="w-full btn-secondary py-3 sm:py-4">
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </CalculatorShell>
  );
}
