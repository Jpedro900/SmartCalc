// src/lib/polynomial.ts
export function polyEval(coefs: number[], x: number) {
  return coefs.reduce((acc, c) => acc * x + c, 0);
}
export function polyDeriv(coefs: number[]) {
  const n = coefs.length - 1;
  return coefs.slice(0, -1).map((c, i) => c * (n - i));
}
export function parseCoefs(input: string): number[] | null {
  const parts = input
    .split(/[;,]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s.replace(",", ".")));
  if (!parts.length || parts.some((v) => !isFinite(v))) return null;
  while (parts.length > 1 && Math.abs(parts[0]) < 1e-12) parts.shift();
  return parts;
}

/** Raízes reais. Grau 1–3 analítico; >=4 bisseção em mudanças de sinal. */
export function realRoots(coefs: number[]): number[] {
  const n = coefs.length - 1;

  if (n === 1) {
    const [a, b] = coefs;
    if (Math.abs(a) < 1e-12) return [];
    return [-b / a];
  }
  if (n === 2) {
    const [a, b, c] = coefs;
    if (Math.abs(a) < 1e-12) return realRoots([b, c]);
    const D = b * b - 4 * a * c;
    if (D < -1e-12) return [];
    if (Math.abs(D) < 1e-12) return [-b / (2 * a)];
    const s = Math.sqrt(D);
    return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((x, y) => x - y);
  }
  if (n === 3) {
    const [a, b, c, d] = coefs;
    if (Math.abs(a) < 1e-12) return realRoots([b, c, d]);
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    const disc = (q * q) / 4 + (p * p * p) / 27;
    const shift = -b / (3 * a);
    if (disc > 1e-12) {
      const sqrtDisc = Math.sqrt(disc);
      const u = Math.cbrt(-q / 2 + sqrtDisc);
      const v = Math.cbrt(-q / 2 - sqrtDisc);
      return [u + v + shift];
    }
    if (Math.abs(disc) <= 1e-12) {
      const u = Math.cbrt(-q / 2);
      return [2 * u + shift, -u + shift].sort((x, y) => x - y);
    }
    const r = 2 * Math.sqrt(-p / 3);
    const phi = Math.acos(-q / 2 / Math.sqrt((-p / 3) ** 3));
    return [
      r * Math.cos(phi / 3) + shift,
      r * Math.cos((phi + 2 * Math.PI) / 3) + shift,
      r * Math.cos((phi + 4 * Math.PI) / 3) + shift,
    ].sort((x, y) => x - y);
  }

  const f = (x: number) => polyEval(coefs, x);
  const roots: number[] = [];
  const XMIN = -1000,
    XMAX = 1000,
    STEPS = 4000;
  let prevX = XMIN,
    prevY = f(prevX);
  for (let i = 1; i <= STEPS; i++) {
    const x = XMIN + (i * (XMAX - XMIN)) / STEPS;
    const y = f(x);
    if (prevY === 0) roots.push(prevX);
    if (y === 0) roots.push(x);
    if (prevY * y < 0) {
      let a = prevX,
        b = x,
        fa = prevY;
      for (let k = 0; k < 60; k++) {
        const m = (a + b) / 2;
        const fm = f(m);
        if (fa * fm <= 0) {
          b = m;
        } else {
          a = m;
          fa = fm;
        }
      }
      roots.push((a + b) / 2);
    }
    prevX = x;
    prevY = y;
  }
  roots.sort((x, y) => x - y);
  const uniq: number[] = [];
  for (const r of roots)
    if (!uniq.length || Math.abs(r - uniq[uniq.length - 1]) > 1e-7) uniq.push(r);
  return uniq;
}
