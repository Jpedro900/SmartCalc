"use client";

import { useMemo, useState } from "react";
import { FunctionSquare, Sigma, Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

/** Avalia polinômio em x. Coefs em ordem decrescente: [a_n, ..., a0] */
function polyEval(coefs: number[], x: number): number {
  return coefs.reduce((acc, c) => acc * x + c, 0);
}
/** Derivada: retorna novos coeficientes */
function polyDeriv(coefs: number[]): number[] {
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
  while (parts.length > 1 && Math.abs(parts[0]) < 1e-12) parts.shift();
  return parts;
}

/** Raízes reais:
 * - grau 1/2: fórmulas fechadas
 * - grau 3: Cardano (apenas reais)
 * - grau >=4: amostragem + bisseção para mudanças de sinal (raízes reais)
 */
function realRoots(coefs: number[]): number[] {
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

    const r = 2 * Math.sqrt(-p / 3);
    const phi = Math.acos(-q / 2 / Math.sqrt((-p / 3) ** 3));
    return [
      r * Math.cos(phi / 3) + shift,
      r * Math.cos((phi + 2 * Math.PI) / 3) + shift,
      r * Math.cos((phi + 4 * Math.PI) / 3) + shift,
    ].sort((x, y) => x - y);
  }

  // grau >= 4: localizar mudanças de sinal e refinar por bisseção
  const f = (x: number) => polyEval(coefs, x);
  const roots: number[] = [];
  const XMIN = -50,
    XMAX = 50,
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
        fa = prevY,
        fb = y;
      for (let k = 0; k < 60; k++) {
        const m = (a + b) / 2;
        const fm = f(m);
        if (fa * fm <= 0) {
          b = m;
          fb = fm;
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

function fmt(n: number, d = 6) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: d });
}

/** Monta string bonita do polinômio: 2x^3 - 3x + 1  (com <sup>) */
function prettyPoly(coefs: number[]): string {
  const n = coefs.length - 1;
  const parts: string[] = [];
  coefs.forEach((c, i) => {
    const deg = n - i;
    if (Math.abs(c) < 1e-12) return;
    const sign = c >= 0 ? "+" : "−";
    const abs = Math.abs(c);

    let term = "";
    if (deg === 0) {
      term = `${abs}`;
    } else if (deg === 1) {
      term = `${abs === 1 ? "" : abs}x`;
    } else {
      term = `${abs === 1 ? "" : abs}x<sup>${deg}</sup>`;
    }
    parts.push(`${parts.length ? ` ${sign} ` : c < 0 ? "−" : ""}${term}`);
  });
  return parts.length ? parts.join("") : "0";
}

export default function PolinomiosClient() {
  const [coefsStr, setCoefsStr] = useState("1, -2, -5, 6"); // (x-3)(x-1)(x+2)
  const [xStr, setXStr] = useState("2");

  const parsed = useMemo(() => parseCoefs(coefsStr), [coefsStr]);
  const deriv = useMemo(() => (parsed ? polyDeriv(parsed) : null), [parsed]);

  const value = useMemo(() => {
    const x = Number(xStr.replace(",", "."));
    if (!parsed || !isFinite(x)) return null;
    return polyEval(parsed, x);
  }, [parsed, xStr]);

  const roots = useMemo(() => (parsed ? realRoots(parsed) : null), [parsed]);

  // Dados para o gráfico
  const chart = useMemo(() => {
    if (!parsed) return null;
    // domínio em torno dos zeros ou padrão
    const xs: number[] = [];
    const rmin = roots && roots.length ? Math.min(...roots) : -5;
    const rmax = roots && roots.length ? Math.max(...roots) : 5;
    const pad = Math.max(3, (rmax - rmin) * 0.6);
    const xmin = Math.floor((rmin - pad) * 10) / 10;
    const xmax = Math.ceil((rmax + pad) * 10) / 10;

    const STEPS = 200;
    for (let i = 0; i <= STEPS; i++) {
      xs.push(xmin + (i * (xmax - xmin)) / STEPS);
    }
    const data = xs.map((x) => ({ x, y: polyEval(parsed, x) }));
    const ys = data.map((d) => d.y);
    const ymin = Math.min(...ys),
      ymax = Math.max(...ys);
    return {
      data,
      xmin,
      xmax,
      ymin: Number.isFinite(ymin) ? ymin : -10,
      ymax: Number.isFinite(ymax) ? ymax : 10,
    };
  }, [parsed, roots]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <FunctionSquare className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Polinômios</h1>
          <p className="text-slate-500">
            Valor <em>f(x)</em>, derivada e <strong>raízes reais</strong> com gráfico.
          </p>
        </div>
      </header>

      {/* Entrada */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Sigma className="h-4 w-4" /> Coeficientes (ordem decrescente)
            </div>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              placeholder="Ex.: 1, -2, -5, 6"
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
            Digite os coeficientes em <strong>ordem decrescente</strong> (ex.:{" "}
            <code>aₙ, …, a₀</code>). O gráfico marca em roxo os pontos onde <em>f(x)=0</em> (as
            raízes reais).
          </p>
        </div>
      </section>

      {/* Equação + Gráfico */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm text-slate-700">
          <span className="font-medium">Equação: </span>
          <span
            dangerouslySetInnerHTML={{ __html: parsed ? `f(x) = ${prettyPoly(parsed)}` : "—" }}
          />
        </div>

        {chart ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[chart.xmin, chart.xmax]}
                  tickLine={false}
                />
                <YAxis type="number" tickLine={false} width={60} allowDecimals />
                <Tooltip
                  formatter={(v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}
                  labelFormatter={(l) =>
                    `x = ${l.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}`
                  }
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#6366f1"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                {/* marca as raízes reais */}
                {roots?.map((r, i) => (
                  <ReferenceDot key={i} x={r} y={0} r={4} fill="#a78bfa" stroke="#7c3aed" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-sm text-slate-600">Informe os coeficientes para ver o gráfico.</div>
        )}
      </section>

      {/* Cards de resultados */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="f(x)">
          {parsed && value != null ? <span className="font-semibold">{fmt(value)}</span> : "—"}
        </Card>
        <Card title="Derivada (coeficientes)">
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

      {/* Como calculamos as raízes */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-1 text-sm font-semibold text-slate-700">Como calculamos as raízes</div>
        <ul className="list-disc pl-5 text-sm text-slate-700">
          <li>
            <strong>Grau 1:</strong> solução direta de <em>ax + b = 0</em>.
          </li>
          <li>
            <strong>Grau 2:</strong> fórmula de Bhaskara.
          </li>
          <li>
            <strong>Grau 3:</strong> método de Cardano (retornamos apenas as raízes reais).
          </li>
          <li>
            <strong>Grau ≥ 4:</strong> procuramos <em>mudanças de sinal</em> em uma grade ampla e
            refinamos com <em>bisseção</em>. Método robusto para raízes reais.
          </li>
        </ul>
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
