
'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Price } from '@/lib/data/types';

interface ProcedureSearchProps {
  tier: string;
  onSelect: (procedure: Price | null) => void;
}

export default function ProcedureSearch({ tier, onSelect }: ProcedureSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery) {
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

  const handleSelect = (procedure: Price) => {
    onSelect(procedure);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="w-full">
      <label htmlFor="procedure-search" className="block text-sm font-medium text-gray-700">
        Search for a procedure
      </label>
      <div className="relative mt-1">
        <input
          id="procedure-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Consultation OPD"
        />
        {loading && <div className="absolute inset-y-0 right-0 flex items-center pr-3">...</div>}
      </div>
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {results.map((procedure) => (
            <li
              key={procedure.code}
              onClick={() => handleSelect(procedure)}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
            >
              {procedure.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
