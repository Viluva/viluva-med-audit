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
      <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📍</span>
            <h3 className="font-bold text-amber-900">
              Universal Benchmark Mode
            </h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            Since your location is not a designated CGHS metro, we will audit
            your bill using the
            <strong> National Tier-3 (Z) Benchmark</strong>. This is the legally
            safest price floor.
          </p>
        </div>

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
          className="w-full py-5 px-6 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] transition-all active:scale-95 flex justify-between items-center"
        >
          <span>Proceed with Audit</span>
          <svg
            className="w-5 h-5"
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
    );
  }

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
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
          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-6 text-lg font-semibold placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all"
          placeholder="Search hospital name..."
          autoComplete="off"
        />
      </div>

      <div className="relative">
        <ul className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-inner divide-y divide-slate-50 custom-scrollbar">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((h, idx) => (
              <li
                key={h.sno_ || idx}
                onClick={() => onSelect(h)}
                className="group p-4 cursor-pointer hover:bg-indigo-600 transition-all flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-white transition-colors">
                    {h.hospital_name}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-200">
                    {h.accreditation} • {h.tier_type}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-white"
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
            <li className="p-8 text-center">
              <p className="text-slate-400 font-medium">
                No empanelled hospitals found matching "{searchTerm}"
              </p>
            </li>
          )}

          {/* PERSISTENT FALLBACK: For Private/Non-Empanelled Hospitals */}
          <li
            onClick={() =>
              onSelect({
                hospital_name: searchTerm || "Private Hospital",
                accreditation: "NON NABH",
                tier_type: "Tier 1", // Assume Tier 1 for non-listed to be fair, or detect from city
                address: "Custom Selection",
                isCustom: true,
                sno_: -1,
                city_name: "Unknown",
                facilities: "N/A",
              })
            }
            className="p-5 cursor-pointer bg-slate-50 hover:bg-indigo-50 border-t-2 border-slate-100 group transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-100 transition-colors">
                <svg
                  className="w-5 h-5 text-indigo-600"
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
                <p className="font-black text-indigo-600 text-sm">
                  Hospital not listed?
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Audit using Private Sector Benchmark
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
        Verified against 2026 Empanelment Master List
      </p>
    </div>
  );
}
