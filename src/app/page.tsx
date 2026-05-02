"use client";

import HomePageNavigation from "@/components/HomePageNavigation";
import ToolsFooter from "@/components/ToolsFooter";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import {
  investmentCalculatorHub,
  investmentCalculators,
  retirementCalculatorHub,
  retirementCalculators,
  utilityTools,
} from "@/lib/siteLinks";
import { calculateFinancialVelocityScore } from "@/lib/financialVelocity";

type AuditStep = 0 | 1 | 2 | 3;

type VelocityPersona = {
  name: string;
  range: string;
  badgeClasses: string;
  glowClasses: string;
};

const getVelocityPersona = (score: number): VelocityPersona => {
  if (score <= 40) {
    return {
      name: "Stalled Voyager",
      range: "0-40",
      badgeClasses: "from-red-500 to-orange-500 text-white",
      glowClasses: "shadow-orange-500/30",
    };
  }

  if (score <= 70) {
    return {
      name: "Steady Cruiser",
      range: "41-70",
      badgeClasses: "from-yellow-400 to-blue-500 text-slate-900",
      glowClasses: "shadow-blue-500/30",
    };
  }

  return {
    name: "Wealth Accelerator",
    range: "71-100",
    badgeClasses: "from-emerald-400 to-lime-400 text-slate-900",
    glowClasses: "shadow-emerald-500/35",
  };
};

