"use client";
import React, { useState, useMemo } from "react";
import { Hospital } from "@/lib/data/types";

export default function CitySelect({
  hospitals,
  onSelect,
}: {
  hospitals: Hospital[];
  onSelect: (city: string, isUnlisted?: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const cities = useMemo(
    () =>
      Array.from(new Set(hospitals.map((h) => h.address)))
        .filter(Boolean)
        .sort(),
    [hospitals],
  );
  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors"
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
          placeholder="Type your city or town name..."
          className="w-full py-3 sm:py-4 pl-12 sm:pl-14 pr-4 sm:pr-6 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none text-base sm:text-lg font-semibold text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="group text-left p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-cyan-500 hover:shadow-lg transition-all duration-200 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            <div className="relative flex items-center gap-2">
              <svg
                className="w-4 h-4 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-slate-700 group-hover:text-cyan-700 transition-colors">
                {city}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* FALLBACK FOR UNLISTED LOCATIONS */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
        <button
          onClick={() => onSelect("Unlisted Location (Tier 3 Benchmark)", true)}
          className="relative w-full text-center p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 text-amber-900 font-black hover:from-amber-100 hover:to-orange-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-3">
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
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>My Location is Not Listed</span>
          </div>
          <p className="text-xs text-amber-700 mt-2 font-semibold">
            Use Universal Tier-3 Benchmark
          </p>
        </button>
      </div>
    </div>
  );
}
