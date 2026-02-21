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
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-slate-50 font-sans text-slate-900">
      <div className="w-full max-w-2xl mx-auto">
        <header className="flex flex-col items-center text-center mb-10">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <Image
              src="/Viluva.png"
              alt="Viluva Logo"
              width={50}
              height={50}
              priority
            />
          </div>
          <h1 className="text-3xl font-black mt-4 tracking-tight">
            Viluva Med-Audit
          </h1>
          <p className="text-slate-500 font-medium max-w-sm">
            Official 2026 Price Cap Compliance & Dispute Engine
          </p>
        </header>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/60">
          {/* STEP 1: CITY */}
          {!selectedCity && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                  1
                </span>
                Where is the hospital located?
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                    2
                  </span>
                  Select the Hospital
                </h2>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Change City
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                    3
                  </span>
                  Audit Details
                </h2>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <label className="block text-[10px] font-black text-indigo-900 uppercase mb-3 tracking-widest">
                  Select Your Ward Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["General", "Semi-Private", "Private"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setWardType(t)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                          wardType === t
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                            : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                        }`}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
                  Which procedure are we auditing?
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

        <footer className="mt-10 text-center text-[10px] text-slate-400 font-medium px-8 leading-relaxed">
          <p>© 2026 Viluva Med-Audit. Referencing MoHFW OM 03.10.2025.</p>
          <p className="mt-2 italic">
            Disclaimer: This audit is for transparency purposes and does not
            replace professional legal representation.
          </p>
        </footer>
      </div>
    </main>
  );
}
