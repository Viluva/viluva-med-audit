import fc from "fast-check";
import { yearsToTarget, fireNumber } from "./fireMath";

describe("Property-based: FIRE logic", () => {
  it("increasing savings never increases years to FIRE", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(1e7) }),
        fc.float({ min: Math.fround(0), max: Math.fround(1e7) }),
        fc.float({ min: Math.fround(0.01), max: Math.fround(0.2) }),
        (current, target, rate) => {
          const y1 = yearsToTarget(current, target, 100000, rate);
          const y2 = yearsToTarget(current, target, 110000, rate);
          expect(y2).toBeLessThanOrEqual(y1);
        },
      ),
    );
  });
  it("increasing return rate never increases years to FIRE", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(1e7) }),
        fc.float({ min: Math.fround(0), max: Math.fround(1e7) }),
        fc.float({ min: Math.fround(0.01), max: Math.fround(0.2) }),
        (current, target, savings) => {
          const y1 = yearsToTarget(current, target, savings, 0.05);
          const y2 = yearsToTarget(current, target, savings, 0.06);
          expect(y2).toBeLessThanOrEqual(y1);
        },
      ),
    );
  });
  it("increasing expenses increases FIRE number", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(1e7) }),
        fc.float({ min: Math.fround(0.01), max: Math.fround(10) }),
        (expenses, swr) => {
          if (swr <= 0) return true; // skip invalid withdrawal rates
          const n1 = fireNumber(expenses, swr);
          const n2 = fireNumber(expenses + 10000, swr);
          if (!isFinite(n1) || !isFinite(n2) || isNaN(n1) || isNaN(n2))
            return true; // skip invalid results
          expect(n2).toBeGreaterThanOrEqual(n1);
        },
      ),
    );
  });
});
