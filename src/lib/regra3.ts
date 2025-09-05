export function ruleOfThree(a: number, b: number, c: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    throw new Error("Parâmetros inválidos");
  }
  if (a === 0) throw new Error("Divisão por zero em ruleOfThree: 'a' não pode ser 0");
  return (b * c) / a;
}
