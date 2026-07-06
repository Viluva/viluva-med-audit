export interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  neverPaysOff: boolean;
}

const MAX_MONTHS = 1200;

function simulatePayoff(
  balance: number,
  monthlyRate: number,
  getPayment: (remainingBalance: number) => number,
): PayoffResult {
  let remaining = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (remaining > 0.01 && months < MAX_MONTHS) {
    const interest = remaining * monthlyRate;
    const proposedPayment = getPayment(remaining);

    if (proposedPayment <= interest) {
      return { months, totalInterest, totalPaid, neverPaysOff: true };
    }

    const payment = Math.min(proposedPayment, remaining + interest);
    const principal = payment - interest;

    remaining -= principal;
    totalInterest += interest;
    totalPaid += payment;
    months += 1;
  }

  return { months, totalInterest, totalPaid, neverPaysOff: remaining > 0.01 };
}

export function calculateFixedPayoff(
  balance: number,
  apr: number,
  monthlyPayment: number,
): PayoffResult {
  const monthlyRate = apr / 100 / 12;
  return simulatePayoff(Math.max(0, balance), monthlyRate, () => Math.max(0, monthlyPayment));
}

export function calculateMinPaymentPayoff(
  balance: number,
  apr: number,
  minPaymentPercent: number,
  minPaymentFloor: number,
): PayoffResult {
  const monthlyRate = apr / 100 / 12;
  return simulatePayoff(Math.max(0, balance), monthlyRate, (remaining) =>
    Math.max(minPaymentFloor, remaining * (minPaymentPercent / 100)),
  );
}

export interface CreditCardInputs {
  balance: number;
  apr: number;
  monthlyPayment: number;
  minPaymentPercent: number;
  minPaymentFloor: number;
}

export interface CreditCardComparison {
  fixed: PayoffResult;
  minimum: PayoffResult;
  monthsSaved: number;
  interestSaved: number;
}

export function compareCreditCardPayoff(inputs: CreditCardInputs): CreditCardComparison {
  const fixed = calculateFixedPayoff(inputs.balance, inputs.apr, inputs.monthlyPayment);
  const minimum = calculateMinPaymentPayoff(
    inputs.balance,
    inputs.apr,
    inputs.minPaymentPercent,
    inputs.minPaymentFloor,
  );

  return {
    fixed,
    minimum,
    monthsSaved: minimum.neverPaysOff ? Infinity : minimum.months - fixed.months,
    interestSaved: minimum.neverPaysOff
      ? Infinity
      : minimum.totalInterest - fixed.totalInterest,
  };
}
