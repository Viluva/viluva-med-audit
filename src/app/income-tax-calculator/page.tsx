"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { Landmark, RotateCcw, TrendingDown, Info } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  formatCurrency,
  formatCompactCurrency,
} from "@/components/calculator/CalculatorShell";
import { compareRegimes, type IncomeTaxInputs } from "@/lib/incomeTaxMath";

const DEFAULT_INPUTS: Record<keyof IncomeTaxInputs, string> = {
  annualIncome: "1200000",
  deduction80C: "150000",
  deduction80D: "25000",
  homeLoanInterest: "0",
  npsContribution: "0",
  hraExemption: "0",
  otherDeductions: "0",
};

const FIELD_META: {
  key: keyof IncomeTaxInputs;
  label: string;
  hint: string;
}[] = [
  {
    key: "annualIncome",
    label: "Annual Income (CTC / gross)",
    hint: "Your total annual income before any deductions.",
  },
  {
    key: "deduction80C",
    label: "Section 80C investments",
    hint: "PF, ELSS, life insurance, PPF. Capped at ₹1,50,000. Old regime only.",
  },
  {
    key: "deduction80D",
    label: "Section 80D health insurance",
    hint: "Health insurance premiums. Capped at ₹1,00,000. Old regime only.",
  },
  {
    key: "homeLoanInterest",
    label: "Home loan interest (Sec 24b)",
    hint: "Capped at ₹2,00,000 for self-occupied property. Old regime only.",
  },
  {
    key: "npsContribution",
    label: "NPS contribution (80CCD-1B)",
    hint: "Additional NPS contribution. Capped at ₹50,000. Old regime only.",
  },
  {
    key: "hraExemption",
    label: "HRA exemption",
    hint: "Your calculated HRA exemption amount, if applicable. Old regime only.",
  },
  {
    key: "otherDeductions",
    label: "Other deductions",
    hint: "80E, 80G, or any other eligible old-regime deductions.",
  },
];

function ComparisonRow({
  label,
  oldValue,
  newValue,
  winner,
}: {
  label: string;
  oldValue: string;
  newValue: string;
  winner?: "old" | "new" | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 last:border-0 items-center">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p
        className={`text-sm font-bold text-right sm:text-left ${winner === "old" ? "text-emerald-700" : "text-slate-800"}`}
      >
        {oldValue}
      </p>
      <p
        className={`text-sm font-bold text-right sm:text-left ${winner === "new" ? "text-emerald-700" : "text-slate-800"}`}
      >
        {newValue}
      </p>
    </div>
  );
}

export default function IncomeTaxCalculatorPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [showResult, setShowResult] = useState(false);

  const numericInputs: IncomeTaxInputs = useMemo(
    () => ({
      annualIncome: Math.max(0, Number(inputs.annualIncome) || 0),
      deduction80C: Math.max(0, Number(inputs.deduction80C) || 0),
      deduction80D: Math.max(0, Number(inputs.deduction80D) || 0),
      homeLoanInterest: Math.max(0, Number(inputs.homeLoanInterest) || 0),
      npsContribution: Math.max(0, Number(inputs.npsContribution) || 0),
      hraExemption: Math.max(0, Number(inputs.hraExemption) || 0),
      otherDeductions: Math.max(0, Number(inputs.otherDeductions) || 0),
    }),
    [inputs],
  );

  const result = useMemo(() => compareRegimes(numericInputs), [numericInputs]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setShowResult(false);
  };

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    setShowResult(true);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setShowResult(false);
  };

  const winnerLabel = result.recommendedRegime === "new" ? "New Regime" : "Old Regime";

  return (
    <CalculatorShell
      title="Income Tax Calculator"
      description="Compare your tax under the old and new regimes for FY 2025-26 (AY 2026-27) and see exactly which one saves you more."
      badgeText="FY 2025-26 · Old vs New Regime"
      badgeIcon={Landmark}
      accent="decision"
      assumptions={[
        "Slabs used are the FY 2025-26 (AY 2026-27) new regime slabs and the long-standing old regime slabs for individuals below 60.",
        "Section 87A rebate is applied as a full rebate up to the eligible limit; marginal relief just above the rebate threshold is not modeled, so tax can jump sharply just past ₹12,00,000 (new) or ₹5,00,000 (old) taxable income.",
        "Surcharge for very high incomes (above ₹50L) is not included — only the 4% health & education cess is applied.",
        "Old-regime deductions (80C, 80D, home loan interest, NPS, HRA) do not apply under the new regime, per current law.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={handleCalculate} className="space-y-5">
          {FIELD_META.map((field) => (
            <NumberField
              key={field.key}
              label={field.label}
              name={field.key}
              value={inputs[field.key]}
              onChange={handleChange}
              hint={field.hint}
              prefix="₹"
            />
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button type="submit" className="w-full btn-primary py-3 sm:py-4">
              Compare Regimes
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
            <div className="bg-gradient-to-br from-violet-600 to-purple-500 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
                <TrendingDown className="w-5 h-5" />
                Recommended: {winnerLabel}
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCompactCurrency(result.savings)}
              </p>
              <p className="text-sm text-white/80 mt-2">
                Estimated annual tax savings by choosing the {winnerLabel.toLowerCase()}{" "}
                over the alternative.
              </p>
            </div>

            <div className="card p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-2 pb-3 mb-1 border-b-2 border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Metric</p>
                <p
                  className={`text-xs font-bold uppercase tracking-wide ${result.recommendedRegime === "old" ? "text-emerald-600" : "text-slate-400"}`}
                >
                  Old Regime
                </p>
                <p
                  className={`text-xs font-bold uppercase tracking-wide ${result.recommendedRegime === "new" ? "text-emerald-600" : "text-slate-400"}`}
                >
                  New Regime
                </p>
              </div>

              <ComparisonRow
                label="Total deductions"
                oldValue={formatCompactCurrency(result.oldRegime.totalDeductions)}
                newValue={formatCompactCurrency(result.newRegime.totalDeductions)}
              />
              <ComparisonRow
                label="Taxable income"
                oldValue={formatCompactCurrency(result.oldRegime.taxableIncome)}
                newValue={formatCompactCurrency(result.newRegime.taxableIncome)}
              />
              <ComparisonRow
                label="Tax payable (with cess)"
                oldValue={formatCurrency(result.oldRegime.totalTax)}
                newValue={formatCurrency(result.newRegime.totalTax)}
                winner={result.recommendedRegime}
              />
              <ComparisonRow
                label="Effective tax rate"
                oldValue={`${result.oldRegime.effectiveRate.toFixed(1)}%`}
                newValue={`${result.newRegime.effectiveRate.toFixed(1)}%`}
                winner={result.recommendedRegime}
              />
              <ComparisonRow
                label="Monthly take-home"
                oldValue={formatCurrency(result.oldRegime.takeHome / 12)}
                newValue={formatCurrency(result.newRegime.takeHome / 12)}
                winner={result.recommendedRegime}
              />
            </div>

            <div className="flex items-start gap-3 px-1">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                This is an estimate for individuals below 60. It does not include
                surcharge, marginal relief, or income from other heads (capital
                gains, business income). Verify with a tax professional before
                filing.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorShell>
  );
}
