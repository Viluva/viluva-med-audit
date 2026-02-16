"use client";

import React, { useState, useMemo } from "react";
import { Hospital } from "@/lib/data/types";

interface CitySelectProps {
  hospitals: Hospital[];
  onSelect: (city: string) => void;
}

export default function CitySelect({ hospitals, onSelect }: CitySelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique cities and sort them, im using address
  const cities = useMemo(() => {
    const citySet = new Set(hospitals.map((h) => h.address));
    return Array.from(citySet).sort();
  }, [hospitals]);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!searchTerm) return cities;
    return cities.filter((city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [cities, searchTerm]);

  const handleCitySelect = (city: string) => {
    onSelect(city);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      <label
        htmlFor="city-search"
        className="block text-sm font-medium text-gray-700 sr-only"
      >
        Search for a city
      </label>
      <div className="relative">
        <input
          id="city-search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Search for a city..."
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="toggle menu"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          &#9660;
        </button>
      </div>

      {isOpen && filteredCities.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <ul className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredCities.map((city) => (
              <li
                key={city}
                onClick={() => handleCitySelect(city)}
                className="relative cursor-pointer select-none py-3 pl-4 pr-4 text-gray-900 hover:bg-indigo-600 hover:text-white"
              >
                {city}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
