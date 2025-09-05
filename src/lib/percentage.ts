export function increase(base: number, pct: number): number {
  return base * (1 + pct);
}
export function discount(base: number, pct: number): number {
  return base * (1 - pct);
}
export function percentageOf(part: number, whole: number): number {
  if (whole === 0) throw new Error("whole não pode ser 0");
  return part / whole;
}
export function pctChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) throw new Error("oldValue não pode ser 0 para pctChange");
  return (newValue - oldValue) / oldValue;
}
