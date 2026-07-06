import {
  calculateFixedPayoff,
  calculateMinPaymentPayoff,
  compareCreditCardPayoff,
} from "./creditCardMath";

describe("calculateFixedPayoff", () => {
  it("pays off a zero-interest balance in balance/payment months", () => {
    const result = calculateFixedPayoff(12000, 0, 1000);
    expect(result.months).toBe(12);
    expect(result.totalInterest).toBe(0);
    expect(result.neverPaysOff).toBe(false);
  });

  it("flags balances that never pay off when payment is below the interest charge", () => {
    const result = calculateFixedPayoff(50000, 42, 1000);
    // monthly interest = 50000 * 0.42/12 = 1750, which exceeds the 1000 payment
    expect(result.neverPaysOff).toBe(true);
  });

  it("accrues interest so total paid exceeds the original balance", () => {
    const result = calculateFixedPayoff(50000, 36, 3000);
    expect(result.neverPaysOff).toBe(false);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPaid).toBeCloseTo(50000 + result.totalInterest, 0);
  });
});

describe("calculateMinPaymentPayoff", () => {
  it("takes far longer than a fixed higher payment on the same balance", () => {
    const min = calculateMinPaymentPayoff(80000, 36, 3, 500);
    const fixed = calculateFixedPayoff(80000, 36, 5000);
    expect(min.neverPaysOff || min.months > fixed.months).toBe(true);
  });
});

describe("compareCreditCardPayoff", () => {
  it("shows positive interest and time savings from paying more than the minimum", () => {
    const result = compareCreditCardPayoff({
      balance: 80000,
      apr: 36,
      monthlyPayment: 6000,
      minPaymentPercent: 3,
      minPaymentFloor: 500,
    });

    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.interestSaved).toBeGreaterThan(0);
  });
});
