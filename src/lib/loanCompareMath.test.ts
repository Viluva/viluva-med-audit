import { calculateLoanEMI, evaluateLoanOffer, compareLoanOffers } from "./loanCompareMath";

describe("calculateLoanEMI", () => {
  it("divides evenly for a zero-interest loan", () => {
    expect(calculateLoanEMI(120000, 0, 12)).toBeCloseTo(10000);
  });

  it("produces a higher EMI as the rate increases", () => {
    const lowRateEMI = calculateLoanEMI(1000000, 8, 240);
    const highRateEMI = calculateLoanEMI(1000000, 10, 240);
    expect(highRateEMI).toBeGreaterThan(lowRateEMI);
  });
});

describe("evaluateLoanOffer", () => {
  it("includes the processing fee in total cost but not total payment", () => {
    const result = evaluateLoanOffer({
      principal: 1000000,
      annualRate: 8.5,
      tenureMonths: 240,
      processingFeePercent: 1,
    });
    expect(result.processingFee).toBeCloseTo(10000);
    expect(result.totalCost).toBeCloseTo(result.totalPayment + 10000);
  });
});

describe("compareLoanOffers", () => {
  it("prefers the offer with a lower rate when tenure is equal", () => {
    const result = compareLoanOffers(
      { principal: 3000000, annualRate: 8.5, tenureMonths: 240, processingFeePercent: 0.5 },
      { principal: 3000000, annualRate: 9.5, tenureMonths: 240, processingFeePercent: 0.5 },
    );
    expect(result.cheaperOffer).toBe("A");
    expect(result.totalCostDifference).toBeGreaterThan(0);
  });

  it("can prefer a higher-rate, shorter-tenure offer if total cost is lower", () => {
    const result = compareLoanOffers(
      { principal: 500000, annualRate: 14, tenureMonths: 240, processingFeePercent: 0 },
      { principal: 500000, annualRate: 15, tenureMonths: 36, processingFeePercent: 0 },
    );
    expect(result.cheaperOffer).toBe("B");
  });
});
