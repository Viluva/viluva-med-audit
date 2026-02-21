"use client";

import React, { useState } from "react";
import { Price, Hospital } from "@/lib/data/types";

interface VerdictProps {
  procedure: Price;
  hospital: Hospital;
  wardType: "General" | "Semi-Private" | "Private"; // Added this prop
}

export default function Verdict({
  procedure,
  hospital,
  wardType,
}: VerdictProps) {
  const [userPrice, setUserPrice] = useState("");

  const calculateOfficialPrice = () => {
    // 1. Determine Base Rate based on Accreditation
    let baseRate = hospital.accreditation.includes("NABH")
      ? parseFloat(procedure.nabhRate.toString())
      : parseFloat(procedure.nonNabhRate.toString());

    // 2. Apply Super Speciality Premium (15% extra on NABH rate)
    // Check if "Super Speciality" is in name or facilities
    const isSuperSpeciality =
      hospital.hospital_name.toLowerCase().includes("super speciality") ||
      hospital.facilities?.toLowerCase().includes("super speciality");

    if (isSuperSpeciality && hospital.accreditation.includes("NABH")) {
      baseRate *= 1.15;
    }

    // 3. Apply City Tier Discount (Rates in Master List are usually Tier 1/X)
    // Tier 1 (X) = 100%, Tier 2 (Y) = 90%, Tier 3 (Z) = 80%
    if (hospital.tier_type?.toLowerCase().includes("tier 2")) baseRate *= 0.9;
    if (hospital.tier_type?.toLowerCase().includes("tier 3")) baseRate *= 0.8;

    // 4. Apply Ward Multiplier
    // Note: Consultations, Investigations, and Radiotherapy are UNIFORM (No ward adjustment)
    const uniformCategories = [
      "Consultation",
      "Laboratory Investigation",
      "Radiotherapy",
      "Diagnostic",
    ];
    const isUniform = uniformCategories.some((cat) =>
      procedure.name.toLowerCase().includes(cat.toLowerCase()),
    );

    if (!isUniform) {
      if (wardType === "General") baseRate *= 0.95; // -5%
      if (wardType === "Private") baseRate *= 1.05; // +5%
      // Semi-Private is the base (100%)
    }

    return Math.round(baseRate);
  };

  const officialPrice = calculateOfficialPrice();
  const priceDifference = userPrice
    ? parseFloat(userPrice) - officialPrice
    : null;
  const overchargePercent =
    priceDifference && priceDifference > 0
      ? ((priceDifference / officialPrice) * 100).toFixed(0)
      : 0;

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">{procedure.name}</h3>
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          Official Audit for {hospital.hospital_name}
        </p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <label className="block text-sm font-semibold text-indigo-900 mb-2">
          What did the hospital charge you?
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xl font-bold text-gray-600">
            ₹
          </span>
          <input
            type="number"
            value={userPrice}
            onChange={(e) => setUserPrice(e.target.value)}
            className="w-full rounded-lg border-2 border-indigo-200 bg-white py-4 pl-10 pr-4 text-2xl font-bold text-gray-800 focus:border-indigo-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      {priceDifference !== null && (
        <div
          className={`p-6 rounded-xl border-2 ${priceDifference > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Approved CGHS Rate
              </p>
              <p className="text-3xl font-black text-gray-900">
                ₹{officialPrice}
              </p>
            </div>
            {priceDifference > 0 && (
              <div className="text-right">
                <p className="text-xs font-bold text-red-600 uppercase">
                  Value Leak Found
                </p>
                <p className="text-2xl font-bold text-red-600">
                  +{overchargePercent}%
                </p>
              </div>
            )}
          </div>

          {priceDifference > 0 ? (
            <div className="mt-4 pt-4 border-t border-red-100 text-red-800">
              <p className="font-semibold underline">
                Verdict: Critical Overcharge
              </p>
              <p className="text-sm mt-1">
                This hospital is charging <strong>₹{priceDifference}</strong>{" "}
                above the legal cap for a <strong>{wardType}</strong> ward in a{" "}
                <strong>{hospital.tier_type}</strong> city.
              </p>
              <button className="w-full mt-4 bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-red-700 transition">
                Generate Dispute Letter (₹99)
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-green-100 text-green-800">
              <p className="font-semibold">Verdict: Compliant</p>
              <p className="text-sm">
                The hospital's pricing is within the government approved range.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Audit Transparency Trail */}
      <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-400 uppercase font-bold px-2">
        <span>Tier: {hospital.tier_type}</span>
        <span>Accreditation: {hospital.accreditation}</span>
        <span>Ward: {wardType}</span>
        <span>Ref: CGHS OM 03.10.2025</span>
      </div>
    </div>
  );
}
