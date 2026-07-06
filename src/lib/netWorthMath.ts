export interface NetWorthInputs {
  cashSavings: number;
  investments: number;
  retirementAccounts: number;
  realEstate: number;
  otherAssets: number;
  homeLoan: number;
  vehicleLoan: number;
  creditCardDebt: number;
  otherLoans: number;
}

export type LeverageBand = "strong" | "moderate" | "leveraged";

export interface BreakdownItem {
  label: string;
  value: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  debtToAssetRatio: number;
  leverageBand: LeverageBand;
  assetBreakdown: BreakdownItem[];
  liabilityBreakdown: BreakdownItem[];
}

function nonNegative(value: number): number {
  return Math.max(0, value || 0);
}

function getLeverageBand(ratio: number): LeverageBand {
  if (ratio <= 30) return "strong";
  if (ratio <= 60) return "moderate";
  return "leveraged";
}

export function calculateNetWorth(inputs: NetWorthInputs): NetWorthResult {
  const cashSavings = nonNegative(inputs.cashSavings);
  const investments = nonNegative(inputs.investments);
  const retirementAccounts = nonNegative(inputs.retirementAccounts);
  const realEstate = nonNegative(inputs.realEstate);
  const otherAssets = nonNegative(inputs.otherAssets);

  const homeLoan = nonNegative(inputs.homeLoan);
  const vehicleLoan = nonNegative(inputs.vehicleLoan);
  const creditCardDebt = nonNegative(inputs.creditCardDebt);
  const otherLoans = nonNegative(inputs.otherLoans);

  const totalAssets = cashSavings + investments + retirementAccounts + realEstate + otherAssets;
  const totalLiabilities = homeLoan + vehicleLoan + creditCardDebt + otherLoans;
  const netWorth = totalAssets - totalLiabilities;
  const liquidAssets = cashSavings + investments;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    debtToAssetRatio,
    leverageBand: getLeverageBand(debtToAssetRatio),
    assetBreakdown: [
      { label: "Cash & Savings", value: cashSavings },
      { label: "Investments", value: investments },
      { label: "Retirement Accounts", value: retirementAccounts },
      { label: "Real Estate", value: realEstate },
      { label: "Other Assets", value: otherAssets },
    ].filter((item) => item.value > 0),
    liabilityBreakdown: [
      { label: "Home Loan", value: homeLoan },
      { label: "Vehicle Loan", value: vehicleLoan },
      { label: "Credit Card Debt", value: creditCardDebt },
      { label: "Other Loans", value: otherLoans },
    ].filter((item) => item.value > 0),
  };
}
