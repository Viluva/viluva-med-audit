"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
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
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <Link
            href="/time-converter"
            className="flex items-center gap-2 sm:gap-3 mb-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Viluva.png"
              alt="Viluva Logo"
              width={32}
              height={32}
              priority
              className="drop-shadow-md sm:w-10 sm:h-10"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              True Cost Calculator
            </h1>
          </Link>
          <p className="text-slate-600 font-semibold text-base sm:text-lg mt-1 max-w-md px-4">
            See what your purchases really cost in hours of your life
          </p>
          <div className="flex items-center gap-2 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 border border-amber-200 rounded-full">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wide">
              Time = Money
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
          <form onSubmit={calculate} className="space-y-5 sm:space-y-6">
            {/* Item Name */}
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
                className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm sm:text-base bg-white/50"
              />
            </div>

            {/* Price and Income Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm sm:text-base bg-white/50"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Monthly Net Income (₹)
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.income}
                  onChange={(e) =>
                    setFormData({ ...formData, income: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm sm:text-base bg-white/50"
                />
              </div>
            </div>

            {/* Hours Per Week */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                Hours Worked Per Week
              </label>
              <input
                type="number"
                placeholder="40"
                value={formData.hoursPerWeek}
                onChange={(e) =>
                  setFormData({ ...formData, hoursPerWeek: e.target.value })
                }
                required
                min="1"
                max="168"
                className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm sm:text-base bg-white/50"
              />
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Calculate True Cost
            </button>
          </form>

          {/* Result Display */}
          {result && (
            <div className="mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass p-5 sm:p-6 rounded-2xl">
                {/* Time Cost */}
                <div className="text-center mb-8">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Time Cost
                  </h3>
                  <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
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
                  <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    ₹{result.futureWealth.futureValue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-slate-600">
                    Could grow to{" "}
                    <strong>{result.futureWealth.growthMultiple}x</strong> in{" "}
                    {result.futureWealth.years} years
                  </p>
                  <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                    If invested today at {result.futureWealth.returnRate * 100}%
                    returns, this ₹
                    {Number(formData.price).toLocaleString("en-IN")} could be
                    worth ₹
                    {result.futureWealth.futureValue.toLocaleString("en-IN")} in{" "}
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
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        width: `${(1 / result.futureWealth.growthMultiple) * 100}%`,
                      }}
                    >
                      <span className="px-2">
                        ₹{Number(formData.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end text-white text-xs font-bold"
                      style={{ width: "100%" }}
                    >
                      <span className="px-2">
                        {result.futureWealth.growthMultiple}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Adjustable Parameters */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Return Rate
                      </label>
                      <span className="text-sm font-bold text-cyan-700">
                        {returnRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      step="0.5"
                      value={returnRate}
                      onChange={(e) => {
                        const newRate = Number(e.target.value);
                        setReturnRate(newRate);
                        updateOpportunityCost(newRate, undefined);
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-2 leading-tight">
                      <span className="text-left flex-1">
                        <span className="font-semibold text-slate-600">7%</span>
                        <br />
                        FD (Safe)
                      </span>
                      <span className="text-center flex-1">
                        <span className="font-semibold text-slate-600">
                          12%
                        </span>
                        <br />
                        Nifty50
                      </span>
                      <span className="text-right flex-1">
                        <span className="font-semibold text-slate-600">
                          15%
                        </span>
                        <br />
                        Aggressive
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Time Horizon
                      </label>
                      <span className="text-sm font-bold text-purple-700">
                        {years} years
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={years}
                      onChange={(e) => {
                        const newYears = Number(e.target.value);
                        setYears(newYears);
                        updateOpportunityCost(undefined, newYears);
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>5y</span>
                      <span>40y</span>
                    </div>
                  </div>
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
                    className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-all"
                  >
                    Calculate Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 sm:mt-8 glass px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800 mb-1">How it works:</p>
              <p>
                See the <strong className="text-cyan-700">time cost</strong>{" "}
                (hours of life spent earning) and{" "}
                <strong className="text-purple-700">opportunity cost</strong>{" "}
                (future wealth foregone by not investing). Adjust the sliders to
                explore different scenarios.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 text-center space-y-2">
          <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
            <span className="font-bold">Part of Viluva Tools Suite</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Viluva. Built for financial awareness.
          </p>
        </footer>
      </div>
    </main>
  );
}
