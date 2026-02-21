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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full py-4 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:outline-none text-lg font-medium"
        placeholder="e.g. MRI Brain, CBC, Cataract Surgery"
      />
      {loading && (
        <div className="absolute right-4 top-5 animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
      )}

      {results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto">
          {results.map((p) => (
            <li
              key={p.code}
              onClick={() => onSelect(p)}
              className="p-4 cursor-pointer hover:bg-indigo-600 hover:text-white border-b border-slate-50 last:border-0 transition-colors"
            >
              <p className="font-bold text-sm">{p.name}</p>
              <p className="text-[10px] uppercase opacity-60 tracking-tighter">
                Code: {p.code} • {p.specialityClassification}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
