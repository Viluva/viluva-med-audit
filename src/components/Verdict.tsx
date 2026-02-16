"use client";

import React, { useState } from "react";
import { Price, Hospital } from "@/lib/data/types";

interface VerdictProps {
  procedure: Price;
  hospital: Hospital;
}

export default function Verdict({ procedure, hospital }: VerdictProps) {
  const [userPrice, setUserPrice] = useState("");

  const getOfficialPrice = () => {
    if (hospital.accreditation === "NABH") {
      return procedure.nabhRate;
    }
    return procedure.nonNabhRate;
  };

  const officialPrice = getOfficialPrice();
  const priceDifference =
    officialPrice && userPrice
      ? parseFloat(userPrice) - parseFloat(officialPrice)
      : null;

  return (
    <div className="w-full">
      <div className="text-center">
        <h3 className="text-2xl font-bold">{procedure.name}</h3>
        <p className="text-md text-gray-500">at {hospital.hospital_name}</p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="user-price"
          className="block text-sm font-medium text-gray-700 sr-only"
        >
          Your Price
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lg text-gray-500">
            ₹
          </span>
          <input
            id="user-price"
            type="number"
            value={userPrice}
            onChange={(e) => setUserPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 text-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter your price"
          />
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Analysis Details
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-semibold text-gray-600">Accreditation:</p>
            <p>{hospital.accreditation}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Tier:</p>
            <p>{hospital.tier_type}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">City:</p>
            <p>{hospital.address}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">CGHS Code:</p>
            <p>{procedure.code}</p>
          </div>
        </div>
      </div>

      {priceDifference !== null && (
        <div className="mt-6">
          {priceDifference > 0 ? (
            <div className="p-4 rounded-lg bg-red-100 text-red-800 text-center">
              <p className="font-bold text-lg">You are overpaying!</p>
            </div>
          ) : priceDifference < 0 ? (
            <div className="p-4 rounded-lg bg-green-100 text-green-800 text-center">
              <p className="font-bold text-lg">You are getting a good deal!</p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-blue-100 text-blue-800 text-center">
              <p className="font-bold text-lg">The price seems correct.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
