export interface InvestmentProjectionPoint {
  year: number;
  invested: number;
  value: number;
  gains: number;
}

export interface SwpProjectionPoint {
  year: number;
  balance: number;
  totalWithdrawn: number;
}

export interface SwpPlan {
  endingBalance: number;
  totalWithdrawn: number;
  depletionMonth: number | null;
  series: SwpProjectionPoint[];
}

const MONTHS_IN_YEAR = 12;

function clampMoney(amount: number): number {
  return Math.max(0, amount);
}

function normalizeMonths(years: number): number {
  return Math.max(0, Math.round(years * MONTHS_IN_YEAR));
}

function monthlyRate(annualRate: number): number {
  return annualRate / MONTHS_IN_YEAR;
}

export function calculateLumpsumFutureValue(
  initialInvestment: number,
  annualRate: number,
  years: number,
): number {
  const principal = clampMoney(initialInvestment);
  const yearsValue = Math.max(0, years);
  const rate = Math.max(annualRate, 0);

  if (principal === 0 || yearsValue === 0) {
    return principal;
  }

  if (rate === 0) {
    return principal;
  }

  return principal * Math.pow(1 + rate, yearsValue);
}

export function calculateSipFutureValue(
  monthlyInvestment: number,
  annualRate: number,
  years: number,
): number {
  const contribution = clampMoney(monthlyInvestment);
  const months = normalizeMonths(years);
  const rate = monthlyRate(Math.max(annualRate, 0));

  if (contribution === 0 || months === 0) {
    return 0;
  }

  if (rate === 0) {
    return contribution * months;
  }

  return (
    contribution * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate))
  );
}

export function calculateCombinedFutureValue(
  initialInvestment: number,
  monthlyInvestment: number,
  annualRate: number,
  years: number,
): number {
  return (
    calculateLumpsumFutureValue(initialInvestment, annualRate, years) +
    calculateSipFutureValue(monthlyInvestment, annualRate, years)
  );
}

export function buildInvestmentProjectionSeries(
  initialInvestment: number,
  monthlyInvestment: number,
  annualRate: number,
  years: number,
): InvestmentProjectionPoint[] {
  const totalYears = Math.max(0, Math.floor(years));
  const contribution = clampMoney(monthlyInvestment);
  const principal = clampMoney(initialInvestment);

  const series: InvestmentProjectionPoint[] = [
    {
      year: 0,
      invested: Math.round(principal),
      value: Math.round(principal),
      gains: 0,
    },
  ];

  for (let year = 1; year <= totalYears; year += 1) {
    const invested = principal + contribution * MONTHS_IN_YEAR * year;
    const value =
      calculateLumpsumFutureValue(principal, annualRate, year) +
      calculateSipFutureValue(contribution, annualRate, year);

    series.push({
      year,
      invested: Math.round(invested),
      value: Math.round(value),
      gains: Math.round(value - invested),
    });
  }

  return series;
}

export function calculateRequiredCorpusForSwp(
  monthlyWithdrawal: number,
  annualRate: number,
  years: number,
): number {
  const withdrawal = clampMoney(monthlyWithdrawal);
  const months = normalizeMonths(years);
  const rate = monthlyRate(Math.max(annualRate, 0));

  if (withdrawal === 0 || months === 0) {
    return 0;
  }

  if (rate === 0) {
    return withdrawal * months;
  }

  return withdrawal * ((1 - Math.pow(1 + rate, -months)) / rate);
}

export function calculateSwpPlan(
  initialCorpus: number,
  monthlyWithdrawal: number,
  annualRate: number,
  years: number,
): SwpPlan {
  const corpus = clampMoney(initialCorpus);
  const withdrawal = clampMoney(monthlyWithdrawal);
  const months = normalizeMonths(years);
  const rate = monthlyRate(Math.max(annualRate, 0));

  let balance = corpus;
  let totalWithdrawn = 0;
  let depletionMonth: number | null = null;

  const series: SwpProjectionPoint[] = [
    { year: 0, balance: Math.round(balance), totalWithdrawn: 0 },
  ];

  for (let month = 1; month <= months; month += 1) {
    if (rate > 0) {
      balance *= 1 + rate;
    }

    const withdrawalThisMonth = Math.min(withdrawal, balance);
    balance -= withdrawalThisMonth;
    totalWithdrawn += withdrawalThisMonth;

    if (balance <= 0) {
      depletionMonth = month;
      balance = 0;
    }

    if (month % MONTHS_IN_YEAR === 0 || depletionMonth !== null) {
      series.push({
        year: Number((month / MONTHS_IN_YEAR).toFixed(1)),
        balance: Math.round(balance),
        totalWithdrawn: Math.round(totalWithdrawn),
      });
    }

    if (depletionMonth !== null) {
      break;
    }
  }

  return {
    endingBalance: Math.round(balance),
    totalWithdrawn: Math.round(totalWithdrawn),
    depletionMonth,
    series,
  };
}
