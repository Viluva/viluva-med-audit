export interface LoanOffer {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  processingFeePercent: number;
}

export interface LoanOfferResult {
  emi: number;
  totalInterest: number;
  processingFee: number;
  totalPayment: number;
  totalCost: number;
}

export function calculateLoanEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): number {
  if (tenureMonths <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function evaluateLoanOffer(offer: LoanOffer): LoanOfferResult {
  const principal = Math.max(0, offer.principal);
  const emi = calculateLoanEMI(principal, offer.annualRate, offer.tenureMonths);
  const totalPayment = emi * offer.tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const processingFee = principal * (offer.processingFeePercent / 100);
  const totalCost = totalPayment + processingFee;

  return {
    emi,
    totalInterest,
    processingFee,
    totalPayment,
    totalCost,
  };
}

export interface LoanComparison {
  offerA: LoanOfferResult;
  offerB: LoanOfferResult;
  cheaperOffer: "A" | "B";
  totalCostDifference: number;
  emiDifference: number;
}

export function compareLoanOffers(offerA: LoanOffer, offerB: LoanOffer): LoanComparison {
  const resultA = evaluateLoanOffer(offerA);
  const resultB = evaluateLoanOffer(offerB);

  return {
    offerA: resultA,
    offerB: resultB,
    cheaperOffer: resultA.totalCost <= resultB.totalCost ? "A" : "B",
    totalCostDifference: Math.abs(resultA.totalCost - resultB.totalCost),
    emiDifference: Math.abs(resultA.emi - resultB.emi),
  };
}
