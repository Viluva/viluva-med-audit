'use client';

import React, { useState } from 'react';
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
    setSelectedHospital(null)
    setSelectedProcedure(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Viluva Med Audit
        </p>
      </div>

      <div className="w-full max-w-xl mt-12">
        {!selectedHospital && (
          <HospitalSelect
            hospitals={hospitals as Hospital[]}
            onSelect={handleHospitalSelect}
          />
        )}

        {selectedHospital && !selectedProcedure && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Hospital: {selectedHospital.hospital_name}
            </h2>
            <ProcedureSearch
              tier={selectedHospital.tier_type}
              onSelect={handleProcedureSelect}
            />
          </div>
        )}

        {selectedHospital && selectedProcedure && (
          <Verdict hospital={selectedHospital} procedure={selectedProcedure} />
        )}
        
        {(selectedHospital || selectedProcedure) && (
          <button
            onClick={handleReset}
            className="mt-4 text-sm text-blue-500 hover:underline"
          >
            Start Over
          </button>
        )}
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        
      </div>
    </main>
  );
}