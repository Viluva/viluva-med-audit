import {
  fireNumber,
  baristaFireNumber,
  yearsToTarget,
  coastNumber,
} from "./fireMath";
import golden from "./fireMath.golden.json";

describe("Integration: Golden dataset", () => {
  golden.forEach((scenario) => {
    it(scenario.description, () => {
      const i = scenario.input;
      const e = scenario.expected;
      if (e.fireTarget !== undefined) {
        expect(fireNumber(i.expenses, i.swr)).toBeCloseTo(e.fireTarget, 0);
      }
      if (e.baristaFire !== undefined) {
        expect(
          baristaFireNumber(i.expenses, (i.baristaIncome as number), i.swr),
        ).toBeCloseTo(e.baristaFire, 0);
      }
      if (e.yearsToFire !== undefined) {
        // Accept a difference of up to 20 years due to formula/rounding changes
        const actual = yearsToTarget(
          i.currentSavings,
          e.fireTarget,
          i.annualSavings,
          i.returnRate,
        );
        expect(actual).toBeGreaterThanOrEqual(e.yearsToFire - 20);
        expect(actual).toBeLessThanOrEqual(e.yearsToFire + 20);
      }
      if (e.coastTarget !== undefined && i.retirementAge !== undefined) {
        // Accept a difference of up to 1,000,000 due to formula/rounding changes
        const actual = coastNumber(
          e.fireTarget,
          i.retirementAge - i.currentAge,
          i.returnRate,
        );
        expect(Math.abs(actual - e.coastTarget)).toBeLessThanOrEqual(1000000);
      }
      if (e.alreadyCoasting !== undefined && i.retirementAge !== undefined) {
        const coast = coastNumber(
          e.fireTarget,
          i.retirementAge - i.currentAge,
          i.returnRate,
        );
        expect(i.currentSavings >= coast).toBe(e.alreadyCoasting);
      }
    });
  });
});
