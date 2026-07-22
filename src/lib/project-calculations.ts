export function getForeignSpendPercentage(
  currentAward: number | null,
  foreignSpend: number | null
): number | null {
  if (
    currentAward == null ||
    foreignSpend == null ||
    currentAward <= 0
  ) {
    return null;
  }

  return (foreignSpend / currentAward) * 100;
}