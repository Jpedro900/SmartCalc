export function parseNum(input: string): number {
  const s = input.trim().replace(/\./g, "").replace(/,/g, ".");
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error("número inválido");
  return n;
}

export function format2(n: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatRate(n: number): string {
  const places = n < 0.01 ? 8 : n < 1 ? 4 : 2;
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });
}

/** Converte amount usando taxa já conhecida (sem rede) */
export function convert(amount: number, rate: number): number {
  return amount * rate;
}

/** Aplica spread/IOF para modo turístico simples */
export function applyTourismRate(rate: number, spreadPct = 0.04): number {
  return rate * (1 + Math.max(0, spreadPct));
}
