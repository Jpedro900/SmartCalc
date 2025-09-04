"use client";

import { useMemo, useState } from "react";
import { FunctionSquare, Sigma, Info } from "lucide-react";

/** Avalia polinômio em x. Coefs em ordem decrescente: [a_n, ..., a0] */
function polyEval(coefs: number[], x: number) {
  return coefs.reduce((acc, c) => acc * x + c, 0);
}
/** Derivada: retorna novos coeficientes */
function polyDeriv(coefs: number[]) {
  const n = coefs.length - 1;
  return coefs.slice(0, -1).map((c, i) => c * (n - i));
}
/** Parse: "2, -3, 1" -> [2,-3,1] */
function parseCoefs(input: string): number[] | null {
  const parts = input
    .split(/[;,]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s.replace(",", ".")));
  if (!parts.length || parts.some((v) => !isFinite(v))) return null;
  // remove zeros à esquerda (grau alto nulo)
  while (parts.length > 1 && Math.abs(parts[0]) < 1e-12) parts.shift();
  return parts;
}

/** Raízes reais via:
 *  - grau 1/2: fórmulas fechadas
 *  - grau 3: Cardano (apenas reais)
 *  - grau >=4: amostragem + bisseção para mudanças de sinal (real roots)
 */
function realRoots(coefs: number[]): number[] {
  const n = coefs.length - 1;

  // grau 1: ax + b = 0
  if (n === 1) {
    const [a, b] = coefs;
    if (Math.abs(a) < 1e-12) return [];
    return [-b / a];
  }

  // grau 2: ax^2 + bx + c
  if (n === 2) {
    const [a, b, c] = coefs;
    if (Math.abs(a) < 1e-12) return realRoots([b, c]);
    const D = b * b - 4 * a * c;
    if (D < -1e-12) return [];
    if (Math.abs(D) < 1e-12) return [-b / (2 * a)];
    const s = Math.sqrt(D);
    return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((x, y) => x - y);
  }

  // grau 3: Cardano (somente raízes reais retornadas)
  if (n === 3) {
    const [a, b, c, d] = coefs;
    if (Math.abs(a) < 1e-12) return realRoots([b, c, d]);
    // x = t - b/(3a)
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

    // 3 raízes reais
    const r = 2 * Math.sqrt(-p / 3);
    const phi = Math.acos(-q / 2 / Math.sqrt((-p / 3) ** 3));
    return [
      r * Math.cos(phi / 3) + shift,
      r * Math.cos((phi + 2 * Math.PI) / 3) + shift,
      r * Math.cos((phi + 4 * Math.PI) / 3) + shift,
    ].sort((x, y) => x - y);
  }

  // grau >= 4: localizar mudanças de sinal em grade ampla e refinar por bisseção
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
      // bisseção
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
  // remover duplicatas numéricas
  roots.sort((x, y) => x - y);
  const uniq: number[] = [];
  for (const r of roots)
    if (!uniq.length || Math.abs(r - uniq[uniq.length - 1]) > 1e-7) uniq.push(r);
  return uniq;
}

function fmt(n: number, d = 6) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: d });
}

export default function PolinomiosClient() {
  const [coefsStr, setCoefsStr] = useState("1, -3, -7, 27"); // exemplo: x^3 - 3x^2 -7x + 27
  const [xStr, setXStr] = useState("2");

  const parsed = useMemo(() => parseCoefs(coefsStr), [coefsStr]);

  const deriv = useMemo(() => (parsed ? polyDeriv(parsed) : null), [parsed]);

  const value = useMemo(() => {
    const x = Number(xStr.replace(",", "."));
    if (!parsed || !isFinite(x)) return null;
    return polyEval(parsed, x);
  }, [parsed, xStr]);

  const roots = useMemo(() => (parsed ? realRoots(parsed) : null), [parsed]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <FunctionSquare className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Polinômios</h1>
          <p className="text-slate-500">
            Valor f(x), derivada e raízes <em>reais</em>. Informe os coeficientes em ordem
            decrescente: <code>aₙ, …, a₀</code>.
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Sigma className="h-4 w-4" /> Coeficientes (ordem decrescente)
            </div>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              placeholder="Ex.: 1, -3, -7, 27"
              value={coefsStr}
              onChange={(e) => setCoefsStr(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">x</div>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="decimal"
              value={xStr}
              onChange={(e) => setXStr(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Grau 1–3 usam fórmulas fechadas (Bhaskara/Cardano). Graus maiores: detecção de mudanças
            de sinal e bisseção para raízes <strong>reais</strong> no intervalo [−1000, 1000].
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="f(x)">
          {parsed && value != null ? <span className="font-semibold">{fmt(value)}</span> : "—"}
        </Card>
        <Card title="Derivada">
          {deriv ? <code>{deriv.map((c) => fmt(c, 4)).join(", ")}</code> : "—"}
        </Card>
        <Card title="Raízes reais">
          {roots ? (
            roots.length ? (
              <ul className="list-inside list-disc">
                {roots.map((r, i) => (
                  <li key={i} className="font-semibold">
                    {fmt(r)}
                  </li>
                ))}
              </ul>
            ) : (
              "Nenhuma em ℝ"
            )
          ) : (
            "—"
          )}
        </Card>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 text-sm text-slate-600">{title}</div>
      <div className="text-slate-900">{children}</div>
    </div>
  );
}