const stepAnimation = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const [auditStep, setAuditStep] = useState<AuditStep>(0);
  const [auditInputs, setAuditInputs] = useState({
    drag: 35,
    fuel: 22,
    runway: 4,
    leak: 3,
  });

  const auditResult = useMemo(
    () => calculateFinancialVelocityScore(auditInputs),
    [auditInputs],
  );

  const persona = useMemo(
    () => getVelocityPersona(auditResult.normalizedScore),
    [auditResult.normalizedScore],
  );

  const displayedScore = useMotionValue(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const unsubscribe = displayedScore.on("change", (latest) => {
      setAnimatedScore(Math.round(latest));
    });

    return () => unsubscribe();
  }, [displayedScore]);

  useEffect(() => {
    if (auditStep !== 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      setAuditStep(3);
    }, 850);

    return () => window.clearTimeout(timer);
  }, [auditStep]);

  useEffect(() => {
    if (auditStep !== 3) {
      displayedScore.set(0);
      return;
    }

    const controls = animate(displayedScore, auditResult.normalizedScore, {
      duration: 1.2,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [auditStep, auditResult.normalizedScore, displayedScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thanks for joining! We'll notify you when we launch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const calculatorSections = [
    {
      title: "Retirement Calculators",
      href: retirementCalculatorHub.href,
      description:
        "Model FIRE timelines, semi-retirement scenarios, and target retirement corpus options.",
      links: retirementCalculators,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: investmentCalculatorHub.name,
      href: investmentCalculatorHub.href,
      description:
        "Plan SIPs, one-time investments, blended strategies, and retirement withdrawals.",
      links: investmentCalculators,
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "Utility Tools",
      href: utilityTools[0]?.href || "/cghs-billcheck",
      description:
        "Use focused tools for medical bill audits and the opportunity cost of spending decisions.",
      links: utilityTools,
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const gaugeRadius = 74;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset =
    gaugeCircumference - (animatedScore / 100) * gaugeCircumference;

  const userBarWidth = `${Math.max(animatedScore, 6)}%`;
  const cityAverage = 52;

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-6 sm:py-10">
        <section className="mb-14 sm:mb-20">
          <AnimatePresence mode="wait">
            {auditStep === 0 && (
              <motion.div key="audit-step-0" {...stepAnimation} className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-6">
                  <svg
                    className="w-4 h-4 text-cyan-600 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-bold text-cyan-700">Money Momentum Check</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  How Fast Is Your Money Moving?
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                  In just 30 seconds, see if your money habits are helping you move forward or quietly holding you back.
                </p>

                <button
                  onClick={() => setAuditStep(1)}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start My 30-Second Check
                </button>
              </motion.div>
            )}

            {auditStep === 1 && (
              <motion.div key="audit-step-1" {...stepAnimation} className="max-w-3xl mx-auto">
                <div className="glass p-6 sm:p-8 rounded-3xl shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Quick Money Check</h2>
                      <p className="text-sm sm:text-base text-slate-600 mt-2">
                        Move the sliders to match your real monthly life.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-cyan-700 bg-cyan-100 border border-cyan-200 rounded-full px-3 py-1.5">
                      4 quick questions
                    </div>
                  </div>

                  <div className="space-y-7">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="drag" className="font-bold text-slate-800">
                          Drag: What % of your income goes to loans/EMIs?
                        </label>
                        <span className="font-black text-slate-700">{auditInputs.drag}%</span>
                      </div>
                      <input
                        id="drag"
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={auditInputs.drag}
                        onChange={(e) =>
                          setAuditInputs((prev) => ({ ...prev, drag: Number(e.target.value) }))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="fuel" className="font-bold text-slate-800">
                          Fuel: What % of your income goes into savings/investments?
                        </label>
                        <span className="font-black text-slate-700">{auditInputs.fuel}%</span>
                      </div>
                      <input
                        id="fuel"
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={auditInputs.fuel}
                        onChange={(e) =>
                          setAuditInputs((prev) => ({ ...prev, fuel: Number(e.target.value) }))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="runway" className="font-bold text-slate-800">
                          Runway: If income stopped today, how many months could you manage?
                        </label>
                        <span className="font-black text-slate-700">
                          {auditInputs.runway === 24 ? "24+" : auditInputs.runway}
                        </span>
                      </div>
                      <input
                        id="runway"
                        type="range"
                        min={0}
                        max={24}
                        step={1}
                        value={auditInputs.runway}
                        onChange={(e) =>
                          setAuditInputs((prev) => ({ ...prev, runway: Number(e.target.value) }))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="leak" className="font-bold text-slate-800">
                          Leak: How many unplanned purchases (&gt; $50) do you make monthly?
                        </label>
                        <span className="font-black text-slate-700">
                          {auditInputs.leak === 10 ? "10+" : auditInputs.leak}
                        </span>
                      </div>
                      <input
                        id="leak"
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={auditInputs.leak}
                        onChange={(e) =>
                          setAuditInputs((prev) => ({ ...prev, leak: Number(e.target.value) }))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <button
                      onClick={() => setAuditStep(0)}
                      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setMessage("");
                        setAuditStep(2);
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      Show My Score
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {auditStep === 2 && (
              <motion.div key="audit-step-2" {...stepAnimation} className="max-w-xl mx-auto text-center">
                <div className="glass rounded-3xl p-10 shadow-xl">
                  <motion.div
                    className="inline-flex w-14 h-14 rounded-full border-4 border-cyan-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-2xl font-black text-slate-800 mt-5">Calculating Your Score</h3>
                  <p className="text-slate-600 mt-2">Give us a second while we turn your answers into a clear money snapshot.</p>
                </div>
              </motion.div>
            )}

            {auditStep === 3 && (
              <motion.div key="audit-step-3" {...stepAnimation} className="max-w-4xl mx-auto">
                <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 font-bold mb-3">Your Money Momentum Score</p>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-800">{persona.name}</h2>
                      <p className="text-slate-600 mt-3 max-w-xl">
                        This score shows how your current habits are helping your money grow or slowing it down.
                      </p>
                      <div
                        className={`inline-flex mt-5 px-4 py-2 rounded-full bg-gradient-to-r ${persona.badgeClasses} font-bold shadow-lg ${persona.glowClasses}`}
                      >
                        Your range: {persona.range}
                      </div>
                    </div>

                    <div className="relative w-52 h-52 mx-auto md:mx-0">
                      <svg viewBox="0 0 180 180" className="w-full h-full">
                        <circle
                          cx="90"
                          cy="90"
                          r={gaugeRadius}
                          stroke="#e2e8f0"
                          strokeWidth="14"
                          fill="none"
                        />
                        <circle
                          cx="90"
                          cy="90"
                          r={gaugeRadius}
                          stroke="url(#velocityGradient)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={gaugeCircumference}
                          strokeDashoffset={gaugeOffset}
                          transform="rotate(-90 90 90)"
                        />
                        <defs>
                          <linearGradient id="velocityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#2563eb" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-slate-800">{animatedScore}</span>
                        <span className="text-sm font-bold text-slate-500">out of 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-xl font-black text-slate-800 mb-4">How You Compare</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                          <span>Your Score</span>
                          <span>{animatedScore}</span>
                        </div>
                        <div className="h-4 rounded-full bg-slate-200 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: userBarWidth }}
                            transition={{ duration: 1.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                          <span>City Average</span>
                          <span>{cityAverage}</span>
                        </div>
                        <div className="h-4 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-slate-400 to-slate-600"
                            style={{ width: `${cityAverage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
                    <h3 className="text-2xl font-black text-slate-800 mb-3">Locked Insights</h3>
                    <p className="text-slate-600 mb-5">
                      Most people stop at this score. Don&apos;t. Unlock the full report to see exactly where you are losing money and what to fix first.
                    </p>

                    <ul className="space-y-3 mb-6">
                      {["Your Smart Score Breakdown", "City Spending Reality Check", "Hidden Cost Finder"].map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-white"
                        >
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white">
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M7 11V8a5 5 0 0110 0v3" strokeLinecap="round" strokeLinejoin="round" />
                              <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                            </svg>
                          </span>
                          <span className="font-semibold text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <form onSubmit={handleSubmit} className="space-y-3" id="waitlist">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "loading" || status === "success"}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-base sm:text-lg px-6 py-4 rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === "loading"
                          ? "Joining..."
                          : status === "success"
                            ? "Joined!"
                            : "Join Waitlist to Unlock Full Report"}
                      </button>
                    </form>

                    {message && (
                      <p
                        className={`mt-4 text-sm font-medium ${status === "success" ? "text-green-600" : "text-red-600"}`}
                      >
                        {message}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setMessage("");
                        setAuditStep(1);
                      }}
                      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Adjust Inputs
                    </button>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setMessage("");
                        setAuditStep(0);
                      }}
                      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Restart Audit
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Takes less than 30 seconds, and can save you from years of slow money decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center font-black mb-4">
                1
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Answer 4 Simple Questions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No forms, no math. Just quick sliders about debt, savings, safety cushion, and spending habits.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black mb-4">
                2
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Get Your Score Instantly</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                You immediately see where you stand on a simple 0-100 scale, plus how you compare with your city average.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 text-white flex items-center justify-center font-black mb-4">
                3
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Unlock What Others Miss</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Join the waitlist to unlock deeper insights most people never see until it is too late.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Explore Calculators
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Browse retirement, investment, and decision tools built to turn
            abstract money choices into concrete numbers.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {calculatorSections.map((section) => (
              <div
                key={section.title}
                className="glass p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`inline-flex px-3 py-1.5 rounded-full text-white text-xs font-bold bg-gradient-to-r ${section.gradient} mb-4`}
                >
                  {section.title}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {section.description}
                </p>
                <div className="space-y-3 mb-5">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block bg-white rounded-2xl border border-slate-100 p-4 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all"
                    >
                      <p className="font-bold text-slate-800 text-sm">{link.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{link.description}</p>
                    </Link>
                  ))}
                </div>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
                >
                  Explore {section.title}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* <ToolsFooter /> */}
    </main>
  );
}
