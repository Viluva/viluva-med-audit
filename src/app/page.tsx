"use client";

import HomePageNavigation from "@/components/HomePageNavigation";
import ToolsFooter from "@/components/ToolsFooter";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  investmentCalculatorHub,
  investmentCalculators,
  retirementCalculators,
  utilityTools,
} from "@/lib/siteLinks";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

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

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: "AI-Powered Clarity",
      description:
        "Our proprietary AI analyzes any potential purchase against your unique financial situation and gives you an instant, unbiased 'Smart Score'.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Peer-Driven Context",
      description:
        "Confidentially benchmark your decisions against thousands of anonymous people just like you—in your city, in your income bracket—to answer that critical question, 'Is this normal?'",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.5-4.5M12 14a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      ),
      title: "Community-Powered Confidence",
      description:
        "See the real, anonymized experiences and decisions of others, giving you the social proof you need to feel certain about your choice.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const calculatorSections = [
    {
      title: "Retirement Calculators",
      href: retirementCalculators[0]?.href || "/fire-calculator",
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

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24">
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
            <span className="text-sm font-bold text-cyan-700">Coming Soon</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            From Financial Anxiety to Confident Decisions.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Most financial apps are rearview mirrors, showing you what you have
            already spent. Viluva is your windshield, a proactive financial
            co-pilot helping you make smart decisions for the future.
          </p>

          {/* Email Signup Form */}
          <div className="max-w-lg mx-auto">
            <form
              onSubmit={handleSubmit}
              className="glass p-6 sm:p-8 rounded-2xl shadow-xl"
            >
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
                Join the Waitlist
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Be the first to know when we launch. Get early access and
                exclusive features.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading" || status === "success"}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                >
                  {status === "loading"
                    ? "Joining..."
                    : status === "success"
                      ? "Joined!"
                      : "Join Waitlist"}
                </button>
              </div>

              {message && (
                <p
                  className={`mt-4 text-sm font-medium ${status === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            How Viluva Works
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Vuluva combines three powerful layers of intelligence to turn
            financial anxiety into confident decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
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
                      <p className="font-bold text-slate-800 text-sm">
                        {link.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {link.description}
                      </p>
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
        </div>

        {/* Footer is now included in <ToolsFooter /> */}
      </div>
    </main>
  );
}
