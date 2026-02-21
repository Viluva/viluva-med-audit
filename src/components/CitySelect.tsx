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
    () => Array.from(new Set(hospitals.map((h) => h.address))).sort(),
    [hospitals],
  );
  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search city/town..."
        className="w-full py-4 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none text-lg font-medium"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
        {filtered.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="text-left p-3 rounded-xl bg-white border border-slate-100 hover:bg-indigo-50 font-semibold text-slate-600"
          >
            {city}
          </button>
        ))}
        {/* FALLBACK FOR UNLISTED LOCATIONS */}
        <button
          onClick={() => onSelect("Unlisted Location (Tier 3 Benchmark)", true)}
          className="col-span-2 text-center p-4 rounded-xl bg-indigo-50 border-2 border-dashed border-indigo-200 text-indigo-700 font-black hover:bg-indigo-100 transition-all"
        >
          + My City/Village is not listed
        </button>
      </div>
    </div>
  );
}
