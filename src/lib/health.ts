// src/lib/health.ts
export type Sex = "M" | "F";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** TMB (Mifflin-St Jeor). Peso kg, altura cm, idade anos. */
export function tmbMifflin(sex: Sex, pesoKg: number, alturaCm: number, idade: number) {
  if (sex === "M") return 10 * pesoKg + 6.25 * alturaCm - 5 * idade + 5;
  return 10 * pesoKg + 6.25 * alturaCm - 5 * idade - 161;
}

/** TDEE = TMB × fator de atividade. */
export function tdeeFromTmb(tmb: number, fator: number) {
  return tmb * fator;
}

/** Fatores de atividade comuns. */
export const FATORES_ATIVIDADE = [
  { id: "sed", label: "Sedentário (pouco ou nenhum exercício)", fator: 1.2 },
  { id: "lev", label: "Levemente ativo (1–3x/semana)", fator: 1.375 },
  { id: "mod", label: "Moderadamente ativo (3–5x/semana)", fator: 1.55 },
  { id: "alt", label: "Altamente ativo (6–7x/semana)", fator: 1.725 },
  { id: "ext", label: "Extremamente ativo (2x/dia)", fator: 1.9 },
] as const;

/** Método US Navy (cm). Retorna % gordura (0–100). */
export function bodyFatUSNavy(
  sex: Sex,
  alturaCm: number,
  pescocoCm: number,
  cinturaCm: number,
  quadrilCm?: number
) {
  const log10 = (x: number) => Math.log10(x);

  if (sex === "M") {
    // BF% = 86.010*log10(cintura - pescoço) - 70.041*log10(altura) + 36.76
    const bf = 86.01 * log10(cinturaCm - pescocoCm) - 70.041 * log10(alturaCm) + 36.76;
    return clamp(bf, 0, 70);
  }
  // F: BF% = 163.205*log10(cintura + quadril - pescoço) - 97.684*log10(altura) - 78.387
  const q = quadrilCm ?? 0;
  const bf = 163.205 * log10(cinturaCm + q - pescocoCm) - 97.684 * log10(alturaCm) - 78.387;
  return clamp(bf, 0, 70);
}

/** Classificação simples por faixa etária (genérica). */
export function bodyFatClass(sex: Sex, idade: number, bfPct: number) {
  // Tabela simplificada (referência genérica)
  const mapM = [
    { max: 6, label: "Essencial" },
    { max: 14, label: "Atlético" },
    { max: 18, label: "Em forma" },
    { max: 25, label: "Médio" },
    { max: 100, label: "Alto" },
  ];
  const mapF = [
    { max: 13, label: "Essencial" },
    { max: 21, label: "Atlética" },
    { max: 25, label: "Em forma" },
    { max: 32, label: "Médio" },
    { max: 100, label: "Alto" },
  ];
  const ref = sex === "M" ? mapM : mapF;
  return ref.find((r) => bfPct <= r.max)?.label ?? "—";
}
