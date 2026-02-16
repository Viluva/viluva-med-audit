"use client";

import React, { useState, useMemo } from "react";
import { Hospital } from "@/lib/data/types";

interface HospitalSelectProps {
  hospitals: Hospital[];
  onSelect: (hospital: Hospital | null) => void;
}

export default function HospitalSelect({
  hospitals,
  onSelect,
}: HospitalSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter hospitals based on search - using useMemo for performance
  const filteredHospitals = useMemo(() => {
    if (!searchTerm) return hospitals;
    return hospitals.filter((item) =>
      item.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [hospitals, searchTerm]);

  const handleHospitalSelect = (hospital: Hospital) => {
    onSelect(hospital);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full relative">
      <label
        htmlFor="hospital-search"
        className="block text-sm font-medium text-gray-700 sr-only"
      >
        Search for a hospital
      </label>
      <div className="relative">
        <input
          id="hospital-search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Search for a hospital..."
        />
        <button
          type="button"
          onClick={handleToggle}
          aria-label="toggle menu"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          &#9660;
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {filteredHospitals.length > 0 ? (
            <ul className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredHospitals.map((item) => (
                <li
                  key={item.sno_}
                  onClick={() => handleHospitalSelect(item)}
                  className="relative cursor-pointer select-none py-3 pl-4 pr-4 text-gray-900 hover:bg-indigo-600 hover:text-white"
                >
                  {item.hospital_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="absolute z-20 mt-1 w-full rounded-md bg-white py-3 px-4 text-sm text-gray-500 shadow-lg ring-1 ring-black ring-opacity-5">
              No hospitals found
            </div>
          )}
        </>
      )}
    </div>
  );
}
