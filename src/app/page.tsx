"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import CitySelect from "@/components/CitySelect";
import HospitalSelect from "@/components/HospitalSelect";
import ProcedureSearch from "@/components/ProcedureSearch";
import Verdict from "@/components/Verdict";
import { Hospital, Price } from "@/lib/data/types";
import hospitalsData from "@/lib/data/hospitals.json";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );
  const [selectedProcedure, setSelectedProcedure] = useState<Price | null>(
    null,
  );
  const [wardType, setWardType] = useState<
    "General" | "Semi-Private" | "Private"
  >("Semi-Private");

  const cityHospitals = useMemo(() => {
    if (!selectedCity) return [];
    return (hospitalsData as Hospital[]).filter(
      (h) => h.address === selectedCity,
    );
  }, [selectedCity]);

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedHospital(null);
    setSelectedProcedure(null);
    setWardType("Semi-Private");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 font-sans text-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <header className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/Viluva.png"
              alt="MedClarity Logo"
              width={40}
              height={40}
              priority
              className="drop-shadow-md"
            />
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedClarity
            </h1>
          </div>
          <p className="text-slate-600 font-semibold text-lg mt-1 max-w-md">
            CGHS Price Cap Compliance Validator
          </p>
          <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wide">
              2026 MoHFW Certified
            </span>
          </div>
        </header>

        {/* Trust Badge Bar */}
        <div className="glass px-6 py-4 rounded-2xl mb-6 shadow-lg">
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-bold text-slate-700">
                End-to-End Encrypted
              </span>
            </div>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-bold text-slate-700">No Data Stored</span>
            </div>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
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
              <span className="font-bold text-slate-700">
                Legally Verified/Regulation Compliant (TBD)
              </span>
            </div>
          </div>
        </div>

        <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl glow">
          {/* STEP 1: CITY */}
          {!selectedCity && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm text-white font-black shadow-lg">
                  1
                </span>
                <span className="text-slate-800">
                  Where is the hospital located?
                </span>
              </h2>
              <CitySelect
                hospitals={hospitalsData as Hospital[]}
                onSelect={(city) => setSelectedCity(city)}
              />
            </div>
          )}

          {/* STEP 2: HOSPITAL */}
          {selectedCity && !selectedHospital && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm text-white font-black shadow-lg">
                    2
                  </span>
                  <span className="text-slate-800">Select the Hospital</span>
                </h2>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
                >
                  ← Change City
                </button>
              </div>
              <HospitalSelect
                hospitals={cityHospitals}
                onSelect={(h) => setSelectedHospital(h)}
              />
            </div>
          )}

          {/* STEP 3: CONTEXT & PROCEDURE */}
          {selectedHospital && !selectedProcedure && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm text-white font-black shadow-lg">
                    3
                  </span>
                  <span className="text-slate-800">Audit Details</span>
                </h2>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
                >
                  ↺ Reset
                </button>
              </div>

              <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200/50 shadow-inner">
                <label className="block text-xs font-black text-cyan-900 uppercase mb-4 tracking-wide flex items-center gap-2">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Select Ward Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["General", "Semi-Private", "Private"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setWardType(t)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all duration-200 border-2 transform hover:scale-105 ${
                          wardType === t
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-transparent text-white shadow-xl shadow-cyan-200"
                            : "bg-white border-slate-200 text-slate-600 hover:border-cyan-300 shadow-sm"
                        }`}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-3 tracking-wide flex items-center gap-2">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Search Procedure or Test
                </label>
                <ProcedureSearch
                  tier={selectedHospital.tier_type}
                  onSelect={(p) => setSelectedProcedure(p)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: VERDICT */}
          {selectedProcedure && selectedHospital && (
            <Verdict
              hospital={selectedHospital}
              procedure={selectedProcedure}
              wardType={wardType}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Comprehensive Legal Disclaimer */}
        <div className="mt-8 glass p-6 rounded-2xl shadow-lg">
          <div className="flex items-start gap-3 mb-3">
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
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p className="font-bold text-slate-800 text-sm">
                Important Legal Disclaimer
              </p>
              <p>
                <strong>MedClarity</strong> is an independent compliance
                verification tool. This platform references the Ministry of
                Health and Family Welfare (MoHFW) Office Memorandum dated
                03.10.2025 and CGHS empanelment guidelines. The calculations
                provided are for{" "}
                <strong>informational and transparency purposes only</strong>{" "}
                and do not constitute legal advice.
              </p>
              <p>
                While we strive for accuracy, users should verify all rates
                independently and consult with qualified legal professionals
                before taking any legal action. Hospital pricing may vary based
                on case complexity, emergency status, or other clinical factors
                not captured in this audit.
              </p>
              <p className="font-semibold text-slate-700">
                By using this service, you acknowledge that MedClarity is not
                liable for any decisions made based on this information. Always
                seek professional medical and legal counsel for healthcare
                disputes.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-6 text-center space-y-2">
          <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
            <span className="font-bold">Data Source:</span>
            <span>MoHFW OM 03.10.2025 • CGHS Empanelment 2026</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © 2026 MedClarity. Built for healthcare transparency.
          </p>
        </footer>
      </div>
    </main>
  );
}
