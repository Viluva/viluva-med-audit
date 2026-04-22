import {
  calculateSIP,
  calculateLumpsum,
  calculateSWP,
  calculateLumpsumPlusSIP,
} from "@/utils/calculators";

describe("SIP Calculator", () => {
  test("Conservative 10-year SIP", () => {
    const result = calculateSIP(5000, 10, 12);

    expect(result.totalInvested).toBe(600000);
    expect(result.returns).toBe(561695);
    expect(result.maturityAmount).toBe(1161695);
  });

  test("Aggressive 20-year SIP", () => {
    const result = calculateSIP(10000, 20, 15);

    expect(result.totalInvested).toBe(2400000);
    expect(result.returns).toBe(12759550);
    expect(result.maturityAmount).toBe(15159550);
  });

  test("Short-term 3-year SIP", () => {
    const result = calculateSIP(3000, 3, 10);

    expect(result.totalInvested).toBe(108000);
    expect(result.returns).toBe(18390);
    expect(result.maturityAmount).toBe(126390);
  });

  test("High precision test - decimal years", () => {
    const result = calculateSIP(5000, 2.5, 12);

    expect(result.totalInvested).toBe(150000);
    expect(result.returns).toBe(25664);
    expect(result.maturityAmount).toBe(175664);
  });

  test("Edge case - 0% return", () => {
    const result = calculateSIP(10000, 5, 0);

    expect(result.totalInvested).toBe(600000);
    expect(result.returns).toBe(0);
    expect(result.maturityAmount).toBe(600000);
  });

  test("Edge case - single month", () => {
    const result = calculateSIP(5000, 1 / 12, 12);

    expect(result.totalInvested).toBe(5000);
    expect(result.returns).toBe(50);
    expect(result.maturityAmount).toBe(5050);
  });

  test("Large investment - 30 years", () => {
    const result = calculateSIP(50000, 30, 12);

    expect(result.totalInvested).toBe(18000000);
    expect(result.returns).toBe(158495689);
    expect(result.maturityAmount).toBe(176495689);
  });

  test("Fractional return rate", () => {
    const result = calculateSIP(7500, 8, 13.5);

    expect(result.totalInvested).toBe(720000);
    expect(result.returns).toBe(579104);
    expect(result.maturityAmount).toBe(1299104);
  });
});

describe("Lumpsum Calculator", () => {
  test("Medium-term 5-year investment", () => {
    const result = calculateLumpsum(500000, 5, 12);

    expect(result.totalInvested).toBe(500000);
    expect(result.returns).toBe(381171);
    expect(result.maturityAmount).toBe(881171);
  });

  test("Long-term 15-year investment", () => {
    const result = calculateLumpsum(1000000, 15, 14);

    expect(result.totalInvested).toBe(1000000);
    expect(result.returns).toBe(6137938);
    expect(result.maturityAmount).toBe(7137938);
  });

  test("Conservative 2-year investment", () => {
    const result = calculateLumpsum(200000, 2, 8);

    expect(result.totalInvested).toBe(200000);
    expect(result.returns).toBe(33280);
    expect(result.maturityAmount).toBe(233280);
  });

  test("Edge case - 0% return", () => {
    const result = calculateLumpsum(100000, 10, 0);

    expect(result.totalInvested).toBe(100000);
    expect(result.returns).toBe(0);
    expect(result.maturityAmount).toBe(100000);
  });

  test("High return scenario", () => {
    const result = calculateLumpsum(250000, 7, 18);

    expect(result.totalInvested).toBe(250000);
    expect(result.returns).toBe(546368);
    expect(result.maturityAmount).toBe(796368);
  });

  test("Fractional years", () => {
    const result = calculateLumpsum(100000, 3.5, 11);

    expect(result.totalInvested).toBe(100000);
    expect(result.returns).toBe(44089);
    expect(result.maturityAmount).toBe(144089);
  });
});

