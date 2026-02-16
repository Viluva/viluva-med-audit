"use client";

import React, { useState } from "react";
import { useCombobox, UseComboboxStateChange } from "downshift";
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
    // getComboboxProps,
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
        className="block text-sm font-medium text-gray-700"
      >
        Search for a hospital
      </label>
      <div className="relative mt-1">
        <input
          {...getInputProps()}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          {...getToggleButtonProps()}
          aria-label="toggle menu"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        >
          &#9660;
        </button>
        <ul
          {...getMenuProps()}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={{
                  backgroundColor:
                    highlightedIndex === index ? "#f3f4f6" : "white",
                  fontWeight: selectedItem === item ? "bold" : "normal",
                }}
                {...getItemProps({ item, index })}
                key={item.sno_}
                className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
              >
                {item.hospital_name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
