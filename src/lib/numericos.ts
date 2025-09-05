export function toBin(n: number): string {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) throw new Error("n inválido");
  return n.toString(2);
}
export function toHex(n: number): string {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) throw new Error("n inválido");
  return n.toString(16).toUpperCase();
}
export function fromBase(str: string, base: number): number {
  if (base < 2 || base > 36) throw new Error("base fora do intervalo [2,36]");
  const v = parseInt(str, base);
  if (Number.isNaN(v)) throw new Error("string inválida para a base");
  return v;
}
