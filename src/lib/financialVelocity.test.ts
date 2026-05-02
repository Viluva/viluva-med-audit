import { calculateFinancialVelocityScore } from "./financialVelocity";

describe("calculateFinancialVelocityScore", () => {
  it("applies weighted formula and normalization", () => {
    const result = calculateFinancialVelocityScore({
      drag: 20,
      fuel: 40,
      runway: 6,
      leak: 2,
    });

    expect(result.rawScore).toBe(74);
    expect(result.normalizedScore).toBe(51);
  });

  it("clamps low and high scores to the 0-100 range", () => {
    const low = calculateFinancialVelocityScore({
      drag: 100,
      fuel: 0,
      runway: 0,
      leak: 10,
    });

    const high = calculateFinancialVelocityScore({
      drag: 0,
      fuel: 100,
      runway: 24,
      leak: 0,
    });

    expect(low.normalizedScore).toBe(0);
    expect(high.normalizedScore).toBe(100);
  });

  it("bounds out-of-range inputs before scoring", () => {
    const bounded = calculateFinancialVelocityScore({
      drag: -50,
      fuel: 140,
      runway: 60,
      leak: -3,
    });

    expect(bounded.rawScore).toBe(320);
    expect(bounded.normalizedScore).toBe(100);
  });
});
