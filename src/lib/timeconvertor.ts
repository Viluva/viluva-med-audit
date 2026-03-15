// lib/timeConverter.ts
export interface UserIncomeData {
  monthlyNetIncome: number;
  hoursWorkedPerWeek: number;
}

export interface FutureWealthData {
  futureValue: number;
  lostGains: number;
  growthMultiple: number;
  returnRate: number;
  years: number;
}

export interface ConversionResult {
  totalHours: number;
  formattedTime: string;
  shareableQuote: string;
  futureWealth: FutureWealthData;
  impactLevel: "low" | "moderate" | "high";
  verdict: string;
  suggestion: string;
}

export function calculateFutureWealth(
  price: number,
  returnRate: number = 0.08,
  years: number = 20,
): FutureWealthData {
  const futureValue = price * Math.pow(1 + returnRate, years);
  const lostGains = futureValue - price;
  const growthMultiple = futureValue / price;

  return {
    futureValue: Math.round(futureValue),
    lostGains: Math.round(lostGains),
    growthMultiple: Number(growthMultiple.toFixed(1)),
    returnRate,
    years,
  };
}

export function calculateTimeCost(
  price: number,
  incomeData: UserIncomeData,
  itemName: string = "this item",
  returnRate: number = 0.08,
  years: number = 20,
): ConversionResult {
  const monthlyHoursWorked = incomeData.hoursWorkedPerWeek * 4.33;
  const trueHourlyWage = incomeData.monthlyNetIncome / monthlyHoursWorked;
  const totalHours = price / trueHourlyWage;

  const workingDays = Math.floor(totalHours / 8);
  const remainingHours = Math.round(totalHours % 8);

  let formattedTime = "";
  if (workingDays > 0) formattedTime += `${workingDays} working days `;
  if (remainingHours > 0 || workingDays === 0)
    formattedTime += `${remainingHours} hours`;

  const shareableQuote = `Is ${itemName} really worth ${formattedTime.trim()} of your life? 🤔 Find out your true purchase power with Viluva AI.`;

  // Calculate future wealth
  const futureWealth = calculateFutureWealth(price, returnRate, years);

  // Determine impact level
  let impactLevel: "low" | "moderate" | "high";
  let verdict: string;
  let suggestion: string;

  if (futureWealth.growthMultiple >= 4) {
    impactLevel = "high";
    verdict = "⚠️ HIGH IMPACT: This purchase costs 4x+ in future wealth";
    suggestion =
      "Consider waiting 48 hours, buying used, or exploring alternatives";
  } else if (futureWealth.growthMultiple >= 2.5) {
    impactLevel = "moderate";
    verdict = "⚡ MODERATE IMPACT: Noticeable opportunity cost";
    suggestion = "Ensure this purchase aligns with your financial priorities";
  } else {
    impactLevel = "low";
    verdict = "✅ REASONABLE: Low long-term impact";
    suggestion = "This won't significantly affect your wealth trajectory";
  }

  return {
    totalHours: Number(totalHours.toFixed(2)),
    formattedTime: formattedTime.trim(),
    shareableQuote,
    futureWealth,
    impactLevel,
    verdict,
    suggestion,
  };
}
