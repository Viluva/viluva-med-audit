// src/lib/fireMath.ts
// Pure, deterministic financial calculation functions for FIRE calculators

export function fireNumber(expenses: number, swr: number): number {
  if (swr <= 0) throw new Error("Withdrawal rate must be positive");
  return expenses / (swr / 100);
}

export function baristaFireNumber(
  expenses: number,
  baristaIncome: number,
  swr: number,
): number {
  if (swr <= 0) throw new Error("Withdrawal rate must be positive");
  return Math.max(0, expenses - baristaIncome) / (swr / 100);
}

export function yearsToTarget(
  current: number,
  target: number,
  annualSaving: number,
  rate: number,
): number {
  if (current >= target) return 0;
  if (annualSaving <= 0 && rate <= 0) return Infinity;
  let lo = 0,
    hi = 200;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const fv =
      current * Math.pow(1 + rate, mid) +
      (rate > 0
        ? annualSaving * ((Math.pow(1 + rate, mid) - 1) / rate)
        : annualSaving * mid);
    if (fv >= target) hi = mid;
    else lo = mid;
  }
  return Math.ceil(hi);
}

export function coastNumber(
  fullFire: number,
  yearsToRetirement: number,
  returnRate: number,
): number {
  if (yearsToRetirement <= 0) return fullFire;
  return fullFire / Math.pow(1 + returnRate, yearsToRetirement);
}

export function yearsToCoastAlone(
  current: number,
  target: number,
  rate: number,
): number {
  if (current <= 0 || rate <= 0) return Infinity;
  if (current >= target) return 0;
  return Math.log(target / current) / Math.log(1 + rate);
}

export function buildGrowthSeries(
  current: number,
  annualSaving: number,
  rate: number,
  maxYears: number,
  startAge: number,
): { age: number; portfolio: number }[] {
  const data: { age: number; portfolio: number }[] = [];
  let pv = current;
  for (let y = 0; y <= maxYears; y++) {
    data.push({ age: startAge + y, portfolio: Math.round(pv) });
    pv = pv * (1 + rate) + annualSaving;
  }
  return data;
}

export function buildCoastSeries(
  current: number,
  annualSaving: number,
  rate: number,
  coastTarget: number,
  fullFireTarget: number,
  startAge: number,
  retirementAge: number,
): { age: number; portfolio: number; phase: "accumulate" | "coast" }[] {
  const data: {
    age: number;
    portfolio: number;
    phase: "accumulate" | "coast";
  }[] = [];
  let pv = current;
  const maxAge = retirementAge + 5;
  for (let y = 0; y <= maxAge - startAge; y++) {
    const age = startAge + y;
    const reachedCoast = pv >= coastTarget;
    const phase: "accumulate" | "coast" = reachedCoast ? "coast" : "accumulate";
    data.push({ age, portfolio: Math.round(pv), phase });
    if (reachedCoast) {
      pv = pv * (1 + rate); // coast — no contributions
    } else {
      pv = pv * (1 + rate) + annualSaving;
    }
  }
  return data;
}
