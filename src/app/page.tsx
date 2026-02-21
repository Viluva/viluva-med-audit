"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import CitySelect from "@/components/CitySelect";
import HospitalSelect from "@/components/HospitalSelect";
import ProcedureSearch from "@/components/ProcedureSearch";
import Verdict from "@/components/Verdict";
import { Hospital, Price } from "@/lib/data/types";
import hospitals from "@/lib/data/hospitals.json";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );
  const [selectedProcedure, setSelectedProcedure] = useState<Price | null>(
    null,
  );

  // NEW STATE: Ward Type is critical for 2026 CGHS Logic
  const [wardType, setWardType] = useState<
    "General" | "Semi-Private" | "Private"
  >("Semi-Private");

  const cityHospitals = useMemo(() => {
    if (!selectedCity) return [];
    return (hospitals as Hospital[]).filter((h) => h.address === selectedCity);
  }, [selectedCity]);

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedHospital(null);
    setSelectedProcedure(null);
    setWardType("Semi-Private");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-2xl mx-auto">
        <header className="flex flex-col items-center text-center mb-10">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <Image
              src="/Viluva.png"
              alt="Viluva Logo"
              width={60}
              height={60}
              priority
            />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-6 tracking-tight">
            Viluva Med Audit
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Official 2026 CGHS Compliance Checker
          </p>
        </header>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
          {/* STEP 1: CITY */}
          {!selectedCity ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                  1
                </span>
                Where is the hospital located?
              </h2>
              <CitySelect
                hospitals={hospitals as Hospital[]}
                onSelect={(city) => setSelectedCity(city)}
              />
            </div>
          ) : /* STEP 2: HOSPITAL & WARD */
          !selectedHospital ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                    2
                  </span>
                  Select the Hospital
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Change City
                </button>
              </div>
              <HospitalSelect
                hospitals={cityHospitals}
                onSelect={(h) => setSelectedHospital(h)}
              />
              <p className="mt-4 text-xs text-slate-400 italic">
                Showing empanelled facilities in {selectedCity}
              </p>
            </div>
          ) : /* STEP 3: PROCEDURE & WARD TYPE */
          !selectedProcedure ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                    3
                  </span>
                  Final Details
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Start Over
                </button>
              </div>

              {/* WARD SELECTION UI */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Which ward were you in?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["General", "Semi-Private", "Private"] as const).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setWardType(type)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                          wardType === type
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                        }`}
                      >
                        {type}
                      </button>
                    ),
                  )}
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Note: Government rates vary by ward entitlement.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  What procedure are we auditing?
                </label>
                <ProcedureSearch
                  tier={selectedHospital.tier_type}
                  onSelect={(p) => setSelectedProcedure(p)}
                />
              </div>
            </div>
          ) : (
            /* STEP 4: VERDICT */
            <div className="animate-in zoom-in-95 duration-500">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleReset}
                  className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition"
                >
                  Audit Another Bill
                </button>
              </div>
              <Verdict
                hospital={selectedHospital}
                procedure={selectedProcedure}
                wardType={wardType}
              />
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-slate-400 text-[10px] leading-relaxed px-6">
          <p>
            © 2026 Viluva Med-Audit. Data sourced from MoHFW Office Memorandum
            dated 03.10.2025.
          </p>
          <p className="mt-1 font-medium">
            This tool provides an audit report for informational purposes and
            does not constitute legal advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
