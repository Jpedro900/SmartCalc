"use client";

import { useMemo, useState } from "react";
import { Calculator, Percent, Calendar, Banknote, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";

type RateMode = "ad" | "am" | "aa"; // ao dia / ao mês / ao ano
type PeriodMode = "dias" | "meses" | "anos";

function parseNumBR(s: string): number {
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
function fmtMoneyBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtBR(n: number, max = 2) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: max });
}
function percentStrToFloat(p: string): number {
  const v = parseNumBR(p);
  return isFinite(v) ? v / 100 : NaN;
}

// converte taxa e período para uma base comum (todos em dias) para juros simples
function toDays(n: number, mode: PeriodMode): number {
  switch (mode) {
    case "dias":
      return Math.round(n);
    case "meses":
      return Math.round(n * 30);
    case "anos":
      return Math.round(n * 365);
  }
}
function ratePerDay(i: number, mode: RateMode): number {
  switch (mode) {
    case "ad":
      return i;
    case "am":
      return i / 30;
    case "aa":
      return i / 365;
  }
}

export default function JurosSimplesClient() {
  const [pvStr, setPvStr] = useState("1.000,00");
  const [iStr, setIStr] = useState("2"); // %
  const [rateMode, setRateMode] = useState<RateMode>("am");
  const [nStr, setNStr] = useState("6");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("meses");

  const parsed = useMemo(() => {
    const pv = parseNumBR(pvStr);
    const i = percentStrToFloat(iStr);
    const n = parseNumBR(nStr);

    if (!isFinite(pv) || pv <= 0 || !isFinite(i) || i < 0 || !isFinite(n) || n <= 0) {
      return null;
    }

    const dias = toDays(n, periodMode);
    const iDia = ratePerDay(i, rateMode);
    // Juros simples: J = PV * i * n
    const J = pv * iDia * dias;
    const M = pv + J;

    // construir série linear (proporcional aos dias)
    const step = Math.max(1, Math.floor(dias / 12));
    const data = [];
    for (let d = 0; d <= dias; d += step) {
      const j = pv * iDia * d;
      data.push({ t: d, montante: pv + j });
    }
    if (data[data.length - 1]?.t !== dias) {
      data.push({ t: dias, montante: M });
    }

    return { pv, iDia, dias, J, M, data };
  }, [pvStr, iStr, nStr, rateMode, periodMode]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Calculator className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Juros Simples</h1>
          <p className="text-slate-500">Cálculo do montante, juros e série temporal.</p>
        </div>
      </div>

      {/* inputs */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Valor inicial (PV)" icon={<Banknote className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              placeholder="Ex.: 1.000,00"
              value={pvStr}
              onChange={(e) => setPvStr(e.target.value)}
            />
          </Field>

          <Field label="Taxa" icon={<Percent className="h-4 w-4" />}>
            <div className="mt-1 flex gap-2">
              <input
                inputMode="decimal"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                placeholder="Ex.: 2"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
              <select
                className="min-w-[120px] rounded-lg border border-slate-300 bg-white p-2.5"
                value={rateMode}
                onChange={(e) => setRateMode(e.target.value as RateMode)}
              >
                <option value="ad">% a.d.</option>
                <option value="am">% a.m.</option>
                <option value="aa">% a.a.</option>
              </select>
            </div>
          </Field>

          <Field label="Período" icon={<Calendar className="h-4 w-4" />}>
            <div className="mt-1 flex gap-2">
              <input
                inputMode="numeric"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                placeholder="Ex.: 6"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
              />
              <select
                className="min-w-[120px] rounded-lg border border-slate-300 bg-white p-2.5"
                value={periodMode}
                onChange={(e) => setPeriodMode(e.target.value as PeriodMode)}
              >
                <option value="dias">dias</option>
                <option value="meses">meses</option>
                <option value="anos">anos</option>
              </select>
            </div>
          </Field>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Fórmula: <strong>J = PV × i × n</strong>. O montante é <strong>M = PV + J</strong>. A
            taxa e o período são convertidos para uma base comum (dias) para o cálculo.
          </p>
        </div>
      </section>

      {/* cards resumo */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Juros (J)" value={parsed ? fmtMoneyBRL(parsed.J) : "—"} />
        <Card title="Montante (M)" value={parsed ? fmtMoneyBRL(parsed.M) : "—"} />
        <Card title="Período (dias)" value={parsed ? fmtBR(parsed.dias, 0) : "—"} />

        {/* gráfico */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-3">
          <div className="text-sm text-slate-600">Montante ao longo do tempo</div>
          <div className="mt-3 h-56 w-full">
            {parsed ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={parsed.data}>
                  <defs>
                    <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <RTooltip
                    formatter={(value: number | string) => fmtMoneyBRL(Number(value))}
                    labelFormatter={(l: number) => `${l} dias`}
                  />
                  <Area type="monotone" dataKey="montante" stroke="#6366f1" fill="url(#gs)" />
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
