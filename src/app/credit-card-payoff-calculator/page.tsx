"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { CreditCard, RotateCcw, AlertTriangle, TrendingDown } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  StatCard,
  formatCurrency,
  formatCompactCurrency,
} from "@/components/calculator/CalculatorShell";
import { compareCreditCardPayoff } from "@/lib/creditCardMath";

function formatDuration(months: number): string {
  if (months >= 1200) return "50+ years";
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths} month${remMonths === 1 ? "" : "s"}`;
  if (remMonths === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${remMonths}m`;
}

export default function CreditCardPayoffCalculatorPage() {
  const [balance, setBalance] = useState("80000");
  const [apr, setApr] = useState(42);
  const [monthlyPayment, setMonthlyPayment] = useState("6000");
  const [minPaymentPercent, setMinPaymentPercent] = useState(5);
  const [minPaymentFloor, setMinPaymentFloor] = useState("200");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    return compareCreditCardPayoff({
      balance: Math.max(0, Number(balance) || 0),
      apr,
      monthlyPayment: Math.max(0, Number(monthlyPayment) || 0),
      minPaymentPercent,
      minPaymentFloor: Math.max(0, Number(minPaymentFloor) || 0),
    });
  }, [balance, apr, monthlyPayment, minPaymentPercent, minPaymentFloor]);

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    setShowResult(true);
  };

  const handleReset = () => {
    setBalance("80000");
    setApr(42);
    setMonthlyPayment("6000");
    setMinPaymentPercent(5);
    setMinPaymentFloor("200");
    setShowResult(false);
  };

  return (
    <CalculatorShell
      title="Credit Card Payoff Calculator"
      description="See exactly how long it takes to clear your balance, and how much more it costs if you only ever pay the minimum due."
      badgeText="Debt payoff & minimum-payment trap"
      badgeIcon={CreditCard}
      accent="decision"
      assumptions={[
        "Interest is compounded monthly on the remaining balance at APR / 12.",
        "The minimum payment is recalculated each month as a percentage of the remaining balance, with a fixed floor — matching how most Indian card issuers compute minimum due.",
        "New purchases, fees, and promotional 0% periods are not modeled — this assumes no new spending on the card.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          <NumberField
            label="Outstanding Balance"
            name="balance"
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
              setShowResult(false);
            }}
            hint="Total amount currently owed on the card."
            prefix="₹"
          />
          <SliderField
            label="Annual Interest Rate (APR)"
            name="apr"
            value={apr}
            onChange={(e) => {
              setApr(Number(e.target.value));
              setShowResult(false);
            }}
            min={12}
            max={48}
            step={1}
            leftLabel="12%"
            rightLabel="48%"
            accent="decision"
            hint="Most Indian credit cards charge between 30% and 42% APR."
          />
          <NumberField
            label="Your Monthly Payment"
            name="monthlyPayment"
            value={monthlyPayment}
            onChange={(e) => {
              setMonthlyPayment(e.target.value);
              setShowResult(false);
            }}
            hint="The fixed amount you plan to pay every month."
            prefix="₹"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            <SliderField
              label="Minimum Payment %"
              name="minPaymentPercent"
              value={minPaymentPercent}
              onChange={(e) => {
                setMinPaymentPercent(Number(e.target.value));
                setShowResult(false);
              }}
              min={2}
              max={10}
              step={0.5}
              leftLabel="2%"
              rightLabel="10%"
              accent="decision"
              hint="% of balance charged as minimum due each month."
              suffix="%"
            />
            <NumberField
              label="Minimum Payment Floor"
              name="minPaymentFloor"
              value={minPaymentFloor}
              onChange={(e) => {
                setMinPaymentFloor(e.target.value);
                setShowResult(false);
              }}
              hint="The lowest amount due regardless of balance."
              prefix="₹"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button type="submit" className="w-full btn-primary py-3 sm:py-4">
              Calculate Payoff
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
            {result.fixed.neverPaysOff ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-rose-800">
                    This payment never clears the balance.
                  </p>
                  <p className="text-sm text-rose-700 mt-1">
                    Your monthly payment is at or below the interest charged each
                    month, so the balance won&apos;t shrink. Increase your monthly
                    payment above {formatCurrency((Number(balance) * apr) / 100 / 12)}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-violet-600 to-purple-500 text-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                  <TrendingDown className="w-5 h-5" />
                  Paid off in
                </div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight">
                  {formatDuration(result.fixed.months)}
                </p>
                <p className="text-sm text-white/80 mt-2">
                  Total interest paid: {formatCompactCurrency(result.fixed.totalInterest)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                label="Your plan"
                value={formatDuration(result.fixed.months)}
                icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
                subtext={`Total paid: ${formatCompactCurrency(result.fixed.totalPaid)}`}
                tone="success"
              />
              <StatCard
                label="If you only paid the minimum"
                value={
                  result.minimum.neverPaysOff ? "Never clears" : formatDuration(result.minimum.months)
                }
                icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
                subtext={
                  result.minimum.neverPaysOff
                    ? "The minimum due never exceeds the monthly interest."
                    : `Total paid: ${formatCompactCurrency(result.minimum.totalPaid)}`
                }
                tone="danger"
              />
            </div>

            {!result.fixed.neverPaysOff && !result.minimum.neverPaysOff && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="font-bold text-emerald-800">
                  Paying {formatCurrency(Number(monthlyPayment))}/month instead of the
                  minimum saves you {formatCompactCurrency(result.interestSaved)} in
                  interest and clears your debt {formatDuration(result.monthsSaved)} sooner.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </CalculatorShell>
  );
}
