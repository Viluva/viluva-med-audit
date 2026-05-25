// ─────────────────────────────────────────────────────────────────────────────
// Viluva AI — Smart Score Engine (preview tier)
// Simplified implementation of the 4-pillar Smart Score algorithm.
// The production version runs server-side with live bank data via Setu.
// ─────────────────────────────────────────────────────────────────────────────

export type PurchasePriority = "must-have" | "should-have" | "could-have" | "fun-want";
export type PurchaseCategory =
  | "investment"
  | "tool"
  | "health"
  | "experience"
  | "depreciating"
  | "consumable";
export type FinancialProfile = "fragile" | "building" | "secure";
export type Recommendation = "excellent" | "good" | "caution" | "avoid";

export interface SmartScoreInputs {
  // Financial picture
  monthlyIncome: number;
  monthlyFixedCosts: number;  // rent, EMIs, fixed bills
  emergencyFundMonths: number; // months of expenses currently saved
  monthlySavings: number;      // amount going toward any goal monthly

  // The purchase
  purchaseName: string;
  purchasePrice: number;
  priority: PurchasePriority;
  category: PurchaseCategory;

  // Goal (optional)
  hasGoal: boolean;
  goalAmount: number;
  goalMonths: number;
}

export interface SmartScoreResult {
  score: number;
  profile: FinancialProfile;
  resilience: number;
  affordabilityScore: number;
  valueScore: number;
  goalScore: number;
  recommendation: Recommendation;
  delayMonths: number;
  disposableIncome: number;
  dti: number;
  insight: string;
  profileLabel: string;
  profileDescription: string;
}

// ─── Pillar constants ────────────────────────────────────────────────────────

const PRIORITY_SCORES: Record<PurchasePriority, number> = {
  "must-have": 100,
  "should-have": 85,
  "could-have": 60,
  "fun-want": 40,
};

const CATEGORY_SCORES: Record<PurchaseCategory, number> = {
  investment: 100,
  tool: 90,
  health: 80,
  experience: 65,
  depreciating: 40,
  consumable: 25,
};

// ─── Pillar 1: Financial Resilience ──────────────────────────────────────────

function getEmergencyFundScore(months: number): number {
  return Math.min(100, (months / 6) * 100);
}

function getDTIScore(dti: number): number {
  if (dti <= 0.2) return 100;
  if (dti <= 0.35) return 70 + ((0.35 - dti) / 0.15) * 30;
  if (dti <= 0.5) return 30 + ((0.5 - dti) / 0.15) * 40;
  return Math.max(0, 30 * (1 - (dti - 0.5) / 0.5));
}

function getProfile(resilience: number): FinancialProfile {
  if (resilience < 40) return "fragile";
  if (resilience < 75) return "building";
  return "secure";
}

// ─── Pillar 2: Purchase Affordability ────────────────────────────────────────
// Green zone (0–1× disposable):  100 → 50  (smooth sqrt decay)
// Yellow zone (1–2× disposable): 50  → 10  (linear)
// Red zone (>2× disposable):     10  → 0   (progressive penalty)

function getAffordabilityScore(purchasePrice: number, disposableIncome: number): number {
  if (disposableIncome <= 0) return 0;
  const ratio = purchasePrice / disposableIncome;
  if (ratio <= 1) return 100 - 50 * Math.sqrt(ratio);
  if (ratio <= 2) return 50 - 40 * (ratio - 1);
  return Math.max(0, 10 - 10 * ((ratio - 2) / 2));
}

// ─── Pillar 4: Goal Momentum ──────────────────────────────────────────────────

function getGoalScore(
  purchasePrice: number,
  monthlySavings: number,
  goalMonths: number
): number {
  if (monthlySavings <= 0) return 50;
  const delayMonths = purchasePrice / monthlySavings;
  const delayRatio = goalMonths > 0 ? delayMonths / goalMonths : 1;

  if (delayRatio <= 0.1) return 80 + 15 * (1 - delayRatio / 0.1);
  if (delayRatio <= 0.25) return 65 + 15 * ((0.25 - delayRatio) / 0.15);
  if (delayRatio <= 0.5) return 35 + 30 * ((0.5 - delayRatio) / 0.25);
  return Math.max(0, 35 * (1 - (delayRatio - 0.5)));
}

// ─── Insight generator ───────────────────────────────────────────────────────

