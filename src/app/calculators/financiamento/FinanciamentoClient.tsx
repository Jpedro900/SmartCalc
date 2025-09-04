"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Percent,
  Calendar,
  Calculator,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

/* ========= helpers ========= */

type System = "PRICE" | "SAC";
type RateMode = "am" | "aa";
type PeriodMode = "meses" | "anos";

function numBR(s: string): number {
  // aceita pt-BR (1.234,56) e EN (1,234.56)
  if (typeof s !== "string") return NaN;
  const cleaned = s.replace(/\s/g, "");
  // se tiver vírgula e ponto, assume pt-BR
  if (cleaned.includes(",") && cleaned.includes(".")) {
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }
  // se só vírgula, troca por ponto
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    return Number(cleaned.replace(",", "."));
  }
  return Number(cleaned);
}
function fmtBR(n: number, max = 2): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  });
}
function fmtMoneyBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function percentStrToFloat(p: string): number {
  // "1,5" => 0.015
  const v = numBR(p);
  return isFinite(v) ? v / 100 : NaN;
}

// conversões de taxa
function iMensalFrom(i: number, mode: RateMode): number {
  if (!isFinite(i)) return NaN;
  return mode === "am" ? i : Math.pow(1 + i, 1 / 12) - 1;
}
function iAnualFrom(i: number, mode: RateMode): number {
  if (!isFinite(i)) return NaN;
  return mode === "aa" ? i : Math.pow(1 + i, 12) - 1;
}

// períodos
function mesesFrom(n: number, mode: PeriodMode): number {
  if (!isFinite(n)) return NaN;
  return mode === "meses" ? Math.round(n) : Math.round(n * 12);
}

type Row = {
  t: number; // mês (1..n)
  prest: number;
  juros: number;
  amort: number;
  saldo: number;
};
type Output = {
  sistema: System;
  n: number;
  iMes: number;
  iAno: number;
  pmt: number; // para PRICE
  totalPago: number;
  totalJuros: number;
  tabela: Row[];
};

function calcPrice(pv: number, iMes: number, n: number): Output {
  const factor = Math.pow(1 + iMes, n);
  const pmt = iMes === 0 ? pv / n : pv * ((iMes * factor) / (factor - 1));

  const tabela: Row[] = [];
  let saldo = pv;
  let totalJuros = 0;

  for (let t = 1; t <= n; t++) {
    const juros = saldo * iMes;
    const amort = pmt - juros;
    saldo = Math.max(0, saldo - amort);
    totalJuros += juros;
    tabela.push({
      t,
      prest: pmt,
      juros,
      amort,
      saldo,
    });
  }

  return {
    sistema: "PRICE",
    n,
    iMes,
    iAno: Math.pow(1 + iMes, 12) - 1,
    pmt,
    totalPago: pmt * n,
    totalJuros,
    tabela,
  };
}

function calcSAC(pv: number, iMes: number, n: number): Output {
  const amortConst = pv / n;
  const tabela: Row[] = [];
  let saldo = pv;
  let totalJuros = 0;
  let totalPago = 0;

  for (let t = 1; t <= n; t++) {
    const juros = saldo * iMes;
    const prest = amortConst + juros;
    saldo = Math.max(0, saldo - amortConst);
    totalJuros += juros;
    totalPago += prest;
    tabela.push({
      t,
      prest,
      juros,
      amort: amortConst,
      saldo,
    });
  }

  return {
    sistema: "SAC",
    n,
    iMes,
    iAno: Math.pow(1 + iMes, 12) - 1,
    pmt: NaN,
    totalPago,
    totalJuros,
    tabela,
  };
}

/* ========= UI ========= */

