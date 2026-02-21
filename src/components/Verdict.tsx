"use client";
import React, { useState } from "react";
import { Price, Hospital } from "@/lib/data/types";

export default function Verdict({
  procedure,
  hospital,
  wardType,
  onReset,
}: {
  procedure: Price;
  hospital: Hospital;
  wardType: string;
  onReset: () => void;
}) {
  const [userPrice, setUserPrice] = useState("");

  const calculateAuditPrice = () => {
    let rate = hospital.accreditation.toUpperCase().includes("NABH")
      ? parseFloat(procedure.nabhRate.toString())
      : parseFloat(procedure.nonNabhRate.toString());

    // Super Speciality Check
    if (
      hospital.hospital_name.toLowerCase().includes("super speciality") &&
      hospital.accreditation.includes("NABH")
    ) {
      rate *= 1.15;
    }

    // City Tier Adjustment
    if (hospital.tier_type.includes("2")) rate *= 0.9;
    if (hospital.tier_type.includes("3")) rate *= 0.8;

    // Ward Multiplier (Excluded for Investigations/Consults)
    const isUniform = [
      "consultation",
      "investigation",
      "diagnostic",
      "radiotherapy",
    ].some((c) => procedure.name.toLowerCase().includes(c));
    if (!isUniform) {
      if (wardType === "General") rate *= 0.95;
      if (wardType === "Private") rate *= 1.05;
    }
    return Math.round(rate);
  };

  const auditPrice = calculateAuditPrice();
  const diff = userPrice ? parseFloat(userPrice) - auditPrice : 0;
  const isOvercharged = diff > 0;

  return (
    <div className="animate-in zoom-in-95 space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl text-white">
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">
          Audit Report
        </p>
        <h3 className="text-xl font-bold">{procedure.name}</h3>
        <p className="text-xs text-slate-400 mt-1">
          {hospital.hospital_name} • {wardType} Ward
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-2">
          Hospital Bill Amount
        </label>
        <div className="relative">
          <span className="absolute left-6 top-4 text-2xl font-black text-slate-400">
            ₹
          </span>
          <input
            type="number"
            value={userPrice}
            onChange={(e) => setUserPrice(e.target.value)}
            className="w-full text-3xl font-black p-4 pl-12 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      {userPrice && (
        <div
          className={`p-6 rounded-3xl border-2 ${isOvercharged ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
        >
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Government Approved Rate
              </p>
              <p className="text-3xl font-black text-slate-900">
                ₹{auditPrice}
              </p>
            </div>
            {isOvercharged && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-red-500">
                  Value Leak Found
                </p>
                <p className="text-2xl font-black text-red-600">₹{diff}</p>
              </div>
            )}
          </div>

          {isOvercharged && (
            <button className="w-full mt-6 bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 hover:scale-[1.02] transition-transform">
              Generate Legal Notice (₹99)
            </button>
          )}
        </div>
      )}
      <button
        onClick={onReset}
        className="w-full text-slate-400 text-xs font-bold hover:text-indigo-600"
      >
        ← Audit Another Procedure
      </button>
    </div>
  );
}
