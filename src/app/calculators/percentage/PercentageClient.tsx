"use client";

import { useMemo, useState } from "react";
import { Percent, ArrowRightLeft, ArrowUpRight, ArrowDownRight, PieChart } from "lucide-react";

type TabKey = "basico" | "reajuste" | "variacao" | "proporcao";

function numBR(s: string): number {
  // aceita "1.234,56" e "1234,56" e "1234.56"
  if (typeof s !== "string") return Number(s);
  const trimmed = s.trim();
  if (!trimmed) return 0;
  // remove separador de milhar e troca vírgula por ponto
  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function fmtBR(n: number, frac: number = 2): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  });
}

export default function PercentageClient() {
  const [tab, setTab] = useState<TabKey>("basico");

  // Básico: “X% de V”
  const [pBasico, setPBasico] = useState("10");
  const [vBasico, setVBasico] = useState("100");

  // Reajuste: aumento/desc. “V ± P%”
  const [vReaj, setVReaj] = useState("100");
  const [pReaj, setPReaj] = useState("10");
  const [tipoReaj, setTipoReaj] = useState<"aumento" | "desconto">("aumento");

  // Variação: de A → B, retorna % (positivo/negativo)
  const [vAnt, setVAnt] = useState("100");
  const [vNovo, setVNovo] = useState("120");

  // Proporção: “parte em relação ao total”, retorna %
  const [parte, setParte] = useState("25");
  const [total, setTotal] = useState("200");

  const basico = useMemo(() => {
    const p = numBR(pBasico);
    const v = numBR(vBasico);
    return {
      percentual: p,
      base: v,
      resultado: (p / 100) * v,
    };
  }, [pBasico, vBasico]);

  const reajuste = useMemo(() => {
    const v = numBR(vReaj);
    const p = numBR(pReaj);
    const fator = tipoReaj === "aumento" ? 1 + p / 100 : 1 - p / 100;
    return {
      original: v,
      percentual: p,
      tipo: tipoReaj,
      fator,
      resultado: v * fator,
      deltaAbs: v * (fator - 1),
    };
  }, [vReaj, pReaj, tipoReaj]);

  const variacao = useMemo(() => {
    const a = numBR(vAnt);
    const b = numBR(vNovo);
    const pct = a === 0 ? 0 : ((b - a) / a) * 100;
    return {
      anterior: a,
      novo: b,
      pct,
      direcao: pct >= 0 ? "aumento" : "queda",
      deltaAbs: b - a,
    };
  }, [vAnt, vNovo]);

  const proporcao = useMemo(() => {
    const x = numBR(parte);
    const t = numBR(total);
    const pct = t === 0 ? 0 : (x / t) * 100;
    return { parte: x, total: t, pct };
  }, [parte, total]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Percent className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Porcentagem</h1>
          <p className="text-slate-500">Desconto, aumento, variação e proporção.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "basico"} onClick={() => setTab("basico")} label="Básico" />
        <TabButton active={tab === "reajuste"} onClick={() => setTab("reajuste")} label="Reajuste" />
        <TabButton active={tab === "variacao"} onClick={() => setTab("variacao")} label="Variação" />
        <TabButton active={tab === "proporcao"} onClick={() => setTab("proporcao")} label="Proporção (%)" />
      </div>

      {/* Cards */}
      {tab === "basico" && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label htmlFor="pBasico" className="block text-sm font-medium text-slate-700">
              Percentual (%)
            </label>
            <input
              id="pBasico"
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              value={pBasico}
              onChange={(e) => setPBasico(e.target.value)}
              placeholder="10"
            />
            <label htmlFor="vBasico" className="mt-4 block text-sm font-medium text-slate-700">
              Valor base
            </label>
            <input
              id="vBasico"
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              value={vBasico}
              onChange={(e) => setVBasico(e.target.value)}
              placeholder="100"
            />
          </div>

          <ResultCard title={`${fmtBR(basico.percentual, 2)}% de ${fmtBR(basico.base, 2)}`} value={fmtBR(basico.resultado, 2)} />
        </section>
      )}

      {tab === "reajuste" && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label htmlFor="vReaj" className="block text-sm font-medium text-slate-700">
              Valor original
            </label>
            <input
              id="vReaj"
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              value={vReaj}
              onChange={(e) => setVReaj(e.target.value)}
              placeholder="100"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pReaj" className="block text-sm font-medium text-slate-700">
                  Percentual (%)
                </label>
                <input
                  id="pReaj"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  value={pReaj}
                  onChange={(e) => setPReaj(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-700">Tipo</span>
                <div className="mt-1 inline-flex w-full overflow-hidden rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setTipoReaj("aumento")}
                    className={`flex w-1/2 items-center justify-center gap-2 p-2 text-sm ${tipoReaj === "aumento" ? "bg-indigo-600 text-white" : "bg-white text-slate-700"}`}
                    aria-pressed={tipoReaj === "aumento"}
                    aria-label="Aumento percentual"
                  >
                    <ArrowUpRight className="h-4 w-4" /> Aumento
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoReaj("desconto")}
                    className={`flex w-1/2 items-center justify-center gap-2 p-2 text-sm ${tipoReaj === "desconto" ? "bg-indigo-600 text-white" : "bg-white text-slate-700"}`}
                    aria-pressed={tipoReaj === "desconto"}
                    aria-label="Desconto percentual"
                  >
                    <ArrowDownRight className="h-4 w-4" /> Desconto
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ResultCard
            title={`${tipoReaj === "aumento" ? "Aumento" : "Desconto"} de ${fmtBR(reajuste.percentual, 2)}% sobre ${fmtBR(reajuste.original, 2)}`}
            value={fmtBR(reajuste.resultado, 2)}
            sub={`Variação: ${reajuste.deltaAbs >= 0 ? "+" : ""}${fmtBR(reajuste.deltaAbs, 2)} (${tipoReaj})`}
          />
        </section>
      )}

      {tab === "variacao" && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="vAnt" className="block text-sm font-medium text-slate-700">
                  Valor anterior
                </label>
                <input
                  id="vAnt"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  value={vAnt}
                  onChange={(e) => setVAnt(e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <label htmlFor="vNovo" className="block text-sm font-medium text-slate-700">
                  Valor novo
                </label>
                <input
                  id="vNovo"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  value={vNovo}
                  onChange={(e) => setVNovo(e.target.value)}
                  placeholder="120"
                />
              </div>
            </div>
          </div>

          <ResultCard
            title={`Variação de ${fmtBR(variacao.anterior, 2)} → ${fmtBR(variacao.novo, 2)}`}
            value={`${variacao.pct >= 0 ? "+" : ""}${fmtBR(variacao.pct, 2)}%`}
            icon={<ArrowRightLeft className="h-5 w-5" aria-hidden />}
            sub={`Δ absoluto: ${variacao.deltaAbs >= 0 ? "+" : ""}${fmtBR(variacao.deltaAbs, 2)} (${variacao.direcao})`}
          />
        </section>
      )}

      {tab === "proporcao" && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="parte" className="block text-sm font-medium text-slate-700">
                  Parte
                </label>
                <input
                  id="parte"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  value={parte}
                  onChange={(e) => setParte(e.target.value)}
                  placeholder="25"
                />
              </div>
              <div>
                <label htmlFor="total" className="block text-sm font-medium text-slate-700">
                  Total
                </label>
                <input
                  id="total"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="200"
                />
              </div>
            </div>
          </div>

          <ResultCard
            title={`Proporção de ${fmtBR(proporcao.parte, 2)} em ${fmtBR(proporcao.total, 2)}`}
            value={`${fmtBR(proporcao.pct, 2)}%`}
            icon={<PieChart className="h-5 w-5" aria-hidden />}
          />
        </section>
      )}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white shadow"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function ResultCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-700">{title}</h2>
        {icon ?? <Percent className="h-5 w-5 text-indigo-600" aria-hidden />}
      </div>
      <div className="text-3xl font-semibold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-sm text-slate-500">{sub}</div>}
    </div>
  );
}
