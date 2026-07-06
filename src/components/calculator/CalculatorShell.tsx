"use client";

import type { ChangeEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import HomePageNavigation from "@/components/HomePageNavigation";

export { formatCurrency, formatCompactCurrency } from "@/lib/currency";

export type CalculatorAccent =
  | "retirement"
  | "investment"
  | "decision"
  | "utility";

export const ACCENTS: Record<
  CalculatorAccent,
  {
    text: string;
    bg: string;
    border: string;
    solid: string;
    gradient: string;
    accentClass: string;
    ring: string;
  }
> = {
  retirement: {
    text: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    solid: "#ea580c",
    gradient: "from-orange-600 to-amber-500",
    accentClass: "accent-orange-600",
    ring: "focus:ring-orange-100 focus:border-orange-500",
  },
  investment: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    solid: "#059669",
    gradient: "from-emerald-600 to-teal-500",
    accentClass: "accent-emerald-600",
    ring: "focus:ring-emerald-100 focus:border-emerald-500",
  },
  decision: {
    text: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    solid: "#7c3aed",
    gradient: "from-violet-600 to-purple-500",
    accentClass: "accent-violet-600",
    ring: "focus:ring-violet-100 focus:border-violet-500",
  },
  utility: {
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    solid: "#0284c7",
    gradient: "from-sky-600 to-blue-500",
    accentClass: "accent-sky-600",
    ring: "focus:ring-sky-100 focus:border-sky-500",
  },
};

interface CalculatorShellProps {
  title: string;
  description: string;
  badgeText: string;
  badgeIcon: LucideIcon;
  accent: CalculatorAccent;
  assumptions?: string[];
  maxWidthClass?: string;
  children: ReactNode;
}

export function CalculatorShell({
  title,
  description,
  badgeText,
  badgeIcon: BadgeIcon,
  accent,
  assumptions,
  maxWidthClass = "max-w-4xl",
  children,
}: CalculatorShellProps) {
  const a = ACCENTS[accent];

  return (
    <main className="flex min-h-screen flex-col items-center font-sans text-slate-900 relative">
      <div
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none dot-grid noise-fade opacity-40"
        aria-hidden="true"
      />

      <HomePageNavigation />

      <div
        className={`w-full ${maxWidthClass} mx-auto relative z-10 px-4 sm:px-8 pt-10 sm:pt-14 pb-12`}
      >
        <header className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border ${a.bg} ${a.border} mb-4`}
          >
            <BadgeIcon className={`w-3.5 h-3.5 ${a.text}`} />
            <span
              className={`text-[10px] sm:text-xs font-black uppercase tracking-wide ${a.text}`}
            >
              {badgeText}
            </span>
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${a.gradient} mb-3`}
          >
            {title}
          </h1>
          <p className="text-slate-600 font-medium text-base max-w-2xl px-2">
            {description}
          </p>
        </header>

        {children}
      </div>

      {assumptions?.length ? (
        <section className={`w-full ${maxWidthClass} mx-auto relative z-10 px-4 sm:px-8 pb-8`}>
          <div className="card p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-black text-slate-900 mb-2">
              Calculation Assumptions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              Results can differ across apps when compounding or contribution
              timing assumptions change.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
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

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
}

export function NumberField({
  label,
  name,
  value,
  onChange,
  hint,
  min,
  max,
  step = 1,
  prefix,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm sm:text-base font-bold text-slate-800 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
            {prefix}
          </span>
        ) : null}
        <input
          id={name}
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={`input-field ${prefix ? "pl-8" : ""}`}
        />
      </div>
      {hint ? <p className="text-xs text-slate-400 mt-1.5">{hint}</p> : null}
    </div>
  );
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
  accent: CalculatorAccent;
  hint?: string;
  suffix?: string;
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
  accent,
  hint,
  suffix = "% p.a.",
}: SliderFieldProps) {
  const a = ACCENTS[accent];
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
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${a.accentClass}`}
      />
      <div className="flex justify-between text-xs mt-1.5">
        <span className="text-slate-400">{leftLabel}</span>
        <span className="font-bold text-slate-700">
          {value}
          {suffix}
        </span>
        <span className="text-slate-400">{rightLabel}</span>
      </div>
      {hint ? <p className="text-xs text-slate-400 mt-1.5">{hint}</p> : null}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  subtext?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}

const TONE_ICON_BG: Record<NonNullable<StatCardProps["tone"]>, string> = {
  neutral: "bg-slate-100",
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  danger: "bg-rose-50",
};

export function StatCard({ label, value, icon, subtext, tone = "neutral" }: StatCardProps) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-3">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${TONE_ICON_BG[tone]}`}
        >
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-900">
        {value}
      </p>
      {subtext ? (
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{subtext}</p>
      ) : null}
    </div>
  );
}

interface ResultHeroProps {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  accent: CalculatorAccent;
}

export function ResultHero({ icon, label, value, detail, accent }: ResultHeroProps) {
  const a = ACCENTS[accent];
  return (
    <div className={`bg-gradient-to-br ${a.gradient} text-white rounded-2xl shadow-lg p-6`}>
      <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
        {icon}
        {label}
      </div>
      <p className="text-4xl sm:text-5xl font-black tracking-tight">{value}</p>
      <p className="text-sm text-white/80 mt-2">{detail}</p>
    </div>
  );
}

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accent: CalculatorAccent;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accent,
}: SegmentedControlProps<T>) {
  const a = ACCENTS[accent];
  return (
    <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            value === option.value
              ? `bg-gradient-to-r ${a.gradient} text-white shadow-sm`
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
