"use client";

import HomePageNavigation from "@/components/HomePageNavigation";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, animate } from "framer-motion";
import {
  investmentCalculatorHub,
  investmentCalculators,
  retirementCalculatorHub,
  retirementCalculators,
  utilityTools,
  decisionTools,
} from "@/lib/siteLinks";
import { calculateFinancialVelocityScore } from "@/lib/financialVelocity";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Gauge,
  IndianRupee,
  CheckCircle2,
  Zap,
} from "lucide-react";

function CountUpNumber({ value, duration = 0.9 }: { value: number; duration?: number }) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, duration, motionVal]);

  return <>{display}</>;
}

type VelocityPersona = {
  name: string;
  summary: string;
  badgeClasses: string;
};

const getVelocityPersona = (score: number): VelocityPersona => {
  if (score <= 40) {
    return {
      name: "Stalled Voyager",
      summary: "Debt and spending leaks are outrunning your savings rate right now.",
      badgeClasses: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }
  if (score <= 70) {
    return {
      name: "Steady Cruiser",
      summary: "You're making progress, with room to tighten leaks and build runway.",
      badgeClasses: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    name: "Wealth Accelerator",
    summary: "Your habits are compounding in your favor. Keep the momentum going.",
    badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Always free", detail: "Every calculator, no paywall." },
  { icon: Lock, label: "Privacy-first", detail: "Your numbers stay in your browser." },
  { icon: IndianRupee, label: "Built for India", detail: "Lakhs, crores, and INR by default." },
  { icon: CheckCircle2, label: "Open math", detail: "Every assumption shown, nothing hidden." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [velocityInputs, setVelocityInputs] = useState({
    drag: 35,
    fuel: 22,
    runway: 4,
    leak: 3,
  });
  const [showVelocityResult, setShowVelocityResult] = useState(false);

  const velocityResult = useMemo(
    () => calculateFinancialVelocityScore(velocityInputs),
    [velocityInputs],
  );
  const persona = useMemo(
    () => getVelocityPersona(velocityResult.normalizedScore),
    [velocityResult.normalizedScore],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("You're on the list. We'll email you when new tools launch.");
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
      description: "Model FIRE timelines, semi-retirement scenarios, and target corpus.",
      links: retirementCalculators,
      accent: "text-orange-600",
      dot: "bg-orange-500",
    },
    {
      title: investmentCalculatorHub.name,
      href: investmentCalculatorHub.href,
      description: "Plan SIPs, lumpsum investing, blended strategies, and withdrawals.",
      links: investmentCalculators,
      accent: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    {
      title: "Money Tools",
      href: decisionTools[0]?.href || "/smart-score",
      description: "Everyday decisions — purchases, EMIs, loans, and true costs.",
      links: [...decisionTools, ...utilityTools],
      accent: "text-violet-600",
      dot: "bg-violet-500",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <HomePageNavigation />

      <section className="w-full relative">
        <div className="absolute inset-x-0 top-0 h-[620px] hero-mesh pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-[620px] dot-grid noise-fade opacity-30 pointer-events-none" aria-hidden="true" />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-5xl mx-auto relative z-10 px-4 sm:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14 text-center"
        >
          <motion.div variants={item} className="badge mb-5 inline-flex bg-white shadow-sm">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            </motion.span>
            <span className="text-indigo-700">Personal finance, without the guesswork</span>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.02]">
            Know the real worth
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              before you decide
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
            Retirement, investing, loans, and everyday spending — clear calculators
            and honest breakdowns that show you the impact before you commit, not the damage after.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
            <Link href="#explore" className="btn-primary px-7 py-3.5 text-base">
              Explore Calculators
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/smart-score" className="btn-secondary px-7 py-3.5 text-base">
              Try Smart Purchase Advisor
            </Link>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 max-w-3xl mx-auto">
            {TRUST_ITEMS.map((trustItem) => (
              <motion.div
                key={trustItem.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="card p-4 text-left"
              >
                <trustItem.icon className="w-4 h-4 text-indigo-600 mb-2" />
                <p className="text-sm font-bold text-slate-800">{trustItem.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{trustItem.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8">
        <section id="explore" className="mb-12 sm:mb-16">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Explore the tools</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Every calculator runs instantly in your browser — no account, no hidden steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {calculatorSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-1.5 h-1.5 rounded-full ${section.dot}`} />
                  <h3 className={`text-sm font-black uppercase tracking-wide ${section.accent}`}>
                    {section.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">
                  {section.description}
                </p>
                <div className="space-y-2 mb-5">
                  {section.links.slice(0, 4).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                    >
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{link.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{link.description}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {section.links.length > 4 ? `View all ${section.links.length}` : "View all"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <div className="card p-6 sm:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div {...fadeUp}>
                <div className="badge mb-4">
                  <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                  <span>60-second check</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                  How fast is your money moving?
                </h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  Four sliders. No sign-up. See instantly whether your habits are
                  building wealth or quietly leaking it.
                </p>

                <div className="space-y-5">
                  <SliderRow
                    label="Debt & EMIs (% of income)"
                    value={velocityInputs.drag}
                    onChange={(v) => {
                      setVelocityInputs((p) => ({ ...p, drag: v }));
                      setShowVelocityResult(false);
                    }}
                    min={0}
                    max={100}
                  />
                  <SliderRow
                    label="Savings & investing (% of income)"
                    value={velocityInputs.fuel}
                    onChange={(v) => {
                      setVelocityInputs((p) => ({ ...p, fuel: v }));
                      setShowVelocityResult(false);
                    }}
                    min={0}
                    max={100}
                  />
                  <SliderRow
                    label="Emergency runway (months)"
                    value={velocityInputs.runway}
                    onChange={(v) => {
                      setVelocityInputs((p) => ({ ...p, runway: v }));
                      setShowVelocityResult(false);
                    }}
                    min={0}
                    max={24}
                    display={velocityInputs.runway === 24 ? "24+" : `${velocityInputs.runway}`}
                  />
                  <SliderRow
                    label="Unplanned purchases (> ₹4,000/mo)"
                    value={velocityInputs.leak}
                    onChange={(v) => {
                      setVelocityInputs((p) => ({ ...p, leak: v }));
                      setShowVelocityResult(false);
                    }}
                    min={0}
                    max={10}
                    display={velocityInputs.leak === 10 ? "10+" : `${velocityInputs.leak}`}
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowVelocityResult(true)}
                  className="btn-primary w-full mt-7 py-3.5"
                >
                  <Zap className="w-4 h-4" />
                  See My Score
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4 }}
                className="card-inset p-6 sm:p-8 text-center"
              >
                {showVelocityResult ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">
                      Your Money Momentum Score
                    </p>
                    <div className="relative w-40 h-40 mx-auto mb-5">
                      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                        <circle cx="90" cy="90" r="74" stroke="#e2e8f0" strokeWidth="14" fill="none" />
                        <motion.circle
                          cx="90"
                          cy="90"
                          r="74"
                          stroke="#4f46e5"
                          strokeWidth="14"
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 74}
                          initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 74 - (velocityResult.normalizedScore / 100) * 2 * Math.PI * 74,
                          }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900">
                          <CountUpNumber value={velocityResult.normalizedScore} />
                        </span>
                        <span className="text-xs font-bold text-slate-400">out of 100</span>
                      </div>
                    </div>
                    <div className={`inline-flex px-3.5 py-1.5 rounded-full border font-bold text-sm mb-3 ${persona.badgeClasses}`}>
                      {persona.name}
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">{persona.summary}</p>

                    <a
                      href="#waitlist"
                      className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Want month-over-month tracking? Join early access
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10">
                    <Gauge className="w-10 h-10 text-slate-300 mb-4" />
                    <p className="text-sm text-slate-400 max-w-[220px]">
                      Adjust the sliders and hit &ldquo;See My Score&rdquo; to get your result.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="waitlist" className="mb-14 scroll-mt-24">
          <motion.div
            {...fadeUp}
            className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl font-black text-white relative z-10">
              Building the full picture of your finances
            </h2>
            <p className="text-slate-300 mt-3 max-w-lg mx-auto relative z-10">
              More calculators, guides, and tracking tools are on the way. Join
              early access to hear about them first.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 max-w-md mx-auto relative z-10"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading" || status === "success"}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/95 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 text-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-60 whitespace-nowrap"
                >
                  {status === "loading" ? "Joining…" : status === "success" ? "Joined!" : "Join Early Access"}
                  {status !== "loading" && status !== "success" && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {message && (
                <p
                  className={`mt-3 text-sm font-medium ${status === "success" ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {message}
                </p>
              )}
            </form>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  display,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  display?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-black text-slate-900">{display ?? `${value}%`}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );
}