describe("SWP Calculator", () => {
  test("Retirement income - growing corpus", () => {
    const result = calculateSWP(5000000, 25000, 15, 10);

    expect(result.initialInvestment).toBe(5000000);
    expect(result.totalWithdrawn).toBe(4500000);
    expect(result.finalBalance).toBe(11907839);
    expect(result.balanceDepleted).toBe(false);
  });

  test("Supplemental income", () => {
    const result = calculateSWP(2000000, 15000, 10, 12);

    expect(result.initialInvestment).toBe(2000000);
    expect(result.totalWithdrawn).toBe(1800000);
    expect(result.finalBalance).toBe(3150193);
    expect(result.balanceDepleted).toBe(false);
  });

  test("Corpus depletion scenario", () => {
    const result = calculateSWP(1000000, 12000, 10, 8);

    expect(result.initialInvestment).toBe(1000000);
    expect(result.finalBalance).toBe(24288);
    expect(result.balanceDepleted).toBe(false);
  });

  test("Edge case - withdrawal exceeds growth", () => {
    const result = calculateSWP(500000, 10000, 10, 5);

    expect(result.initialInvestment).toBe(500000);
    expect(result.balanceDepleted).toBe(true);
    expect(result.finalBalance).toBe(0);
  });

  test("Low withdrawal - corpus grows significantly", () => {
    const result = calculateSWP(3000000, 10000, 10, 12);

    expect(result.initialInvestment).toBe(3000000);
    expect(result.totalWithdrawn).toBe(1200000);
    expect(result.finalBalance).toBe(7600774);
    expect(result.balanceDepleted).toBe(false);
  });

  test("Short-term SWP - 3 years", () => {
    const result = calculateSWP(800000, 15000, 3, 9);

    expect(result.initialInvestment).toBe(800000);
    expect(result.totalWithdrawn).toBe(540000);
    expect(result.finalBalance).toBe(429626);
    expect(result.balanceDepleted).toBe(false);
  });
});

describe("Lumpsum + SIP Calculator", () => {
  test("Balanced approach", () => {
    const result = calculateLumpsumPlusSIP(200000, 5000, 10, 12);

    expect(result.lumpsumInvested).toBe(200000);
    expect(result.sipInvested).toBe(600000);
    expect(result.totalInvested).toBe(800000);
    expect(result.totalReturns).toBe(982865);
    expect(result.totalMaturity).toBe(1782865);
  });

  test("High initial investment", () => {
    const result = calculateLumpsumPlusSIP(1000000, 10000, 15, 13);

    expect(result.lumpsumInvested).toBe(1000000);
    expect(result.sipInvested).toBe(1800000);
    expect(result.totalInvested).toBe(2800000);
    expect(result.totalReturns).toBe(9011083);
    expect(result.totalMaturity).toBe(11811083);
  });

  test("Small lumpsum with aggressive SIP", () => {
    const result = calculateLumpsumPlusSIP(50000, 15000, 7, 14);

    expect(result.lumpsumInvested).toBe(50000);
    expect(result.sipInvested).toBe(1260000);
    expect(result.totalInvested).toBe(1310000);
    expect(result.totalReturns).toBe(960491);
    expect(result.totalMaturity).toBe(2270491);
  });

  test("Only lumpsum - 0 SIP", () => {
    const result = calculateLumpsumPlusSIP(1000000, 0, 10, 12);

    expect(result.lumpsumInvested).toBe(1000000);
    expect(result.sipInvested).toBe(0);
    expect(result.totalInvested).toBe(1000000);
    expect(result.totalMaturity).toBe(3105848);
  });

  test("Only SIP - 0 lumpsum", () => {
    const result = calculateLumpsumPlusSIP(0, 10000, 10, 12);

    expect(result.lumpsumInvested).toBe(0);
    expect(result.sipInvested).toBe(1200000);
    expect(result.totalInvested).toBe(1200000);
    expect(result.totalMaturity).toBe(2323391);
  });

  test("Equal lumpsum and total SIP", () => {
    const result = calculateLumpsumPlusSIP(600000, 5000, 10, 11);

    expect(result.lumpsumInvested).toBe(600000);
    expect(result.sipInvested).toBe(600000);
    expect(result.totalInvested).toBe(1200000);
    expect(result.totalReturns).toBe(1598589);
    expect(result.totalMaturity).toBe(2798589);
  });
});
