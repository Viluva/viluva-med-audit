"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { Scale, RotateCcw, Trophy } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  formatCurrency,
  formatCompactCurrency,
} from "@/components/calculator/CalculatorShell";
import { compareLoanOffers, type LoanOffer } from "@/lib/loanCompareMath";

interface OfferFormState {
  principal: string;
  annualRate: number;
  tenureYears: string;
  processingFeePercent: string;
}

const DEFAULT_A: OfferFormState = {
  principal: "3000000",
  annualRate: 8.5,
  tenureYears: "20",
  processingFeePercent: "0.5",
};

const DEFAULT_B: OfferFormState = {
  principal: "3000000",
  annualRate: 9,
  tenureYears: "15",
  processingFeePercent: "0.25",
};

function toOffer(state: OfferFormState): LoanOffer {
  return {
    principal: Math.max(0, Number(state.principal) || 0),
    annualRate: state.annualRate,
    tenureMonths: Math.max(1, Number(state.tenureYears) || 1) * 12,
    processingFeePercent: Math.max(0, Number(state.processingFeePercent) || 0),
  };
}

function OfferForm({
  label,
  state,
  onChange,
}: {
  label: string;
  state: OfferFormState;
  onChange: (next: OfferFormState) => void;
}) {
  return (
    <div className="card-inset p-5 sm:p-6 space-y-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">{label}</h3>
      <NumberField
        label="Loan Amount"
        name={`${label}-principal`}
        value={state.principal}
        onChange={(e) => onChange({ ...state, principal: e.target.value })}
        prefix="₹"
      />
      <SliderField
        label="Interest Rate"
        name={`${label}-rate`}
        value={state.annualRate}
        onChange={(e) => onChange({ ...state, annualRate: Number(e.target.value) })}
        min={5}
        max={20}
        step={0.05}
        leftLabel="5%"
        rightLabel="20%"
        accent="decision"
      />
      <NumberField
        label="Tenure (Years)"
        name={`${label}-tenure`}
        value={state.tenureYears}
        onChange={(e) => onChange({ ...state, tenureYears: e.target.value })}
        min={1}
        max={30}
      />
      <NumberField
        label="Processing Fee"
        name={`${label}-fee`}
        value={state.processingFeePercent}
        onChange={(e) => onChange({ ...state, processingFeePercent: e.target.value })}
        step={0.05}
        hint="As a % of loan amount, one-time."
      />
    </div>
  );
}

export default function LoanComparisonCalculatorPage() {
  const [offerA, setOfferA] = useState(DEFAULT_A);
  const [offerB, setOfferB] = useState(DEFAULT_B);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => compareLoanOffers(toOffer(offerA), toOffer(offerB)),
    [offerA, offerB],
  );

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    setShowResult(true);
  };

  const handleReset = () => {
    setOfferA(DEFAULT_A);
    setOfferB(DEFAULT_B);
    setShowResult(false);
  };

  return (
    <CalculatorShell
      title="Loan Comparison Calculator"
      description="A lower EMI doesn't always mean a cheaper loan. Compare two offers side by side to see the true cost of each over its full tenure."
      badgeText="Compare two loan offers"
      badgeIcon={Scale}
      accent="decision"
      maxWidthClass="max-w-5xl"
      assumptions={[
        "EMI is calculated using the standard reducing-balance formula.",
        "Processing fees are treated as a one-time cost added to total cost, not financed into the loan.",
        "Rate changes over time (floating rates), foreclosure charges, and insurance add-ons are not modeled.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <OfferForm label="Offer A" state={offerA} onChange={setOfferA} />
            <OfferForm label="Offer B" state={offerB} onChange={setOfferB} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button type="submit" className="w-full btn-primary py-3 sm:py-4">
              Compare Offers
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
            <div className="bg-gradient-to-br from-violet-600 to-purple-500 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                <Trophy className="w-5 h-5" />
                Offer {result.cheaperOffer} costs less overall
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCompactCurrency(result.totalCostDifference)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                Total savings in cost across the full loan tenure.
              </p>
            </div>

            <div className="card p-5 sm:p-6 overflow-x-auto">
              <div className="grid grid-cols-3 gap-2 min-w-[420px] pb-3 mb-1 border-b-2 border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Metric</p>
                <p className={`text-xs font-bold uppercase tracking-wide ${result.cheaperOffer === "A" ? "text-emerald-600" : "text-slate-400"}`}>
                  Offer A
                </p>
                <p className={`text-xs font-bold uppercase tracking-wide ${result.cheaperOffer === "B" ? "text-emerald-600" : "text-slate-400"}`}>
                  Offer B
                </p>
              </div>

              {[
                { label: "Monthly EMI", a: formatCurrency(result.offerA.emi), b: formatCurrency(result.offerB.emi) },
                { label: "Total interest", a: formatCompactCurrency(result.offerA.totalInterest), b: formatCompactCurrency(result.offerB.totalInterest) },
                { label: "Processing fee", a: formatCurrency(result.offerA.processingFee), b: formatCurrency(result.offerB.processingFee) },
                { label: "Total cost of loan", a: formatCompactCurrency(result.offerA.totalCost), b: formatCompactCurrency(result.offerB.totalCost) },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-2 min-w-[420px] py-3 border-b border-slate-100 last:border-0">
                  <p className="text-sm text-slate-500 font-medium">{row.label}</p>
                  <p className={`text-sm font-bold ${result.cheaperOffer === "A" && row.label === "Total cost of loan" ? "text-emerald-700" : "text-slate-800"}`}>
                    {row.a}
                  </p>
                  <p className={`text-sm font-bold ${result.cheaperOffer === "B" && row.label === "Total cost of loan" ? "text-emerald-700" : "text-slate-800"}`}>
                    {row.b}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorShell>
  );
}
