"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, RotateCcw, Save } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  StatCard,
  formatCurrency,
  formatCompactCurrency,
} from "@/components/calculator/CalculatorShell";
import { calculateNetWorth, type NetWorthInputs } from "@/lib/netWorthMath";

const STORAGE_KEY = "viluva-net-worth-v1";

const DEFAULT_INPUTS: Record<keyof NetWorthInputs, string> = {
  cashSavings: "200000",
  investments: "500000",
  retirementAccounts: "300000",
  realEstate: "0",
  otherAssets: "0",
  homeLoan: "0",
  vehicleLoan: "0",
  creditCardDebt: "0",
  otherLoans: "0",
};

const ASSET_FIELDS: { key: keyof NetWorthInputs; label: string }[] = [
  { key: "cashSavings", label: "Cash & Savings" },
  { key: "investments", label: "Investments (stocks, MFs, gold)" },
  { key: "retirementAccounts", label: "Retirement Accounts (PF, NPS)" },
  { key: "realEstate", label: "Real Estate (current value)" },
  { key: "otherAssets", label: "Other Assets" },
];

const LIABILITY_FIELDS: { key: keyof NetWorthInputs; label: string }[] = [
  { key: "homeLoan", label: "Home Loan Balance" },
  { key: "vehicleLoan", label: "Vehicle Loan Balance" },
  { key: "creditCardDebt", label: "Credit Card Debt" },
  { key: "otherLoans", label: "Other Loans" },
];

const LEVERAGE_COPY: Record<string, { title: string; tone: "success" | "warning" | "danger" }> = {
  strong: { title: "Strong position — low leverage relative to assets.", tone: "success" },
  moderate: { title: "Moderate leverage — worth monitoring debt growth.", tone: "warning" },
  leveraged: { title: "Highly leveraged — liabilities are a large share of assets.", tone: "danger" },
};

const ASSET_COLORS = ["#059669", "#0ea5e9", "#4f46e5", "#ea580c", "#7c3aed"];
const LIABILITY_COLORS = ["#e11d48", "#f97316", "#d97706", "#64748b"];

export default function NetWorthCalculatorPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Syncing an external system (localStorage) into state on mount —
        // this is the documented exception to the set-state-in-effect rule.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputs((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore malformed local storage payload
      }
    }
  }, []);

  const numericInputs: NetWorthInputs = useMemo(
    () => ({
      cashSavings: Number(inputs.cashSavings) || 0,
      investments: Number(inputs.investments) || 0,
      retirementAccounts: Number(inputs.retirementAccounts) || 0,
      realEstate: Number(inputs.realEstate) || 0,
      otherAssets: Number(inputs.otherAssets) || 0,
      homeLoan: Number(inputs.homeLoan) || 0,
      vehicleLoan: Number(inputs.vehicleLoan) || 0,
      creditCardDebt: Number(inputs.creditCardDebt) || 0,
      otherLoans: Number(inputs.otherLoans) || 0,
    }),
    [inputs],
  );

  const result = useMemo(() => calculateNetWorth(numericInputs), [numericInputs]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setShowResult(false);
    setSaved(false);
  };

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    setShowResult(true);
  };

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    setSaved(true);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setShowResult(false);
    setSaved(false);
  };

  const leverage = LEVERAGE_COPY[result.leverageBand];

  return (
    <CalculatorShell
      title="Net Worth Calculator"
      description="List what you own and what you owe to see your real net worth, your asset mix, and how leveraged you are."
      badgeText="Assets vs liabilities snapshot"
      badgeIcon={Wallet}
      accent="decision"
      maxWidthClass="max-w-5xl"
      assumptions={[
        "Real estate is valued at current estimated market value, not purchase price.",
        "Nothing is stored on a server — 'Save snapshot' only writes to your browser's local storage so you can revisit it later on this device.",
        "This is a point-in-time snapshot; it doesn't track history or trends automatically.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Assets</h3>
              {ASSET_FIELDS.map((field) => (
                <NumberField
                  key={field.key}
                  label={field.label}
                  name={field.key}
                  value={inputs[field.key]}
                  onChange={handleChange}
                  prefix="₹"
                />
              ))}
            </div>
            <div className="space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wide text-rose-700">Liabilities</h3>
              {LIABILITY_FIELDS.map((field) => (
                <NumberField
                  key={field.key}
                  label={field.label}
                  name={field.key}
                  value={inputs[field.key]}
                  onChange={handleChange}
                  prefix="₹"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button type="submit" className="w-full btn-primary py-3 sm:py-4 sm:col-span-1">
              Calculate Net Worth
            </button>
            <button type="button" onClick={handleSave} className="w-full btn-secondary py-3 sm:py-4">
              <Save className="w-4 h-4" />
              {saved ? "Saved to this device" : "Save snapshot"}
            </button>
            <button type="button" onClick={handleReset} className="w-full btn-secondary py-3 sm:py-4">
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
            <div
              className={`rounded-2xl shadow-lg p-6 text-white bg-gradient-to-br ${
                result.netWorth >= 0 ? "from-emerald-600 to-teal-500" : "from-rose-600 to-orange-500"
              }`}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                <Wallet className="w-5 h-5" />
                Your Net Worth
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCurrency(result.netWorth)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                {formatCompactCurrency(result.totalAssets)} in assets minus{" "}
                {formatCompactCurrency(result.totalLiabilities)} in liabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Assets"
                value={formatCompactCurrency(result.totalAssets)}
                icon={<Wallet className="w-4 h-4 text-emerald-600" />}
                tone="success"
              />
              <StatCard
                label="Total Liabilities"
                value={formatCompactCurrency(result.totalLiabilities)}
                icon={<Wallet className="w-4 h-4 text-rose-600" />}
                tone="danger"
              />
              <StatCard
                label="Debt-to-Asset Ratio"
                value={`${result.debtToAssetRatio.toFixed(1)}%`}
                icon={<Wallet className="w-4 h-4 text-slate-600" />}
                subtext={leverage.title}
                tone={leverage.tone}
              />
            </div>

            {result.assetBreakdown.length > 0 && (
              <div className="card p-5 sm:p-6">
                <h3 className="text-sm font-black text-slate-700 mb-4">Asset Allocation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.assetBreakdown}
                          dataKey="value"
                          nameKey="label"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {result.assetBreakdown.map((entry, index) => (
                            <Cell key={entry.label} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {result.assetBreakdown.map((item, index) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: ASSET_COLORS[index % ASSET_COLORS.length] }}
                          />
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-800">{formatCompactCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result.liabilityBreakdown.length > 0 && (
              <div className="card p-5 sm:p-6">
                <h3 className="text-sm font-black text-slate-700 mb-4">Liability Breakdown</h3>
                <div className="space-y-2">
                  {result.liabilityBreakdown.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: LIABILITY_COLORS[index % LIABILITY_COLORS.length] }}
                        />
                        {item.label}
                      </span>
                      <span className="font-bold text-slate-800">{formatCompactCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </CalculatorShell>
  );
}
