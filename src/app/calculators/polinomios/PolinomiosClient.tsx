"use client";

import { useMemo, useState } from "react";
import { FunctionSquare, Sigma, Info } from "lucide-react";
import { parseCoefs, polyDeriv, polyEval, realRoots } from "@/lib/polynomial";

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
