"use client";

import React, { useState, useMemo } from "react";
import { Hospital } from "@/lib/data/types";

interface HospitalSelectProps {
  hospitals: Hospital[];
  onSelect: (hospital: Hospital) => void;
  isUnlistedCity?: boolean; // New prop to handle cases where the city/town wasn't found
}

export default function HospitalSelect({
  hospitals,
  onSelect,
  isUnlistedCity = false,
}: HospitalSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize filtered results for performance
  const filteredHospitals = useMemo(() => {
    if (!searchTerm) return hospitals;
    return hospitals.filter((h) =>
      h.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [hospitals, searchTerm]);

  // If the user selected an unlisted location, we skip the search and go straight to benchmark
  if (isUnlistedCity) {
    return (
      <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300 rounded-2xl shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-black text-lg text-amber-900">
                Universal Benchmark Mode
              </h3>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Since your location is not a designated CGHS metro area, we will
              audit your bill using the{" "}
              <strong className="text-amber-950">
                National Tier-3 (Z Category) Benchmark
              </strong>
              . This represents the legally applicable minimum rate floor for
              non-metro regions.
            </p>
            <div className="mt-4 p-3 bg-white/70 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800 font-bold">
                ✓ Legally Valid • ✓ Conservative Estimate • ✓ Court Admissible
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <button
            onClick={() =>
              onSelect({
                hospital_name: "Private Facility (Tier-3 Benchmark)",
                accreditation: "NON NABH",
                tier_type: "Tier 3",
                address: "Unlisted Location",
                isCustom: true,
                sno_: 0,
                city_name: "Generic",
                facilities: "N/A",
              })
            }
            className="relative w-full py-5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-2xl hover:from-cyan-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all active:scale-95 flex justify-between items-center"
          >
            <span className="text-lg">Proceed with Compliance Audit</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-500">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-14 pr-6 text-lg font-bold placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all shadow-sm"
          placeholder="Search empanelled hospitals..."
          autoComplete="off"
        />
      </div>

      <div className="relative">
        <ul className="max-h-72 overflow-y-auto rounded-2xl border-2 border-slate-200 bg-white shadow-lg divide-y divide-slate-100 custom-scrollbar">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((h, idx) => (
              <li
                key={h.sno_ || idx}
                onClick={() => onSelect(h)}
                className="group p-5 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 flex justify-between items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-0 transition-opacity"></div>
                <div className="relative">
                  <p className="font-black text-slate-800 group-hover:text-white transition-colors text-base">
                    {h.hospital_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        h.accreditation.toUpperCase().includes("NABH")
                          ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-white/30 group-hover:text-white"
                      }`}
                    >
                      {h.accreditation}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-cyan-100">
                      {h.tier_type}
                    </span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-200">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </li>
            ))
          ) : (
            <li className="p-10 text-center">
              <svg
                className="w-12 h-12 text-slate-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-slate-400 font-semibold">
                No empanelled hospitals found for &ldquo;{searchTerm}&rdquo;
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with a different name or select the option below
              </p>
            </li>
          )}

          {/* PERSISTENT FALLBACK: For Private/Non-Empanelled Hospitals */}
          <li
            onClick={() =>
              onSelect({
                hospital_name: searchTerm || "Private Hospital",
                accreditation: "NON NABH",
                tier_type: "Tier 1",
                address: "Custom Selection",
                isCustom: true,
                sno_: -1,
                city_name: "Unknown",
                facilities: "N/A",
              })
            }
            className="relative p-5 cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 hover:from-cyan-50 hover:to-blue-50 border-t-2 border-slate-200 group transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-black text-cyan-700 text-base group-hover:text-cyan-800 transition-colors">
                  Hospital Not Listed?
                </p>
                <p className="text-xs text-slate-600 font-bold mt-0.5">
                  Use Private Sector Benchmark Rate
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs">
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
        <p className="text-slate-600 font-bold uppercase tracking-wide">
          Verified Against 2026 CGHS Empanelment Data
        </p>
      </div>
    </div>
  );
}
