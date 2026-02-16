'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HospitalSelect from '@/components/HospitalSelect';
import ProcedureSearch from '@/components/ProcedureSearch';
import Verdict from '@/components/Verdict';
import { Hospital, Price } from '@/lib/data/types';
import hospitals from '@/lib/data/hospitals.json';

export default function Home() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Price | null>(null);

  const handleHospitalSelect = (hospital: Hospital | null) => {
    setSelectedHospital(hospital);
    setSelectedProcedure(null);
  };

  const handleProcedureSelect = (procedure: Price | null) => {
    setSelectedProcedure(procedure);
  };

  const handleReset = () => {
    setSelectedHospital(null);
    setSelectedProcedure(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto">
        <header className="flex flex-col items-center text-center mb-8">
          <Image src="/Viluva.png" alt="Viluva Logo" width={80} height={80} />
          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            Viluva Med Audit
          </h1>
          <p className="text-gray-600 mt-2">
            Your trusted partner in medical bill auditing.
          </p>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {!selectedHospital ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Step 1: Select a Hospital</h2>
              <HospitalSelect
                hospitals={hospitals as Hospital[]}
                onSelect={handleHospitalSelect}
              />
            </div>
          ) : !selectedProcedure ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Step 2: Find a Procedure</h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Start Over
                </button>
              </div>
              <p className="mb-4">
                <span className="font-semibold">Hospital:</span> {selectedHospital.hospital_name}
              </p>
              <ProcedureSearch
                tier={selectedHospital.tier_type}
                onSelect={handleProcedureSelect}
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Step 3: See the Verdict</h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Start Over
                </button>
              </div>
              <Verdict hospital={selectedHospital} procedure={selectedProcedure} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}