export default function FinanciamentoClient() {
  // inputs
  const [pvStr, setPvStr] = useState<string>("100.000,00");
  const [rateStr, setRateStr] = useState<string>("1,2"); // %
  const [rateMode, setRateMode] = useState<RateMode>("am");
  const [nStr, setNStr] = useState<string>("60");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("meses");
  const [sistema, setSistema] = useState<System>("PRICE");

  const parsed = useMemo(() => {
    const pv = numBR(pvStr);
    const i = percentStrToFloat(rateStr);
    const nBase = numBR(nStr);

    const iMes = iMensalFrom(i, rateMode);
    const iAno = iAnualFrom(i, rateMode);
    const n = mesesFrom(nBase, periodMode);

    const ok = isFinite(pv) && pv > 0 && isFinite(iMes) && iMes >= 0 && isFinite(n) && n > 0;
    return { ok, pv, i, iMes, iAno, n };
  }, [pvStr, rateStr, rateMode, nStr, periodMode]);

  const out = useMemo<Output | null>(() => {
    if (!parsed.ok) return null;
    return sistema === "PRICE"
      ? calcPrice(parsed.pv, parsed.iMes, parsed.n)
      : calcSAC(parsed.pv, parsed.iMes, parsed.n);
  }, [parsed, sistema]);

  const resumo = useMemo(() => {
    if (!out) return null;
    const { totalJuros, totalPago, iMes, iAno, n, sistema } = out;
    const parcelaMedia =
      sistema === "PRICE" ? out.pmt : out.tabela.reduce((s, r) => s + r.prest, 0) / n;
    return {
      totalJuros,
      totalPago,
      parcelaMedia,
      iMes,
      iAno,
      n,
    };
  }, [out]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Calculator className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Financiamento — Price & SAC</h1>
          <p className="text-slate-500">
            Calcule prestações, juros totais e a tabela de amortização.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Valor financiado (PV)" icon={<Banknote className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              placeholder="Ex.: 100.000,00"
              value={pvStr}
              onChange={(e) => setPvStr(e.target.value)}
              aria-label="Valor financiado"
            />
          </Field>

          <Field label="Taxa" icon={<Percent className="h-4 w-4" />}>
            <div className="mt-1 flex gap-2">
              <input
                inputMode="decimal"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                placeholder="Ex.: 1,2"
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
                aria-label="Taxa percentual"
              />
              <select
                className="min-w-[120px] rounded-lg border border-slate-300 bg-white p-2.5"
                value={rateMode}
                onChange={(e) => setRateMode(e.target.value as RateMode)}
                aria-label="Periodicidade da taxa"
              >
                <option value="am">% a.m.</option>
                <option value="aa">% a.a.</option>
              </select>
            </div>
          </Field>

          <Field label="Prazo" icon={<Calendar className="h-4 w-4" />}>
            <div className="mt-1 flex gap-2">
              <input
                inputMode="numeric"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                placeholder={periodMode === "meses" ? "Ex.: 60" : "Ex.: 5"}
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
                aria-label="Quantidade de períodos"
              />
              <select
                className="min-w-[120px] rounded-lg border border-slate-300 bg-white p-2.5"
                value={periodMode}
                onChange={(e) => setPeriodMode(e.target.value as PeriodMode)}
                aria-label="Unidade do prazo"
              >
                <option value="meses">meses</option>
                <option value="anos">anos</option>
              </select>
            </div>
          </Field>

          <Field label="Sistema">
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  sistema === "PRICE"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setSistema("PRICE")}
                aria-pressed={sistema === "PRICE"}
              >
                PRICE
              </button>
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  sistema === "SAC"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setSistema("SAC")}
                aria-pressed={sistema === "SAC"}
              >
                SAC
              </button>
            </div>
          </Field>
        </div>

        {/* Aviso/ajuda */}
        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Em <strong>PRICE</strong> as parcelas são iguais; em <strong>SAC</strong> as parcelas
            começam mais altas e diminuem com o tempo (amortização constante).
          </p>
        </div>
      </section>

      {/* Resumo */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card
          title="Parcela (média ou fixa)"
          value={out ? fmtMoneyBRL(resumo!.parcelaMedia) : "—"}
          icon={<TrendingUp className="h-5 w-5 text-indigo-600" aria-hidden />}
        />
        <Card
          title="Juros totais"
          value={out ? fmtMoneyBRL(resumo!.totalJuros) : "—"}
          icon={<TrendingDown className="h-5 w-5 text-indigo-600" aria-hidden />}
        />
        <Card
          title="Total pago"
          value={out ? fmtMoneyBRL(resumo!.totalPago) : "—"}
          icon={<Banknote className="h-5 w-5 text-indigo-600" aria-hidden />}
        />

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              Taxa efetiva:{" "}
              <strong>
                {out
                  ? (out.iMes * 100).toLocaleString("pt-BR", {
                      maximumFractionDigits: 4,
                    })
                  : "—"}
                % a.m.
              </strong>{" "}
              •{" "}
              <strong>
                {out
                  ? (out.iAno * 100).toLocaleString("pt-BR", {
                      maximumFractionDigits: 4,
                    })
                  : "—"}
                % a.a.
              </strong>{" "}
              • Prazo: <strong>{out ? `${out.n} meses` : "—"}</strong>
            </div>
          </div>

          {/* Chart saldo */}
          <div className="mt-4 h-56 w-full">
            {out ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={out.tabela}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <RTooltip
                    formatter={(v: number | string) => fmtMoneyBRL(Number(v))}
                    labelFormatter={(l: number) => `Parcela ${l}`}
                  />

                  <Area type="monotone" dataKey="saldo" stroke="#6366f1" fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                Preencha os campos para ver o gráfico.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabela */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-3 text-sm font-medium text-slate-700">
          Tabela de amortização
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-slate-600">
              <tr>
                <Th>#</Th>
                <Th>Prestação</Th>
                <Th>Juros</Th>
                <Th>Amortização</Th>
                <Th>Saldo</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {out ? (
                out.tabela.map((r) => (
                  <tr key={r.t} className="hover:bg-slate-50/60">
                    <Td>{fmtBR(r.t)}</Td>
                    <Td>{fmtMoneyBRL(r.prest)}</Td>
                    <Td>{fmtMoneyBRL(r.juros)}</Td>
                    <Td>{fmtMoneyBRL(r.amort)}</Td>
                    <Td>{fmtMoneyBRL(r.saldo)}</Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={5} className="text-slate-500">
                    —
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ========= small UI pieces ========= */

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

function Card({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-slate-600">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-3 py-2 font-medium">
      {children}
    </th>
  );
}
function Td({
  children,
  colSpan,
  className,
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}) {
  return (
    <td className={`px-3 py-2 ${className ?? ""}`} colSpan={colSpan}>
      {children}
    </td>
  );
}
