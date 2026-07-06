import {
  computeSlabTax,
  calculateNewRegime,
  calculateOldRegime,
  compareRegimes,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
} from "./incomeTaxMath";

const baseInputs = {
  annualIncome: 0,
  deduction80C: 0,
  deduction80D: 0,
  homeLoanInterest: 0,
  npsContribution: 0,
  hraExemption: 0,
  otherDeductions: 0,
};

describe("computeSlabTax", () => {
  it("returns 0 for income within the nil slab", () => {
    expect(computeSlabTax(300000, NEW_REGIME_SLABS)).toBe(0);
  });

  it("taxes only the portion within each slab", () => {
    expect(computeSlabTax(900000, OLD_REGIME_SLABS)).toBeCloseTo(
      250000 * 0 + 250000 * 0.05 + 400000 * 0.2,
    );
  });

  it("applies the top slab rate above the last threshold", () => {
    expect(computeSlabTax(3000000, OLD_REGIME_SLABS)).toBeCloseTo(
      250000 * 0 + 250000 * 0.05 + 500000 * 0.2 + 2000000 * 0.3,
    );
  });
});

describe("calculateNewRegime", () => {
  it("is fully rebated at the ₹12L taxable income boundary", () => {
    const result = calculateNewRegime({ ...baseInputs, annualIncome: 1275000 });
    expect(result.taxableIncome).toBe(1200000);
    expect(result.totalTax).toBe(0);
  });

  it("charges tax once taxable income exceeds the rebate limit", () => {
    const result = calculateNewRegime({ ...baseInputs, annualIncome: 1276000 });
    expect(result.taxableIncome).toBe(1201000);
    expect(result.totalTax).toBeGreaterThan(0);
  });

  it("applies standard deduction before computing tax", () => {
    const result = calculateNewRegime({ ...baseInputs, annualIncome: 2000000 });
    expect(result.taxableIncome).toBe(2000000 - 75000);
  });
});

describe("calculateOldRegime", () => {
  it("caps section 80C at 1.5L even if more is entered", () => {
    const result = calculateOldRegime({
      ...baseInputs,
      annualIncome: 1000000,
      deduction80C: 500000,
    });
    expect(result.totalDeductions).toBe(50000 + 150000);
  });

  it("is fully rebated at the ₹5L taxable income boundary", () => {
    const result = calculateOldRegime({ ...baseInputs, annualIncome: 550000 });
    expect(result.taxableIncome).toBe(500000);
    expect(result.totalTax).toBe(0);
  });
});

describe("compareRegimes", () => {
  it("recommends the new regime when there are few deductions", () => {
    const result = compareRegimes({ ...baseInputs, annualIncome: 1200000 });
    expect(result.recommendedRegime).toBe("new");
  });

  it("recommends the old regime when deductions are large enough", () => {
    const result = compareRegimes({
      ...baseInputs,
      annualIncome: 1800000,
      deduction80C: 150000,
      deduction80D: 50000,
      homeLoanInterest: 200000,
      hraExemption: 300000,
    });
    expect(result.recommendedRegime).toBe("old");
  });

  it("reports the absolute tax savings between regimes", () => {
    const result = compareRegimes({ ...baseInputs, annualIncome: 1200000 });
    expect(result.savings).toBeCloseTo(
      Math.abs(result.oldRegime.totalTax - result.newRegime.totalTax),
    );
  });
});
