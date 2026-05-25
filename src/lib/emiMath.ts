// ─────────────────────────────────────────────────────────────────────────────
// EMI True Cost Calculator
// Handles both genuine interest-bearing EMIs and "0% EMI" (processing fee model)
// ─────────────────────────────────────────────────────────────────────────────

export interface EMIInputs {
  productPrice: number;
  downPayment: number;       // 0 if none
  tenureMonths: number;
  annualInterestRate: number; // 0 for "0% EMI" offers
  processingFeePercent: number; // upfront fee on loan amount (common in 0% EMI)
}

export interface EMIResult {
  loanAmount: number;
  monthlyEMI: number;
  totalPaid: number;          // down payment + all EMIs
  totalInterest: number;      // interest + processing fee cost
  processingFee: number;
  effectiveAnnualRate: number; // true APR including processing fee
  costPremiumPercent: number;  // how much more than list price you actually pay
  monthlyBurdenPercent: number | null; // only populated when income is passed in
  breakdownByMonth: EMIMonth[];
}

export interface EMIMonth {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

// Newton-Raphson to solve for IRR of cash flows → effective APR
function solveIRR(cashFlows: number[]): number {
  let rate = 0.01;
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dnpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(dnpv) < 1e-10) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-8) break;
    rate = Math.max(0, newRate);
  }
  return rate;
}

export function calculateEMI(inputs: EMIInputs, monthlyIncome?: number): EMIResult {
  const { productPrice, downPayment, tenureMonths, annualInterestRate, processingFeePercent } = inputs;

  const dp = Math.max(0, Math.min(downPayment, productPrice));
  const loanAmount = productPrice - dp;
  const processingFee = loanAmount * (processingFeePercent / 100);
  const monthlyRate = annualInterestRate / 100 / 12;

  // EMI formula: P × r × (1+r)^n / ((1+r)^n - 1)
  // If 0% interest: simple division
  let monthlyEMI: number;
  if (monthlyRate === 0) {
    monthlyEMI = loanAmount / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyEMI = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  // Build month-by-month schedule
  const breakdownByMonth: EMIMonth[] = [];
  let balance = loanAmount;
  for (let m = 1; m <= tenureMonths; m++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = monthlyEMI - interestForMonth;
    balance = Math.max(0, balance - principalForMonth);
    breakdownByMonth.push({
      month: m,
      emi: monthlyEMI,
      principal: principalForMonth,
      interest: interestForMonth,
      balance,
    });
  }

  const totalEMIPaid = monthlyEMI * tenureMonths;
  const totalPaid = dp + totalEMIPaid + processingFee;
  const totalInterest = totalPaid - productPrice;

  // Effective APR: model cash flows
  // t=0: receive loan net of processing fee (negative from lender perspective)
  // t=1..n: pay EMI each month
  const cashFlows = [-(loanAmount - processingFee)];
  for (let m = 0; m < tenureMonths; m++) cashFlows.push(monthlyEMI);
  const monthlyIRR = loanAmount > 0 && processingFee > 0 ? solveIRR(cashFlows) : monthlyRate;
  const effectiveAnnualRate = (Math.pow(1 + monthlyIRR, 12) - 1) * 100;

  const costPremiumPercent =
    productPrice > 0 ? (totalInterest / productPrice) * 100 : 0;

  const monthlyBurdenPercent =
    monthlyIncome && monthlyIncome > 0
      ? (monthlyEMI / monthlyIncome) * 100
      : null;

  return {
    loanAmount,
    monthlyEMI,
    totalPaid,
    totalInterest,
    processingFee,
    effectiveAnnualRate,
    costPremiumPercent,
    monthlyBurdenPercent,
    breakdownByMonth,
  };
}

export interface BuyVsInvestResult {
  purchaseDepreciatedValue: number;   // rough resale value
  investmentFutureValue: number;
  opportunityCost: number;            // investmentFV - purchase price
  totalTrueCost: number;              // purchase price + opportunity cost
  yearlySeries: BuyVsInvestYear[];
}

export interface BuyVsInvestYear {
  year: number;
  purchaseValue: number;
  investmentValue: number;
  invested: number;
}

export function calculateBuyVsInvest(
  purchasePrice: number,
  years: number,
  annualReturnRate: number,  // %
  annualDepreciationRate: number // % e.g. 15 for 15%
): BuyVsInvestResult {
  const r = annualReturnRate / 100;
  const d = annualDepreciationRate / 100;

  const investmentFutureValue = purchasePrice * Math.pow(1 + r, years);
  const purchaseDepreciatedValue = purchasePrice * Math.pow(1 - d, years);
  const opportunityCost = investmentFutureValue - purchasePrice;
  const totalTrueCost = purchasePrice + opportunityCost;

  const yearlySeries: BuyVsInvestYear[] = [];
  for (let y = 0; y <= years; y++) {
    yearlySeries.push({
      year: y,
      purchaseValue: Math.round(purchasePrice * Math.pow(1 - d, y)),
      investmentValue: Math.round(purchasePrice * Math.pow(1 + r, y)),
      invested: purchasePrice,
    });
  }

  return {
    purchaseDepreciatedValue: Math.round(purchaseDepreciatedValue),
    investmentFutureValue: Math.round(investmentFutureValue),
    opportunityCost: Math.round(opportunityCost),
    totalTrueCost: Math.round(totalTrueCost),
    yearlySeries,
  };
}
