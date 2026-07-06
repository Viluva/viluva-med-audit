"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Clock } from "lucide-react";
import {
  CalculatorShell,
  NumberField,
  SliderField,
  formatCurrency,
} from "@/components/calculator/CalculatorShell";
import { calculateTimeCost, type ConversionResult } from "@/lib/timeconvertor";

export default function TimeConverter() {
  const [formData, setFormData] = useState({
    item: "",
    price: "",
    income: "",
    hoursPerWeek: "40",
  });
  const [returnRate, setReturnRate] = useState(8);
  const [years, setYears] = useState(20);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isEditingHours, setIsEditingHours] = useState(false);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();

    const conversionResult = calculateTimeCost(
      Number(formData.price),
      {
        monthlyNetIncome: Number(formData.income),
        hoursWorkedPerWeek: Number(formData.hoursPerWeek),
      },
      formData.item,
      returnRate / 100,
      years,
    );

    setResult(conversionResult);
  };

  const updateOpportunityCost = (newRate?: number, newYears?: number) => {
    if (!result) return;

    const conversionResult = calculateTimeCost(
      Number(formData.price),
      {
        monthlyNetIncome: Number(formData.income),
        hoursWorkedPerWeek: Number(formData.hoursPerWeek),
      },
      formData.item,
      (newRate ?? returnRate) / 100,
      newYears ?? years,
    );

    setResult(conversionResult);
  };

  const shareToTwitter = () => {
    if (!result) return;
    const text = encodeURIComponent(result.shareableQuote);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  const handleReset = () => {
    setFormData({ item: "", price: "", income: "", hoursPerWeek: "40" });
    setResult(null);
  };

  return (
    <CalculatorShell
      title="True Cost Calculator"
      description="Find out how many hours you have to work for something, and how much that money could grow if you invested it instead."
      badgeText="Time = Money"
      badgeIcon={Clock}
      accent="utility"
      assumptions={[
        "Your true hourly wage is monthly net income divided by hours worked per week × 4.33 (average weeks per month).",
        "Opportunity cost assumes the purchase amount is invested today and compounds annually at the selected return rate.",
        "Taxes, raises, and irregular work weeks are not modeled — this is a simplified estimate.",
      ]}
    >
      <div className="card p-6 sm:p-10">
        <form onSubmit={calculate} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
              What do you want to buy?
            </label>
            <input
              type="text"
              placeholder="e.g. iPhone 15 Pro, Laptop, Vacation..."
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
              required
              className="input-field"
            />
          </div>

          {/* Price and Income Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="Price"
              name="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              min={0}
              step={0.01}
              prefix="₹"
            />
            <NumberField
              label="Monthly Net Income"
              name="income"
              value={formData.income}
              onChange={(e) =>
                setFormData({ ...formData, income: e.target.value })
              }
              min={0}
              step={0.01}
              prefix="₹"
            />
          </div>

          {/* Hours per week note */}
          {isEditingHours ? (
            <div className="text-center text-xs text-slate-500 pb-2 flex justify-center items-center gap-1">
              <span>Based on a </span>
              <input
                type="number"
                value={formData.hoursPerWeek}
                onChange={(e) =>
                  setFormData({ ...formData, hoursPerWeek: e.target.value })
                }
                className="w-16 p-1 rounded border border-slate-300 text-center"
                autoFocus
                min="1"
                max="168"
                onBlur={() => setIsEditingHours(false)}
              />
              <span> hour work week. </span>
              <button
                type="button"
                onClick={() => setIsEditingHours(false)}
                className="font-bold text-sky-600 hover:text-sky-800"
              >
                (Save)
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 pb-2">
              <span>Based on a {formData.hoursPerWeek} hour work week. </span>
              <button
                type="button"
                onClick={() => setIsEditingHours(true)}
                className="font-bold text-sky-600 hover:text-sky-800"
              >
                (Edit)
              </button>
            </div>
          )}

          <button type="submit" className="w-full btn-primary py-3 sm:py-4">
            Calculate True Cost
          </button>
        </form>

        {/* Result Display */}
        {result && (
          <motion.div
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="card-inset p-5 sm:p-6">
              {/* Time Cost */}
              <div className="text-center mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Time Cost
                </h3>
                <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent mb-2">
                  {result.formattedTime}
                </p>
                <p className="text-sm text-slate-600">
                  {result.totalHours} hours of your life
                </p>
              </div>

              {/* Opportunity Cost */}
              <div className="text-center mb-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Opportunity Cost
                </h3>
                <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent mb-2">
                  {formatCurrency(result.futureWealth.futureValue)}
                </p>
                <p className="text-sm text-slate-600">
                  Could grow to{" "}
                  <strong>{result.futureWealth.growthMultiple}x</strong> in{" "}
                  {result.futureWealth.years} years
                </p>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                  If invested today at {result.futureWealth.returnRate * 100}%
                  returns, this {formatCurrency(Number(formData.price))} could
                  be worth {formatCurrency(result.futureWealth.futureValue)} in{" "}
                  {result.futureWealth.years} years
                </p>
              </div>

              {/* Visual Comparison */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Today</span>
                  <span>Future ({result.futureWealth.years}y)</span>
                </div>
                <div className="relative h-10 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      width: `${(1 / result.futureWealth.growthMultiple) * 100}%`,
                    }}
                  >
                    <span className="px-2">
                      {formatCurrency(Number(formData.price))}
                    </span>
                  </div>
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-end text-white text-xs font-bold"
                    style={{ width: "100%" }}
                  >
                    <span className="px-2">
                      {result.futureWealth.growthMultiple}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjustable Parameters */}
              <div className="space-y-4 p-4 bg-white rounded-xl border border-slate-200 mb-6">
                <SliderField
                  label="Return Rate"
                  name="returnRate"
                  value={returnRate}
                  onChange={(e) => {
                    const newRate = Number(e.target.value);
                    setReturnRate(newRate);
                    updateOpportunityCost(newRate, undefined);
                  }}
                  min={5}
                  max={15}
                  step={0.5}
                  leftLabel="7% FD (Safe)"
                  rightLabel="15% Aggressive"
                  accent="utility"
                  suffix="%"
                />

                <SliderField
                  label="Time Horizon"
                  name="years"
                  value={years}
                  onChange={(e) => {
                    const newYears = Number(e.target.value);
                    setYears(newYears);
                    updateOpportunityCost(undefined, newYears);
                  }}
                  min={5}
                  max={40}
                  step={1}
                  leftLabel="5y"
                  rightLabel="40y"
                  accent="decision"
                  suffix=" years"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={shareToTwitter}
                  className="flex-1 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-md"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                  Share on X
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 btn-secondary py-3"
                >
                  Calculate Another
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorShell>
  );
}
