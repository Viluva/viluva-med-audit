// lib/timeConverter.ts
export interface UserIncomeData {
  monthlyNetIncome: number;
  hoursWorkedPerWeek: number;
}

export interface ConversionResult {
  totalHours: number;
  formattedTime: string;
  shareableQuote: string;
}

export function calculateTimeCost(price: number, incomeData: UserIncomeData, itemName: string = "this item"): ConversionResult {
  const monthlyHoursWorked = incomeData.hoursWorkedPerWeek * 4.33;
  const trueHourlyWage = incomeData.monthlyNetIncome / monthlyHoursWorked;
  const totalHours = price / trueHourlyWage;

  const workingDays = Math.floor(totalHours / 8);
  const remainingHours = Math.round(totalHours % 8);

  let formattedTime = "";
  if (workingDays > 0) formattedTime += `${workingDays} working days `;
  if (remainingHours > 0 || workingDays === 0) formattedTime += `${remainingHours} hours`;

  const shareableQuote = `Is ${itemName} really worth ${formattedTime.trim()} of your life? 🤔 Find out your true purchase power with Viluva AI.`;

  return {
    totalHours: Number(totalHours.toFixed(2)),
    formattedTime: formattedTime.trim(),
    shareableQuote
  };
}