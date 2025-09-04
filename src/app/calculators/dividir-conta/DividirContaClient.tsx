"use client";

import { useMemo, useState } from "react";
import { Users, Percent, Wallet, Info, Scissors } from "lucide-react";

function numBR(s: string): number {
  if (typeof s !== "string") return NaN;
  const cleaned = s.replace(/\s/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    return Number(cleaned.replace(",", "."));
  }
  return Number(cleaned);
}
function fmtMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DividirContaClient() {
  const [totalStr, setTotalStr] = useState("200,00");
  const [gorjetaStr, setGorjetaStr] = useState("10"); // %
  const [pessoasStr, setPessoasStr] = useState("4");
  const [arredondar, setArredondar] = useState<"nao" | "cima" | "baixo">("nao");

  const parsed = useMemo(() => {
    const total = numBR(totalStr);
    const tipPct = numBR(gorjetaStr) / 100;
    const n = Math.max(1, Math.floor(numBR(pessoasStr) || 1));
    if (!isFinite(total) || total <= 0 || !isFinite(tipPct) || tipPct < 0) return null;

    const gorjeta = total * tipPct;
    const totalComGorjeta = total + gorjeta;
    let porPessoa = totalComGorjeta / n;

    if (arredondar === "cima") porPessoa = Math.ceil(porPessoa);
    if (arredondar === "baixo") porPessoa = Math.floor(porPessoa);

    const valores = Array.from({ length: n }).map(() => porPessoa);
    const soma = valores.reduce((s, v) => s + v, 0);

    // ajuste do centavo na última pessoa caso arredonde
    if (arredondar !== "nao" && soma !== totalComGorjeta) {
      const diff = totalComGorjeta - soma;
      valores[valores.length - 1] += diff;
    }

    return { n, total, tipPct, gorjeta, totalComGorjeta, porPessoa, valores };
  }, [totalStr, gorjetaStr, pessoasStr, arredondar]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Scissors className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dividir conta / Gorjeta</h1>
          <p className="text-slate-500">Calcule o valor por pessoa com gorjeta opcional.</p>
        </div>
      </div>

      {/* inputs */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Total da conta (R$)" icon={<Wallet className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              value={totalStr}
              onChange={(e) => setTotalStr(e.target.value)}
              placeholder="Ex.: 200,00"
            />
          </Field>

          <Field label="Gorjeta (%)" icon={<Percent className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              value={gorjetaStr}
              onChange={(e) => setGorjetaStr(e.target.value)}
              placeholder="Ex.: 10"
            />
          </Field>

          <Field label="Número de pessoas" icon={<Users className="h-4 w-4" />}>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              value={pessoasStr}
              onChange={(e) => setPessoasStr(e.target.value)}
              placeholder="Ex.: 4"
            />
          </Field>

          <div className="mt-1">
            <div className="text-sm font-medium text-slate-700">Arredondar valor por pessoa</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  arredondar === "nao"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setArredondar("nao")}
              >
                Não
              </button>
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  arredondar === "cima"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setArredondar("cima")}
              >
                Para cima
              </button>
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  arredondar === "baixo"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setArredondar("baixo")}
              >
                Para baixo
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 text-slate-400" />
              <p>
                Ao arredondar, ajustamos a última pessoa para que a soma feche exatamente o total com
                gorjeta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* resultado */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Gorjeta (R$)" value={parsed ? fmtMoney(parsed.gorjeta) : "—"} />
        <Card title="Total com gorjeta" value={parsed ? fmtMoney(parsed.totalComGorjeta) : "—"} />
        <Card title="Por pessoa" value={parsed ? fmtMoney(parsed.porPessoa) : "—"} />

        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-600">Detalhamento por pessoa</div>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {parsed ? (
              parsed.valores.map((v, idx) => (
                <li
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                >
                  Pessoa {idx + 1}: <span className="font-semibold">{fmtMoney(v)}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">—</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </label>
  );
}
function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 text-sm text-slate-600">{title}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
