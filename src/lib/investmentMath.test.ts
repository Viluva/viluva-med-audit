import {
  buildInvestmentProjectionSeries,
  calculateCombinedFutureValue,
  calculateLumpsumFutureValue,
  calculateRequiredCorpusForSwp,
  calculateSipFutureValue,
  calculateSwpPlan,
} from "./investmentMath";

describe("investmentMath", () => {
  it("calculates SIP future value with monthly compounding", () => {
    expect(calculateSipFutureValue(10000, 0.12, 10)).toBeCloseTo(2323390.76, 2);
  });

  it("calculates lumpsum future value with annual compounding", () => {
    expect(calculateLumpsumFutureValue(500000, 0.12, 10)).toBeCloseTo(
      1552924.1,
      2,
    );
  });

  it("calculates combined future value as the sum of lumpsum and SIP growth", () => {
    expect(calculateCombinedFutureValue(500000, 10000, 0.12, 10)).toBeCloseTo(
      3876314.87,
      2,
    );
  });

  it("builds an investment projection series with increasing values", () => {
    const series = buildInvestmentProjectionSeries(500000, 10000, 0.12, 3);

    expect(series).toHaveLength(4);
    expect(series[0]).toEqual({
      year: 0,
      invested: 500000,
      value: 500000,
      gains: 0,
    });
    expect(series[3].value).toBeGreaterThan(series[2].value);
    expect(series[3].gains).toBeGreaterThan(0);
  });

  it("calculates required corpus for a full SWP horizon", () => {
    expect(calculateRequiredCorpusForSwp(15000, 0.08, 20)).toBeCloseTo(
      1793314.38,
      0,
    );
  });

  it("calculates SWP sustainability and depletion month", () => {
    const sustainablePlan = calculateSwpPlan(2000000, 15000, 0.08, 20);
    expect(sustainablePlan.depletionMonth).toBeNull();
    expect(sustainablePlan.endingBalance).toBeGreaterThan(1000000);

    const stressedPlan = calculateSwpPlan(1000000, 20000, 0.06, 10);
    expect(stressedPlan.depletionMonth).toBe(58);
    expect(stressedPlan.endingBalance).toBe(0);
  });
});
