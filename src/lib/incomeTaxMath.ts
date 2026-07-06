export interface TaxSlab {
  upTo: number | null;
  rate: number;
}

export const NEW_REGIME_SLABS: TaxSlab[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: null, rate: 0.3 },
];

export const OLD_REGIME_SLABS: TaxSlab[] = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: null, rate: 0.3 },
];

export const NEW_REGIME_STANDARD_DEDUCTION = 75000;
export const OLD_REGIME_STANDARD_DEDUCTION = 50000;
export const NEW_REGIME_REBATE_LIMIT = 1200000;
export const OLD_REGIME_REBATE_LIMIT = 500000;
export const NEW_REGIME_REBATE_MAX = 60000;
export const OLD_REGIME_REBATE_MAX = 12500;
export const CESS_RATE = 0.04;

export function computeSlabTax(taxableIncome: number, slabs: TaxSlab[]): number {
  let tax = 0;
  let lowerBound = 0;

  for (const slab of slabs) {
    const upperBound = slab.upTo ?? Infinity;
    if (taxableIncome <= lowerBound) break;
    const slabAmount = Math.min(taxableIncome, upperBound) - lowerBound;
    tax += Math.max(0, slabAmount) * slab.rate;
    lowerBound = upperBound;
  }

  return tax;
}

function applyRebate(tax: number, taxableIncome: number, limit: number, maxRebate: number): number {
  if (taxableIncome > limit) return tax;
  return Math.max(0, tax - Math.min(tax, maxRebate));
}

function applyCess(tax: number): number {
  return tax * (1 + CESS_RATE);
}

export interface IncomeTaxInputs {
  annualIncome: number;
  deduction80C: number;
  deduction80D: number;
  homeLoanInterest: number;
  npsContribution: number;
  hraExemption: number;
  otherDeductions: number;
}

export interface RegimeResult {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  takeHome: number;
}

export interface IncomeTaxComparison {
  oldRegime: RegimeResult;
  newRegime: RegimeResult;
  recommendedRegime: "old" | "new";
  savings: number;
}

export function calculateOldRegime(inputs: IncomeTaxInputs): RegimeResult {
  const cappedDeduction80C = Math.min(150000, Math.max(0, inputs.deduction80C));
  const cappedDeduction80D = Math.min(100000, Math.max(0, inputs.deduction80D));
  const cappedHomeLoanInterest = Math.min(200000, Math.max(0, inputs.homeLoanInterest));
  const cappedNps = Math.min(50000, Math.max(0, inputs.npsContribution));
  const otherDeductions = Math.max(0, inputs.otherDeductions);
  const hraExemption = Math.max(0, inputs.hraExemption);

  const totalDeductions =
    OLD_REGIME_STANDARD_DEDUCTION +
    cappedDeduction80C +
    cappedDeduction80D +
    cappedHomeLoanInterest +
    cappedNps +
    hraExemption +
    otherDeductions;

  const taxableIncome = Math.max(0, inputs.annualIncome - totalDeductions);
  const taxBeforeRebate = computeSlabTax(taxableIncome, OLD_REGIME_SLABS);
  const taxAfterRebate = applyRebate(
    taxBeforeRebate,
    taxableIncome,
    OLD_REGIME_REBATE_LIMIT,
    OLD_REGIME_REBATE_MAX,
  );
  const totalTax = applyCess(taxAfterRebate);

  return {
    grossIncome: inputs.annualIncome,
    standardDeduction: OLD_REGIME_STANDARD_DEDUCTION,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebate: taxBeforeRebate - taxAfterRebate,
    taxAfterRebate,
    cess: totalTax - taxAfterRebate,
    totalTax,
    effectiveRate: inputs.annualIncome > 0 ? (totalTax / inputs.annualIncome) * 100 : 0,
    takeHome: inputs.annualIncome - totalTax,
  };
}

export function calculateNewRegime(inputs: IncomeTaxInputs): RegimeResult {
  const totalDeductions = NEW_REGIME_STANDARD_DEDUCTION;
  const taxableIncome = Math.max(0, inputs.annualIncome - totalDeductions);
  const taxBeforeRebate = computeSlabTax(taxableIncome, NEW_REGIME_SLABS);
  const taxAfterRebate = applyRebate(
    taxBeforeRebate,
    taxableIncome,
    NEW_REGIME_REBATE_LIMIT,
    NEW_REGIME_REBATE_MAX,
  );
  const totalTax = applyCess(taxAfterRebate);

  return {
    grossIncome: inputs.annualIncome,
    standardDeduction: NEW_REGIME_STANDARD_DEDUCTION,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebate: taxBeforeRebate - taxAfterRebate,
    taxAfterRebate,
    cess: totalTax - taxAfterRebate,
    totalTax,
    effectiveRate: inputs.annualIncome > 0 ? (totalTax / inputs.annualIncome) * 100 : 0,
    takeHome: inputs.annualIncome - totalTax,
  };
}

export function compareRegimes(inputs: IncomeTaxInputs): IncomeTaxComparison {
  const oldRegime = calculateOldRegime(inputs);
  const newRegime = calculateNewRegime(inputs);
  const recommendedRegime = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  return { oldRegime, newRegime, recommendedRegime, savings };
}
