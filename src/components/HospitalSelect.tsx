"use client";

import React, { useState } from "react";
import {
  useCombobox,
  UseComboboxStateChange,
  UseComboboxReturnValue,
} from "downshift";
import { Hospital } from "@/lib/data/types";

interface HospitalSelectProps {
  hospitals: Hospital[];
  onSelect: (hospital: Hospital | null) => void;
}

export default function HospitalSelect({
  hospitals,
  onSelect,
}: HospitalSelectProps) {
  const [inputItems, setInputItems] = useState(hospitals);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? item.hospital_name : ""),
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        hospitals.filter((item) =>
          item.hospital_name
            .toLowerCase()
            .includes(inputValue?.toLowerCase() || ""),
        ),
      );
    },
    onSelectedItemChange: ({
      selectedItem,
    }: UseComboboxStateChange<Hospital>) => {
      onSelect(selectedItem || null);
    },
  });

  return (
    <div className="w-full">
      <label
        {...getLabelProps()}
        className="block text-sm font-medium text-gray-700 sr-only"
      >
        Search for a hospital
      </label>
      <div className="relative mt-1">
        <input
          {...getInputProps()}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Search for a hospital..."
        />
        <button
          {...getToggleButtonProps()}
          aria-label="toggle menu"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          &#9660;
        </button>
        {isOpen && (
          <ul
            {...getMenuProps()}
            className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {inputItems.map((item, index) => (
                <li
                  className={`relative cursor-pointer select-none py-3 pl-4 pr-4 text-gray-900 ${
                    highlightedIndex === index ? "bg-indigo-600 text-white" : ""
                  }`}
                  {...getItemProps({ item, index })}
                  key={item.sno_}
                >
                  <span
                    className={`block truncate ${selectedItem === item ? "font-semibold" : "font-normal"}`}
                  >
                    {item.hospital_name}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
