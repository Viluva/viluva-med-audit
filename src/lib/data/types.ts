export interface Hospital {
  // Required for empanelled hospitals from your JSON
  sno_?: number;
  city_name?: string;
  hospital_name: string;
  accreditation: string; // "NABH", "NON NABH", "NABL", etc.
  tier_type: string; // "Tier 1", "Tier 2", "Tier 3"
  address: string;
  facilities?: string;

  // NEW: Flag for hospitals not in your master list (Benchmark Mode)
  isCustom?: boolean;
}

export interface Price {
  code: string;
  name: string;

  // Using string for safety during import, but will be parsed to number in logic
  nabhRate: string;
  nonNabhRate: string;

  // Some datasets have pre-calculated SS rates, others use a 15% multiplier
  superSpecialityRate?: string;

  // CRITICAL: Used to check if ward multipliers apply (Consultations/Labs = No)
  specialityClassification: string;

  tier: string; // The city tier this rate belongs to (X/Y/Z)
}

// NEW: Helper type for the Audit Result state
export interface AuditResult {
  procedure: Price;
  hospital: Hospital;
  wardType: "General" | "Semi-Private" | "Private";
  userChargedAmount: number;
  officialBenchmarkAmount: number;
  overchargeAmount: number;
}
