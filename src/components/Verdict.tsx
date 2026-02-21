"use client";
import React, { useState } from "react";
import { Price, Hospital } from "@/lib/data/types";

export default function Verdict({
  procedure,
  hospital,
  wardType,
  onReset,
}: {
  procedure: Price;
  hospital: Hospital;
  wardType: string;
  onReset: () => void;
}) {
  const [userPrice, setUserPrice] = useState("");

  const calculateAuditPrice = () => {
    let rate = hospital.accreditation.toUpperCase().includes("NABH")
      ? parseFloat(procedure.nabhRate.toString())
      : parseFloat(procedure.nonNabhRate.toString());

    // Super Speciality Check
    if (
      hospital.hospital_name.toLowerCase().includes("super speciality") &&
      hospital.accreditation.includes("NABH")
    ) {
      rate *= 1.15;
    }

    // City Tier Adjustment
    if (hospital.tier_type.includes("2")) rate *= 0.9;
    if (hospital.tier_type.includes("3")) rate *= 0.8;

    // Ward Multiplier (Excluded for Investigations/Consults)
    const isUniform = [
      "consultation",
      "investigation",
      "diagnostic",
      "radiotherapy",
    ].some((c) => procedure.name.toLowerCase().includes(c));
    if (!isUniform) {
      if (wardType === "General") rate *= 0.95;
      if (wardType === "Private") rate *= 1.05;
    }
    return Math.round(rate);
  };

  const auditPrice = calculateAuditPrice();
  const diff = userPrice ? parseFloat(userPrice) - auditPrice : 0;
  const isOvercharged = diff > 0;

  return (
    <div className="animate-in zoom-in-95 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-7 rounded-3xl text-white shadow-2xl border border-slate-700">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-cyan-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Compliance Audit Report
            </p>
          </div>
          <h3 className="text-2xl font-black mb-2">{procedure.name}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-semibold">{hospital.hospital_name}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
            <svg
              className="w-3 h-3 text-emerald-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-bold">{wardType} Ward</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
            />
          </svg>
          Enter Hospital Bill Amount
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-50 transition-opacity"></div>
          <div className="relative">
            <span className="absolute left-7 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-500 group-focus-within:text-cyan-600 transition-colors">
              ₹
            </span>
            <input
              type="number"
              value={userPrice}
              onChange={(e) => setUserPrice(e.target.value)}
              className="w-full text-4xl font-black p-5 pl-16 rounded-2xl bg-white border-3 border-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all shadow-lg"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {userPrice && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div
            className={`relative overflow-hidden p-7 rounded-3xl border-3 shadow-2xl ${
              isOvercharged
                ? "bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 border-red-300"
                : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-300"
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl ${
                isOvercharged ? "bg-red-400/20" : "bg-emerald-400/20"
              }`}
            ></div>

            <div className="relative space-y-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className={`w-5 h-5 ${isOvercharged ? "text-red-600" : "text-emerald-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-700">
                      CGHS Approved Rate
                    </p>
                  </div>
                  <p className="text-4xl font-black text-slate-900">
                    ₹{auditPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    Legally Capped Maximum
                  </p>
                </div>
                {isOvercharged && (
                  <div className="text-right bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-red-200 shadow-lg">
                    <p className="text-xs font-black uppercase text-red-600 mb-1 flex items-center gap-1 justify-end">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Overcharge Detected
                    </p>
                    <p className="text-3xl font-black text-red-700">
                      ₹{Math.abs(diff).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>

              {!isOvercharged && (
                <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-full">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-black text-emerald-900 text-lg">
                        Bill is Compliant ✓
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold">
                        Hospital charges are within CGHS guidelines
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isOvercharged && (
                <div className="space-y-3">
                  <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-xs font-black text-amber-900 uppercase mb-1">
                          Violation Notice
                        </p>
                        <p className="text-sm text-amber-800 font-semibold leading-snug">
                          This charge exceeds CGHS-approved rates by{" "}
                          <span className="font-black">
                            ₹{Math.abs(diff).toLocaleString("en-IN")}
                          </span>
                          . You may be entitled to a refund under MoHFW
                          guidelines.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <button className="relative w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-black py-5 rounded-2xl shadow-2xl hover:from-red-700 hover:to-orange-700 transform hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-lg">Generate Legal Notice</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        ₹9
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full text-slate-500 text-sm font-bold hover:text-cyan-600 hover:underline transition-colors flex items-center justify-center gap-2 py-3"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Audit Another Procedure</span>
      </button>

      {/* Additional Trust Signal */}
      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-start gap-3 text-xs text-slate-600">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="leading-relaxed">
            <strong className="text-slate-800">Note:</strong> This audit uses
            the official CGHS rate calculation formula including tier
            adjustments, accreditation multipliers, and ward differentials.
            Results are for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
