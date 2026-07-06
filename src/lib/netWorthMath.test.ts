import { calculateNetWorth } from "./netWorthMath";

const baseInputs = {
  cashSavings: 0,
  investments: 0,
  retirementAccounts: 0,
  realEstate: 0,
  otherAssets: 0,
  homeLoan: 0,
  vehicleLoan: 0,
  creditCardDebt: 0,
  otherLoans: 0,
};

describe("calculateNetWorth", () => {
  it("computes net worth as assets minus liabilities", () => {
    const result = calculateNetWorth({
      ...baseInputs,
      cashSavings: 500000,
      investments: 1000000,
      homeLoan: 2000000,
    });
    expect(result.totalAssets).toBe(1500000);
    expect(result.totalLiabilities).toBe(2000000);
    expect(result.netWorth).toBe(-500000);
  });

  it("allows negative net worth when liabilities exceed assets", () => {
    const result = calculateNetWorth({ ...baseInputs, creditCardDebt: 50000 });
    expect(result.netWorth).toBe(-50000);
  });

  it("treats negative inputs as zero", () => {
    const result = calculateNetWorth({ ...baseInputs, cashSavings: -1000 });
    expect(result.totalAssets).toBe(0);
  });

  it("classifies leverage bands from the debt-to-asset ratio", () => {
    const strong = calculateNetWorth({ ...baseInputs, investments: 1000000, homeLoan: 100000 });
    const leveraged = calculateNetWorth({ ...baseInputs, investments: 1000000, homeLoan: 900000 });
    expect(strong.leverageBand).toBe("strong");
    expect(leveraged.leverageBand).toBe("leveraged");
  });

  it("excludes zero-value categories from the breakdown", () => {
    const result = calculateNetWorth({ ...baseInputs, cashSavings: 10000 });
    expect(result.assetBreakdown).toEqual([{ label: "Cash & Savings", value: 10000 }]);
    expect(result.liabilityBreakdown).toEqual([]);
  });
});
