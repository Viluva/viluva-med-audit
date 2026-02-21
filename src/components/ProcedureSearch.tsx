"use client";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Price } from "@/lib/data/types";

export default function ProcedureSearch({
  tier,
  onSelect,
}: {
  tier: string;
  onSelect: (p: Price) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [results, setResults] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setLoading(true);
      fetch(`/api/audit/search?q=${debouncedQuery}&tier=${tier}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery, tier]);

  return (
    <div className="relative">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-4 pl-14 pr-6 rounded-2xl bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none text-lg font-semibold placeholder:text-slate-400 transition-all shadow-sm"
          placeholder="e.g. MRI Brain, CBC Test, Cataract Surgery..."
        />
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-6 w-6 border-3 border-cyan-200 border-t-cyan-600"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-50 mt-3 w-full bg-white rounded-2xl shadow-2xl border-2 border-slate-200 max-h-72 overflow-y-auto custom-scrollbar">
          {results.map((p) => (
            <li
              key={p.code}
              onClick={() => onSelect(p)}
              className="group p-5 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-b border-slate-100 last:border-0 transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-0 transition-opacity"></div>
              <div className="relative">
                <p className="font-bold text-base text-slate-800 group-hover:text-white transition-colors">
                  {p.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-black uppercase tracking-wide px-2 py-1 rounded-md bg-slate-100 text-slate-600 group-hover:bg-white/30 group-hover:text-white transition-colors">
                    {p.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-cyan-100 transition-colors">
                    {p.specialityClassification}
                  </span>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          ))}
        </ul>
      )}
    </div>
  );
}
