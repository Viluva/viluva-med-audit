"use client";

import HomePageNavigation from "@/components/HomePageNavigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    } catch (error) {
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Budget Tracker",
      description:
        "Take control of your spending with intelligent budget tracking. Monitor your expenses in real-time and stay on top of your financial goals.",
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "Financial Insights",
      description:
        "Receive automated, data-driven insights into your financial habits. Your personal AI advisor helps you make smarter money decisions.",
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Peer Comparison",
      description:
        "See how you stack up against anonymized peers in your income bracket. Gamified insights that motivate better financial habits.",
      color: "from-green-500 to-emerald-500",
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Spending Advisor",
      description:
        "Get actionable advice to save money on everyday purchases. Real-world impact on your finances with personalized recommendations.",
      color: "from-orange-500 to-red-500",
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
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
      title: "Social Feed",
      description:
        "Join a community of financially savvy individuals. Share insights, learn from others, and grow together in your financial journey.",
      color: "from-indigo-500 to-purple-500",
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

      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 sm:px-8 py-12 sm:py-20">
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

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Your Financial Companion
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            We are building a comprehensive suite of tools to help you master
            your finances. Track, analyze, and optimize your spending with
            intelligent insights.
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
            Launching Soon
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            These powerful features will be available once we launch
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

        {/* Current Tools CTA */}
        <div className="glass p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Try Our Available Tools
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            While we build the complete suite, explore our existing tools to
            start your financial journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cghs-billcheck"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              CGHS BillCheck
            </Link>
            <Link
              href="/time-converter"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all border-2 border-slate-200 hover:border-cyan-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              True Cost Calculator
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center space-y-2">
          <p className="text-sm text-slate-500 font-medium">
            © 2026 Viluva. Building tools for smarter financial decisions.
          </p>
        </footer>
      </div>
    </main>
  );
}
