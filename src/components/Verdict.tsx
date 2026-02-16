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
    <div className="w-full mt-4 p-4 border rounded-md shadow-md">
      <h3 className="text-lg font-semibold">{procedure.name}</h3>
      <p className="text-sm text-gray-600">at {hospital.hospital_name}</p>

      <div className="mt-4">
        <label
          htmlFor="user-price"
          className="block text-sm font-medium text-gray-700"
        >
          Your Price
        </label>
        <input
          id="user-price"
          type="number"
          value={userPrice}
          onChange={(e) => setUserPrice(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter the price you were quoted"
        />
      </div>

      {/* {officialPrice && (
        <div className="mt-4">
          <p>Official Price: <span className="font-bold">₹{officialPrice}</span></p>
        </div>
      )} */}

      {priceDifference !== null && (
        <div className="mt-4">
          {priceDifference > 0 ? (
            <div className="p-4 rounded-md bg-red-100 text-red-800">
              You might be overpaying by{" "}
              <span className="font-bold">₹{priceDifference.toFixed(2)}</span>.
            </div>
          ) : priceDifference < 0 ? (
            <div className="p-4 rounded-md bg-green-100 text-green-800">
              You are getting a good deal, saving{" "}
              <span className="font-bold">
                ₹{(-priceDifference).toFixed(2)}
              </span>
              .
            </div>
          ) : (
            <div className="p-4 rounded-md bg-blue-100 text-blue-800">
              The price you were quoted seems correct.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
