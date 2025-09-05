export function compoundFV(
  principal: number,
  rateAoMes: number, // ex.: 0.02 = 2% ao mês
  meses: number
): number {
  if (meses < 0) throw new Error("meses não pode ser negativo");
  return principal * Math.pow(1 + rateAoMes, meses);
}

export function simpleFV(
  principal: number,
  rateAoMes: number, // ex.: 0.02 = 2% ao mês
  meses: number
): number {
  if (meses < 0) throw new Error("meses não pode ser negativo");
  return principal * (1 + rateAoMes * meses);
}
