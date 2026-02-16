
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
      <label htmlFor="procedure-search" className="block text-sm font-medium text-gray-700 sr-only">
        Search for a procedure
      </label>
      <div className="relative mt-1">
        <input
          id="procedure-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g., Consultation OPD"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {results.length > 0 && (
        <ul className="relative z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {results.map((procedure) => (
            <li
              key={procedure.code}
              onClick={() => handleSelect(procedure)}
              className="relative cursor-pointer select-none py-3 pl-4 pr-4 text-gray-900 hover:bg-indigo-600 hover:text-white"
            >
              {procedure.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
