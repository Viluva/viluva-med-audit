"use client";

import type { ChangeEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";

interface InvestmentPageShellProps {
  title: string;
  description: string;
  badgeText: string;
  badgeIcon: LucideIcon;
  titleGradientClass: string;
  badgeBackgroundClass: string;
  badgeBorderClass: string;
  badgeTextClass: string;
  backgroundBlobClasses: [string, string];
  assumptions?: string[];
  children: ReactNode;
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint: string;
  min?: number;
  max?: number;
  step?: number;
}

interface SliderFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  leftLabel: string;
  rightLabel: string;
  accentClass: string;
  hint: string;
  suffix?: string;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  subtext?: string;
}

export { formatCurrency, formatCompactCurrency } from "@/lib/currency";

export function InvestmentPageShell({
  title,
  description,
  badgeText,
  badgeIcon: BadgeIcon,
  titleGradientClass,
  badgeBackgroundClass,
  badgeBorderClass,
  badgeTextClass,
  backgroundBlobClasses,
  assumptions,
  children,
}: InvestmentPageShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${backgroundBlobClasses[0]}`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${backgroundBlobClasses[1]}`}
        />
      </div>

      <HomePageNavigation />

      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8 pb-12">
        <header className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <br />
          <h1
            className={`text-3xl font-black tracking-tight bg-clip-text text-transparent mb-3 ${titleGradientClass}`}
          >
            {title}
          </h1>
          <p className="text-slate-600 font-semibold text-base mt-1 max-w-2xl px-4">
            {description}
          </p>
          <div
            className={`flex items-center gap-2 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border ${badgeBackgroundClass} ${badgeBorderClass}`}
          >
            <BadgeIcon className={`w-4 h-4 ${badgeTextClass}`} />
            <span
              className={`text-[10px] sm:text-xs font-black uppercase tracking-wide ${badgeTextClass}`}
            >
              {badgeText}
            </span>
          </div>
        </header>

        {children}
      </div>

      {assumptions?.length ? (
        <section className="w-full max-w-4xl mx-auto relative z-10 px-4 sm:px-8 pb-8">
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 mb-2">
              Calculation Assumptions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-3">
              Results can differ across apps when compounding or contribution
              timing assumptions change.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              {assumptions.map((assumption, index) => (
                <li key={`${assumption}-${index}`}>{assumption}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  hint,
  min,
  max,
  step = 1,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm sm:text-base font-bold text-slate-800 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white"
      />
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  );
}

export function SliderField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  leftLabel,
  rightLabel,
  accentClass,
  hint,
  suffix = "% p.a.",
}: SliderFieldProps) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
        {label}
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${accentClass}`}
      />
      <div className="flex justify-between text-xs mt-1">
        <span className="text-slate-400">{leftLabel}</span>
        <span className="font-bold text-slate-700">
          {value}
          {suffix}
        </span>
        <span className="text-slate-400">{rightLabel}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  );
}

export function StatCard({ label, value, icon, subtext }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-900">
        {value}
      </p>
      {subtext ? (
        <p className="text-xs text-slate-500 mt-2">{subtext}</p>
      ) : null}
    </div>
  );
}
