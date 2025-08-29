"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PeriodRate = "mensal" | "anual";
type PeriodUnit = "meses" | "anos";
type DepositTiming = "end" | "begin";
type AnnualConv = "effective" | "nominal";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function parseNum(s: string) {
  const n = Number(String(s).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function toMonthlyRate(ratePercent: number, period: PeriodRate, conv: AnnualConv) {
  const R = ratePercent / 100;
  if (period === "mensal") return R;
  return conv === "effective" ? Math.pow(1 + R, 1 / 12) - 1 : R / 12;
}

/** Converte duração para **meses** */
function toMonths(value: number, unit: PeriodUnit) {
  return unit === "meses" ? value : value * 12;
}

export default function JurosClient() {
  const [initial, setInitial] = useState("0");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("1"); // %
  const [ratePeriod, setRatePeriod] = useState<PeriodRate>("mensal");
  const [durValue, setDurValue] = useState("240");
  const [durUnit, setDurUnit] = useState<PeriodUnit>("meses");

  const [timing, setTiming] = useState<DepositTiming>("end");
  const [annualConv, setAnnualConv] = useState<AnnualConv>("effective");

  const [withdrawOn, setWithdrawOn] = useState(false);
  const [withdraw, setWithdraw] = useState("0");

  const {
    finalAmount,
    investedTotal,
    interestTotal,
    rows,
  } = useMemo(() => {
    const P0 = parseNum(initial) || 0;
    const PMT = parseNum(monthly) || 0;
    const r = toMonthlyRate(parseNum(rate) || 0, ratePeriod, annualConv);
    const n = toMonths(parseNum(durValue) || 0, durUnit);
    const WD = withdrawOn ? parseNum(withdraw) || 0 : 0;

    let balance = P0;
    let invAcc = P0;
    let interestAcc = 0;

    type Row = {
      mes: number;
      jurosMes: number;
      totalInvestido: number;
      totalJuros: number;
      totalAcumulado: number;
    };
    const data: Row[] = [];

    for (let m = 1; m <= n; m++) {
      if (timing === "begin") {
        balance += PMT;
        invAcc += PMT;
        if (WD > 0) balance -= WD;
      }

      // juros do mês
      const j = balance * r;
      balance += j;
      interestAcc += j;

      if (timing === "end") {
        balance += PMT;
        invAcc += PMT;
        if (WD > 0) balance -= WD;
      }

      data.push({
        mes: m,
        jurosMes: j,
        totalInvestido: invAcc,
        totalJuros: interestAcc,
        totalAcumulado: balance,
      });
    }

    return {
      finalAmount: balance,
      investedTotal: invAcc,
      interestTotal: interestAcc,
      rows: data,
    };
  }, [
    initial,
    monthly,
    rate,
    ratePeriod,
    durValue,
    durUnit,
    timing,
    annualConv,
    withdrawOn,
    withdraw,
  ]);

  const cards = [
    { label: "Valor total final", value: BRL.format(finalAmount) },
    { label: "Valor total investido", value: BRL.format(investedTotal) },
    { label: "Total em juros", value: BRL.format(interestTotal) },
  ];

  const badgeText =
    `Aportes: ${timing === "end" ? "fim do mês" : "início do mês"} • ` +
    `Taxa ${ratePeriod === "mensal" ? "mensal" : `anual (${annualConv === "effective" ? "efetiva" : "nominal"})`}`;

  const badgeTitle =
    timing === "end"
      ? "Anuidade ordinária: aporte no fim de cada mês.\nFV = P0(1+r)^n + PMT * ((1+r)^n - 1)/r"
      : "Anuidade antecipada: aporte no início de cada mês.\nFV = [P0(1+r)^n + PMT * ((1+r)^n - 1)/r] * (1+r)";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Simulador de Juros Compostos</h1>

      {/* Form */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Valor inicial"
            prefix="R$"
            value={initial}
            onChange={setInitial}
            placeholder="0,00"
          />
          <Field
            label="Valor mensal (aporte)"
            prefix="R$"
            value={monthly}
            onChange={setMonthly}
            placeholder="0,00"
          />
          <Field label="Taxa de juros" value={rate} onChange={setRate} placeholder="0" suffix="%">
            <select
              value={ratePeriod}
              onChange={(e) => setRatePeriod(e.target.value as PeriodRate)}
              className="rounded-md border border-slate-200 bg-white px-2 py-2 text-sm"
            >
              <option value="mensal">mensal</option>
              <option value="anual">anual</option>
            </select>
          </Field>

          <Field label="Período" value={durValue} onChange={setDurValue} placeholder="0">
            <select
              value={durUnit}
              onChange={(e) => setDurUnit(e.target.value as PeriodUnit)}
              className="rounded-md border border-slate-200 bg-white px-2 py-2 text-sm"
            >
              <option value="meses">mes(es)</option>
              <option value="anos">ano(s)</option>
            </select>
          </Field>

          {/* Opções avançadas */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Momento do aporte</label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value as DepositTiming)}
              className="rounded-md border border-slate-200 bg-white px-2 py-2 text-sm"
            >
              <option value="end">fim do mês (padrão)</option>
              <option value="begin">início do mês</option>
            </select>
          </div>

          {ratePeriod === "anual" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">Conversão anual</label>
              <select
                value={annualConv}
                onChange={(e) => setAnnualConv(e.target.value as AnnualConv)}
                className="rounded-md border border-slate-200 bg-white px-2 py-2 text-sm"
              >
                <option value="effective">efetiva ( (1+R)^1/12 − 1 )</option>
                <option value="nominal">nominal ( R/12 )</option>
              </select>
            </div>
          )}

          {/* ações */}
          <div className="flex items-end gap-3">
            <button
              className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
              onClick={() => void 0 }
            >
              Calcular
            </button>
            <button
              onClick={() => {
                setInitial("0");
                setMonthly("500");
                setRate("1");
                setRatePeriod("mensal");
                setDurValue("240");
                setDurUnit("meses");
                setTiming("end");
                setAnnualConv("effective");
                setWithdrawOn(false);
                setWithdraw("0");
              }}
              className="h-10 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Limpar
            </button>

            <label className="ml-auto inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={withdrawOn}
                onChange={(e) => setWithdrawOn(e.target.checked)}
              />
              Simular retiradas mensais
            </label>
          </div>

          {withdrawOn && (
            <Field
              label="Retirada mensal"
              prefix="R$"
              value={withdraw}
              onChange={setWithdraw}
              placeholder="0,00"
            />
          )}
        </div>
      </section>

      {/* Resultado */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Resultado</h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-xs font-medium text-slate-600">{c.label}</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Badge + Gráfico */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">Gráfico</div>
            <span
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              title={badgeTitle}
            >
              {badgeText}
            </span>
          </div>

          <div className="h-72 w-full rounded-xl border border-slate-200 bg-white p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(v: number) => BRL.format(v).replace("R$", "")} />
                <Tooltip
                  formatter={(value: number) => BRL.format(value)}
                  labelFormatter={(l: number) => `Mês ${l}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalAcumulado"
                  name="Total acumulado"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="totalJuros"
                  name="Total em juros"
                  stroke="#b91c1c"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalInvestido"
                  name="Valor investido"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela */}
        <div className="mt-6">
          <div className="mb-2 text-sm font-medium text-slate-900">Tabela</div>
          <div className="max-h-96 overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr className="text-left">
                  <Th>Mês</Th>
                  <Th>Juros</Th>
                  <Th>Total Investido</Th>
                  <Th>Total Juros</Th>
                  <Th>Total Acumulado</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.mes} className="odd:bg-white even:bg-slate-50">
                    <Td>{r.mes}</Td>
                    <Td>{BRL.format(r.jurosMes)}</Td>
                    <Td>{BRL.format(r.totalInvestido)}</Td>
                    <Td>{BRL.format(r.totalJuros)}</Td>
                    <Td className="font-medium">{BRL.format(r.totalAcumulado)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======= Subcomponentes de UI ======= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  children,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <div className="inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
          {prefix ? <span className="text-slate-500 text-sm">{prefix}</span> : null}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            inputMode="decimal"
            placeholder={placeholder}
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
          {suffix ? <span className="text-slate-500 text-sm">{suffix}</span> : null}
        </div>
        {children}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-xs font-semibold text-slate-700">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-slate-700 ${className}`}>{children}</td>;
}