function buildInsight(
  result: Omit<SmartScoreResult, "insight" | "profileLabel" | "profileDescription">,
  purchaseName: string
): string {
  const label = purchaseName.trim() || "This purchase";
  const { recommendation, profile, affordabilityScore, delayMonths, valueScore } = result;

  if (recommendation === "excellent") {
    if (valueScore >= 85) {
      return `${label} looks like a genuinely smart buy. Strong value alignment and your finances have clear room for it.`;
    }
    return `${label} fits your finances well. You can afford it without threatening your foundation or goals.`;
  }

  if (recommendation === "good") {
    if (affordabilityScore < 60) {
      return `${label} makes sense value-wise, but it stretches your budget a bit. Timing it with your next income bump could make it an even stronger decision.`;
    }
    if (delayMonths > 2) {
      return `${label} is a reasonable buy, though it may delay your savings goal by around ${delayMonths} month${delayMonths !== 1 ? "s" : ""}. Worth factoring that in.`;
    }
    return `${label} makes sense overall. Your finances can handle it and the value aligns with your priorities.`;
  }

  if (recommendation === "caution") {
    if (profile === "fragile") {
      return `Your financial foundation is still building. Taking on ${label} right now adds pressure when your safety net needs strengthening first.`;
    }
    if (delayMonths > 4) {
      return `${label} would push back your savings goal by roughly ${delayMonths} months. That's a meaningful trade-off — make sure it's worth it.`;
    }
    return `${label} sits in caution territory. Your numbers aren't disqualifying, but there isn't a strong buffer either. A small financial setback could make this decision painful.`;
  }

  // avoid
  if (affordabilityScore < 20) {
    return `${label} significantly exceeds your current disposable income. Taking this on now would put real pressure on your financial safety net and ability to absorb any shocks.`;
  }
  if (delayMonths > 12) {
    return `${label} would delay your savings goal by over a year. The numbers suggest waiting — or finding a smarter alternative first.`;
  }
  return `The numbers say hold off on ${label} for now. Your current financial picture isn't set up to absorb this without meaningful consequences.`;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function calculateSmartScore(inputs: SmartScoreInputs): SmartScoreResult {
  const {
    monthlyIncome,
    monthlyFixedCosts,
    emergencyFundMonths,
    monthlySavings,
    purchaseName,
    purchasePrice,
    priority,
    category,
    hasGoal,
    goalMonths,
  } = inputs;

  // ── Pillar 1: Resilience ──
  const dti = monthlyIncome > 0 ? monthlyFixedCosts / monthlyIncome : 1;
  const emergencyScore = getEmergencyFundScore(emergencyFundMonths);
  const dtiScore = getDTIScore(dti);
  const resilience = (emergencyScore + dtiScore) / 2;
  const profile = getProfile(resilience);

  // ── Disposable income ──
  const safetyNet = monthlyIncome * 0.1; // 10% safety buffer
  const disposableIncome = Math.max(0, monthlyIncome - monthlyFixedCosts - safetyNet);

  // ── Pillar 2: Affordability ──
  const affordabilityScore = getAffordabilityScore(purchasePrice, disposableIncome);

  // ── Pillar 3: Value & Alignment ──
  const valueScore = (PRIORITY_SCORES[priority] + CATEGORY_SCORES[category]) / 2;

  // ── Pillar 4: Goal Momentum ──
  const delayMonths =
    monthlySavings > 0 ? Math.round(purchasePrice / monthlySavings) : 0;
  const goalScore =
    hasGoal && goalMonths > 0
      ? getGoalScore(purchasePrice, monthlySavings, goalMonths)
      : 70; // neutral if no goal provided

  // ── Dynamic weights by profile ──
  const weights =
    profile === "fragile"
      ? { affordability: 0.5, value: 0.3, goal: 0.2 }
      : profile === "secure"
        ? { affordability: 0.2, value: 0.4, goal: 0.4 }
        : { affordability: 0.35, value: 0.3, goal: 0.35 }; // building

  const raw =
    affordabilityScore * weights.affordability +
    valueScore * weights.value +
    goalScore * weights.goal;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const recommendation: Recommendation =
    score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "caution" : "avoid";

  const profileLabel =
    profile === "fragile"
      ? "Fragile Foundation"
      : profile === "building"
        ? "Building Momentum"
        : "Secure Position";

  const profileDescription =
    profile === "fragile"
      ? "Your emergency fund and/or debt load needs attention before larger discretionary purchases."
      : profile === "building"
        ? "You're on the right track. Balancing current enjoyment with future goals is key."
        : "Your financial foundation is solid. You can afford to prioritise value and long-term goals.";

  const partial = {
    score,
    profile,
    resilience: Math.round(resilience),
    affordabilityScore: Math.round(affordabilityScore),
    valueScore: Math.round(valueScore),
    goalScore: Math.round(goalScore),
    recommendation,
    delayMonths,
    disposableIncome,
    dti,
    profileLabel,
    profileDescription,
  };

  return { ...partial, insight: buildInsight(partial, purchaseName) };
}
