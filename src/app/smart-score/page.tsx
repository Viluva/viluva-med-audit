"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { RotateCcw, Sparkles, ShieldCheck, Target, Wallet, ChevronRight, Lock } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";
import {
  calculateSmartScore,
  type PurchaseCategory,
  type PurchasePriority,
  type SmartScoreResult,
} from "@/lib/smartScore";
import { formatCurrency } from "@/lib/currency";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3 | 4;

interface Finances {
  monthlyIncome: string;
  monthlyFixedCosts: string;
  emergencyFundMonths: number;
  monthlySavings: string;
}

interface Purchase {
  purchaseName: string;
  purchasePrice: string;
  priority: PurchasePriority;
  category: PurchaseCategory;
}

interface Goal {
  hasGoal: boolean;
  goalAmount: string;
  goalMonths: string;
}

// ─── Animation preset ────────────────────────────────────────────────────────

const stepAnim = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

// ─── Recommendation config ────────────────────────────────────────────────────

const REC_CONFIG = {
  excellent: {
    label: "Excellent Choice",
    emoji: "✅",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    ringColor: "#10b981",
  },
  good: {
    label: "Good Choice",
    emoji: "👍",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
    textColor: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    ringColor: "#06b6d4",
  },
  caution: {
    label: "Proceed with Caution",
    emoji: "⚠️",
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    ringColor: "#f59e0b",
  },
  avoid: {
    label: "Not Recommended",
    emoji: "❌",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    ringColor: "#ef4444",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PillarBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function RadioCard<T extends string>({
  value,
  selected,
  onSelect,
  title,
  description,
}: {
  value: T;
  selected: T;
  onSelect: (v: T) => void;
  title: string;
  description: string;
}) {
  const isSelected = value === selected;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-cyan-500 bg-cyan-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
            isSelected ? "border-cyan-500 bg-cyan-500" : "border-slate-300"
          }`}
        >
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
          )}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{title}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
    </button>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? "bg-cyan-500" : i === current ? "bg-cyan-400 flex-1" : "bg-slate-200"
          } ${i === current ? "w-8" : "w-4"}`}
        />
      ))}
      <span className="text-xs font-bold text-slate-500 ml-1">
        {current + 1} / {total}
      </span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SmartScorePage() {
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");

  const [finances, setFinances] = useState<Finances>({
    monthlyIncome: "",
    monthlyFixedCosts: "",
    emergencyFundMonths: 2,
    monthlySavings: "",
  });

  const [purchase, setPurchase] = useState<Purchase>({
    purchaseName: "",
    purchasePrice: "",
    priority: "could-have",
    category: "depreciating",
  });

  const [goal, setGoal] = useState<Goal>({
    hasGoal: false,
    goalAmount: "",
    goalMonths: "",
  });

  const [result, setResult] = useState<SmartScoreResult | null>(null);

  // Animated score counter
  const displayedScore = useMotionValue(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    return displayedScore.on("change", (v) => setAnimatedScore(Math.round(v)));
  }, [displayedScore]);

  useEffect(() => {
    if (step === 4 && result) {
      const controls = animate(displayedScore, result.score, {
        duration: 1.3,
        ease: "easeOut",
      });
      return () => controls.stop();
    } else {
      displayedScore.set(0);
    }
  }, [step, result, displayedScore]);

  // ── Compute result ──
  const handleCalculate = () => {
    const r = calculateSmartScore({
      monthlyIncome: Number(finances.monthlyIncome) || 0,
      monthlyFixedCosts: Number(finances.monthlyFixedCosts) || 0,
      emergencyFundMonths: finances.emergencyFundMonths,
      monthlySavings: Number(finances.monthlySavings) || 0,
      purchaseName: purchase.purchaseName,
      purchasePrice: Number(purchase.purchasePrice) || 0,
      priority: purchase.priority,
      category: purchase.category,
      hasGoal: goal.hasGoal,
      goalAmount: Number(goal.goalAmount) || 0,
      goalMonths: Number(goal.goalMonths) || 0,
    });
    setResult(r);
    setStep(4);
  };

  const handleReset = () => {
    setStep(0);
    setResult(null);
    setAnimatedScore(0);
    displayedScore.set(0);
    setFinances({ monthlyIncome: "", monthlyFixedCosts: "", emergencyFundMonths: 2, monthlySavings: "" });
    setPurchase({ purchaseName: "", purchasePrice: "", priority: "could-have", category: "depreciating" });
    setGoal({ hasGoal: false, goalAmount: "", goalMonths: "" });
    setEmail("");
    setEmailStatus("idle");
    setEmailMessage("");
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailStatus("success");
        setEmailMessage("You're on the list. We'll reach out before launch.");
        setEmail("");
      } else {
        setEmailStatus("error");
        setEmailMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setEmailStatus("error");
      setEmailMessage("Something went wrong. Try again.");
    }
  };

  // ── Validation ──
  const step1Valid =
    Number(finances.monthlyIncome) > 0 && Number(finances.monthlyFixedCosts) >= 0;
  const step2Valid = Number(purchase.purchasePrice) > 0;

  const rec = result ? REC_CONFIG[result.recommendation] : null;

  const gaugeCircumference = 2 * Math.PI * 74;
  const gaugeOffset = result
    ? gaugeCircumference - (animatedScore / 100) * gaugeCircumference
    : gaugeCircumference;

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl" />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-2xl mx-auto relative z-10 px-4 sm:px-6 py-6 sm:py-10">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Intro ── */}
          {step === 0 && (
            <motion.div key="step-0" {...stepAnim} className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-5">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-700">Sneak Preview · Viluva AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-5">
                Should You Buy It?
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
                Get a personalised <strong>0–100 Smart Score</strong> on any purchase. Not based on price alone — based on your income, goals, and financial foundation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 text-left">
                {[
                  { icon: Wallet, title: "Affordability", desc: "Can your finances actually absorb this?" },
                  { icon: Target, title: "Value Alignment", desc: "Does it match your priorities?" },
                  { icon: ShieldCheck, title: "Goal Impact", desc: "What does it cost your future?" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="glass p-4 rounded-2xl text-center">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{title}</p>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-black px-8 py-4 rounded-2xl hover:from-violet-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
              >
                Get My Smart Score
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 mt-4">Takes about 60 seconds. No sign-up needed.</p>
            </motion.div>
          )}

          {/* ── Step 1: Your Finances ── */}
          {step === 1 && (
            <motion.div key="step-1" {...stepAnim}>
              <StepIndicator current={0} total={3} />
              <div className="glass p-6 sm:p-8 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-black text-slate-800 mb-1">Your Financial Picture</h2>
                <p className="text-sm text-slate-500 mb-7">
                  All inputs stay on your device. Nothing is stored or sent anywhere.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Monthly take-home income
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 80000"
                      value={finances.monthlyIncome}
                      onChange={(e) => setFinances((f) => ({ ...f, monthlyIncome: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">After tax / in-hand.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Monthly fixed costs — rent, EMIs, bills
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35000"
                      value={finances.monthlyFixedCosts}
                      onChange={(e) => setFinances((f) => ({ ...f, monthlyFixedCosts: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">Committed outflows every month.</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-sm font-bold text-slate-700">
                        Emergency fund
                      </label>
                      <span className="text-sm font-black text-slate-700">
                        {finances.emergencyFundMonths >= 12 ? "12+" : finances.emergencyFundMonths} months
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      step={0.5}
                      value={finances.emergencyFundMonths}
                      onChange={(e) => setFinances((f) => ({ ...f, emergencyFundMonths: Number(e.target.value) }))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0 months</span><span>6 months (ideal)</span><span>12+</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Monthly savings toward any goal
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      value={finances.monthlySavings}
                      onChange={(e) => setFinances((f) => ({ ...f, monthlySavings: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">Can be 0 if you&apos;re not saving toward a specific goal right now.</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={!step1Valid}
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-black py-3 rounded-xl hover:from-violet-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    Next: The Purchase
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: The Purchase ── */}
          {step === 2 && (
            <motion.div key="step-2" {...stepAnim}>
              <StepIndicator current={1} total={3} />
              <div className="glass p-6 sm:p-8 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-black text-slate-800 mb-1">What Are You Buying?</h2>
                <p className="text-sm text-slate-500 mb-7">Tell us about the purchase you&apos;re considering.</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      What is it? <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. iPhone 16 Pro, Gym membership, Weekend trip"
                      value={purchase.purchaseName}
                      onChange={(e) => setPurchase((p) => ({ ...p, purchaseName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Purchase price</label>
                    <input
                      type="number"
                      placeholder="e.g. 129900"
                      value={purchase.purchasePrice}
                      onChange={(e) => setPurchase((p) => ({ ...p, purchasePrice: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2.5">
                      How important is this to you?
                    </label>
                    <div className="space-y-2">
                      {(
                        [
                          { value: "must-have", title: "Must-Have", desc: "Life or work genuinely depends on it" },
                          { value: "should-have", title: "Should-Have", desc: "Meaningful, but not critical" },
                          { value: "could-have", title: "Could-Have", desc: "Nice to have, there are alternatives" },
                          { value: "fun-want", title: "Fun Want", desc: "Purely desire-driven, impulse territory" },
                        ] as const
                      ).map((opt) => (
                        <RadioCard
                          key={opt.value}
                          value={opt.value}
                          selected={purchase.priority}
                          onSelect={(v) => setPurchase((p) => ({ ...p, priority: v }))}
                          title={opt.title}
                          description={opt.desc}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2.5">
                      What kind of purchase is it?
                    </label>
                    <div className="space-y-2">
                      {(
                        [
                          { value: "investment", title: "Investment / Asset", desc: "Grows in value or generates returns" },
                          { value: "tool", title: "Tool for Growth", desc: "Directly enables income or learning" },
                          { value: "health", title: "Health & Wellness", desc: "Physical or mental wellbeing" },
                          { value: "experience", title: "Experience", desc: "Travel, event, memory-building" },
                          { value: "depreciating", title: "Gadget / Depreciating Asset", desc: "Loses value over time" },
                          { value: "consumable", title: "Consumable / One-time", desc: "Used up, no lasting value" },
                        ] as const
                      ).map((opt) => (
                        <RadioCard
                          key={opt.value}
                          value={opt.value}
                          selected={purchase.category}
                          onSelect={(v) => setPurchase((p) => ({ ...p, category: v }))}
                          title={opt.title}
                          description={opt.desc}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={!step2Valid}
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-black py-3 rounded-xl hover:from-violet-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    Next: Your Goals
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Goals ── */}
          {step === 3 && (
            <motion.div key="step-3" {...stepAnim}>
              <StepIndicator current={2} total={3} />
              <div className="glass p-6 sm:p-8 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-black text-slate-800 mb-1">Any Savings Goals?</h2>
                <p className="text-sm text-slate-500 mb-7">
                  If you have a goal this purchase might affect, tell us. It makes your score sharper.
                </p>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-sm font-bold text-slate-700">
                      I have a savings goal this could delay
                    </span>
                    <button
                      type="button"
                      onClick={() => setGoal((g) => ({ ...g, hasGoal: !g.hasGoal }))}
                      className={`ml-auto relative w-12 h-6 rounded-full transition-colors ${
                        goal.hasGoal ? "bg-cyan-500" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          goal.hasGoal ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {goal.hasGoal && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Goal amount
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 500000"
                            value={goal.goalAmount}
                            onChange={(e) => setGoal((g) => ({ ...g, goalAmount: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                          />
                          <p className="text-xs text-slate-400 mt-1">e.g. down payment, emergency fund target, travel fund</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            When do you want to reach it?
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="e.g. 18"
                              value={goal.goalMonths}
                              onChange={(e) => setGoal((g) => ({ ...g, goalMonths: e.target.value }))}
                              className="w-full px-4 pr-16 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">months</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-black py-3 rounded-xl hover:from-violet-700 hover:to-cyan-700 transition-all shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate My Smart Score
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Score Result ── */}
          {step === 4 && result && rec && (
            <motion.div key="step-4" {...stepAnim}>
              <div className="glass p-6 sm:p-8 rounded-3xl shadow-2xl">

                {/* Score header */}
                <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-8">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-700 font-bold mb-2">Smart Score Preview</p>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
                      {purchase.purchaseName || "Your Purchase"}
                    </h2>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${rec.bgColor} ${rec.textColor} border ${rec.borderColor} mt-2`}
                    >
                      {rec.emoji} {rec.label}
                    </div>
                  </div>

                  {/* Gauge */}
                  <div className="relative w-44 h-44 mx-auto md:mx-0 flex-shrink-0">
                    <svg viewBox="0 0 180 180" className="w-full h-full">
                      <circle cx="90" cy="90" r="74" stroke="#e2e8f0" strokeWidth="14" fill="none" />
                      <motion.circle
                        cx="90"
                        cy="90"
                        r="74"
                        stroke={rec.ringColor}
                        strokeWidth="14"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={gaugeCircumference}
                        strokeDashoffset={gaugeOffset}
                        transform="rotate(-90 90 90)"
                        transition={{ duration: 1.3, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-800">{animatedScore}</span>
                      <span className="text-xs font-bold text-slate-400">out of 100</span>
                    </div>
                  </div>
                </div>

                {/* Insight */}
                <div className={`p-4 rounded-2xl border ${rec.borderColor} ${rec.bgColor} mb-6`}>
                  <p className={`text-sm font-semibold ${rec.textColor} leading-relaxed`}>{result.insight}</p>
                </div>

                {/* Pillar breakdown */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-base font-black text-slate-700">Score Breakdown</h3>
                  <PillarBar label="💰 Affordability" score={result.affordabilityScore} color="#06b6d4" />
                  <PillarBar label="🎯 Value & Alignment" score={result.valueScore} color="#8b5cf6" />
                  <PillarBar label="🏁 Goal Impact" score={result.goalScore} color="#10b981" />
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-white rounded-xl border border-slate-100 p-3">
                    <p className="text-xs text-slate-500 font-medium">Monthly Disposable</p>
                    <p className="text-base font-black text-slate-800">{formatCurrency(result.disposableIncome)}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-100 p-3">
                    <p className="text-xs text-slate-500 font-medium">Debt-to-Income</p>
                    <p className="text-base font-black text-slate-800">{(result.dti * 100).toFixed(0)}%</p>
                  </div>
                  {result.delayMonths > 0 && (
                    <div className="bg-white rounded-xl border border-slate-100 p-3 col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-500 font-medium">Goal Delay</p>
                      <p className="text-base font-black text-slate-800">
                        ~{result.delayMonths} month{result.delayMonths !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial profile */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-slate-700">
                        Financial Profile: {result.profileLabel}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{result.profileDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Waitlist CTA */}
                <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-cyan-50 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    <h3 className="text-lg font-black text-slate-800">This is just the preview.</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    The full Viluva AI connects to your bank, learns your spending patterns, and gives you a real-time Smart Score on every purchase — right when you need it, before you tap &quot;Buy.&quot;
                  </p>

                  <ul className="space-y-2 mb-5">
                    {[
                      "Live bank-connected Smart Score (via Setu)",
                      "Personalised spending pattern analysis",
                      "Alternative product suggestions",
                      "Goal tracking & financial health dashboard",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <form onSubmit={handleWaitlist} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={emailStatus === "loading" || emailStatus === "success"}
                      className="w-full px-4 py-3 rounded-xl border-2 border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={emailStatus === "loading" || emailStatus === "success"}
                      className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-black py-3.5 rounded-xl hover:from-violet-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emailStatus === "loading"
                        ? "Joining..."
                        : emailStatus === "success"
                          ? "You're on the list ✓"
                          : "Join Waitlist — Get Early Access"}
                    </button>
                  </form>

                  {emailMessage && (
                    <p className={`mt-3 text-sm font-medium ${emailStatus === "success" ? "text-emerald-600" : "text-red-600"}`}>
                      {emailMessage}
                    </p>
                  )}
                </div>

                {/* Reset */}
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Score a different purchase
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
