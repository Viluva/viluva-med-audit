/**
 * SIP Calculator with high precision
 * Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
 */
export function calculateSIP(
  monthlyInvestment: number,
  years: number,
  annualRate: number,
) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const maturityAmount = monthlyInvestment * months;
    return {
      totalInvested: Math.round(maturityAmount),
      returns: 0,
      maturityAmount: Math.round(maturityAmount),
    };
  }

  const maturityAmount =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate));

  const totalInvested = monthlyInvestment * months;
  const returns = maturityAmount - totalInvested;

  return {
    totalInvested: Math.round(totalInvested),
    returns: Math.round(returns),
    maturityAmount: Math.round(maturityAmount),
  };
}

/**
 * Lumpsum Calculator with annual compounding
 * Formula: FV = P × (1 + r)^n
 */
export function calculateLumpsum(
  principal: number,
  years: number,
  annualRate: number,
) {
  const rate = annualRate / 100;
  const maturityAmount = principal * Math.pow(1 + rate, years);
  const returns = maturityAmount - principal;

  return {
    totalInvested: Math.round(principal),
    returns: Math.round(returns),
    maturityAmount: Math.round(maturityAmount),
  };
}

/**
 * SWP Calculator with iterative month-by-month calculation
 * Each month: Balance = (Previous Balance × (1 + r)) - Withdrawal
 */
export function calculateSWP(
  initialInvestment: number,
  monthlyWithdrawal: number,
  years: number,
  annualRate: number,
) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  let balance = initialInvestment;

  for (let i = 0; i < months; i += 1) {
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal;

    if (balance < 0) {
      balance = 0;
      break;
    }
  }

  const totalWithdrawn = monthlyWithdrawal * months;

  return {
    initialInvestment: Math.round(initialInvestment),
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    balanceDepleted: balance === 0,
  };
}

/**
 * Combined Lumpsum + SIP Calculator
 */
export function calculateLumpsumPlusSIP(
  lumpsum: number,
  monthlySIP: number,
  years: number,
  annualRate: number,
) {
  const lumpsumResult = calculateLumpsum(lumpsum, years, annualRate);
  const sipResult = calculateSIP(monthlySIP, years, annualRate);

  return {
    lumpsumInvested: lumpsum,
    sipInvested: sipResult.totalInvested,
    totalInvested: lumpsum + sipResult.totalInvested,
    lumpsumReturns: lumpsumResult.returns,
    sipReturns: sipResult.returns,
    totalReturns: lumpsumResult.returns + sipResult.returns,
    lumpsumMaturity: lumpsumResult.maturityAmount,
    sipMaturity: sipResult.maturityAmount,
    totalMaturity: lumpsumResult.maturityAmount + sipResult.maturityAmount,
  };
}

/**
 * Helper function to format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
