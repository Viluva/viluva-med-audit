export interface FinancialVelocityInputs {
  drag: number;
  fuel: number;
  runway: number;
  leak: number;
}

export interface FinancialVelocityResult {
  rawScore: number;
  normalizedScore: number;
}

const RAW_MIN = -180;
const RAW_MAX = 320;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const calculateFinancialVelocityScore = (
  inputs: FinancialVelocityInputs,
): FinancialVelocityResult => {
  const boundedDrag = clamp(inputs.drag, 0, 100);
  const boundedFuel = clamp(inputs.fuel, 0, 100);
  const boundedRunway = clamp(inputs.runway, 0, 24);
  const boundedLeak = clamp(inputs.leak, 0, 10);

  const rawScore =
    boundedFuel * 2 + boundedRunway * 5 - boundedDrag * 1.5 - boundedLeak * 3;

  const normalizedScore = Math.round(
    clamp(((rawScore - RAW_MIN) / (RAW_MAX - RAW_MIN)) * 100, 0, 100),
  );

  return {
    rawScore: Number(rawScore.toFixed(2)),
    normalizedScore,
  };
};
