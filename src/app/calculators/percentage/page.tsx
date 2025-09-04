// "use client";

// import { useState } from "react";

// /* ======= helpers ======= */
// const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
// const percent  = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

// function parseNum(s: string) {
//   const n = Number(String(s).replace(/[^\d,.-]/g, "").replace(",", "."));
//   return Number.isFinite(n) ? n : NaN;
// }

// function fmtMoney(n: number) {
//   return Number.isFinite(n) ? currency.format(n) : "—";
// }
// function fmtPercent(n: number) {
//   return Number.isFinite(n) ? percent.format(n) : "—";
// }

// /* ======= UI atoms ======= */

// function Card({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
//       <h2 className="text-base font-semibold text-slate-900">{title}</h2>
//       <div className="mt-3">{children}</div>
//     </section>
//   );
// }

// function InlineInput({
//   id, value, onChange, placeholder, prefix, suffix, width = "10ch",
//   type = "text", readOnly = false,
// }: {
//   id?: string;
//   value: string;
//   onChange?: (s: string) => void;
//   placeholder?: string;
//   prefix?: string;
//   suffix?: string;
//   width?: string;
//   type?: "text" | "number";
//   readOnly?: boolean;
// }) {
//   return (
//     <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2">
//       {prefix ? <span className="text-slate-500 text-sm">{prefix}</span> : null}
//       <input
//         id={id}
//         value={value}
//         onChange={(e) => onChange?.(e.target.value)}
//         placeholder={placeholder}
//         inputMode="decimal"
//         className={`w-[${width}] bg-transparent py-2 outline-none text-slate-900`}
//         type={type}
//         readOnly={readOnly}
//       />
//       {suffix ? <span className="text-slate-500 text-sm">{suffix}</span> : null}
//     </span>
//   );
// }

// function Buttons({ onCalc, onClear }: { onCalc: () => void; onClear: () => void }) {
//   return (
//     <div className="mt-3 flex items-center gap-3">
//       <button
//         onClick={onCalc}
//         className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//       >
//         CALCULAR
//       </button>
//       <button
//         onClick={onClear}
//         className="text-sm font-medium text-slate-600 hover:text-slate-900"
//       >
//         LIMPAR
//       </button>
//     </div>
//   );
// }

// /* ======= Página ======= */

// export default function PercentagePage() {
//   const [p1, setP1] = useState("");
//   const [v1, setV1] = useState("");
//   const [r1, setR1] = useState("");

//   function calc1() {
//     const p = parseNum(p1) / 100;
//     const v = parseNum(v1);
//     setR1(Number.isFinite(p * v) ? fmtMoney(p * v) : "—");
//   }
//   function clear1() { setP1(""); setV1(""); setR1(""); }

//   const [x2, setX2] = useState("");
//   const [y2, setY2] = useState("");
//   const [r2, setR2] = useState("");
//   function calc2() {
//     const x = parseNum(x2), y = parseNum(y2);
//     setR2(Number.isFinite(x / y) ? fmtPercent(x / y) : "—");
//   }
//   function clear2() { setX2(""); setY2(""); setR2(""); }

//   const [a3, setA3] = useState("");
//   const [b3, setB3] = useState("");
//   const [r3, setR3] = useState("");
//   function calc3() {
//     const A = parseNum(a3), B = parseNum(b3);
//     setR3(Number.isFinite((B - A) / A) ? fmtPercent((B - A) / A) : "—");
//   }
//   function clear3() { setA3(""); setB3(""); setR3(""); }

//   const [a4, setA4] = useState("");
//   const [b4, setB4] = useState("");
//   const [r4, setR4] = useState("");
//   function calc4() {
//     const A = parseNum(a4), B = parseNum(b4);
//     setR4(Number.isFinite((A - B) / A) ? fmtPercent((A - B) / A) : "—");
//   }
//   function clear4() { setA4(""); setB4(""); setR4(""); }

//   const [v5, setV5] = useState("");
//   const [p5, setP5] = useState("");
//   const [r5, setR5] = useState("");
//   function calc5() {
//     const v = parseNum(v5), p = parseNum(p5) / 100;
//     setR5(Number.isFinite(v * (1 + p)) ? fmtMoney(v * (1 + p)) : "—");
//   }
//   function clear5() { setV5(""); setP5(""); setR5(""); }

//   const [v6, setV6] = useState("");
//   const [p6, setP6] = useState("");
//   const [r6, setR6] = useState("");
//   function calc6() {
//     const v = parseNum(v6), p = parseNum(p6) / 100;
//     setR6(Number.isFinite(v * (1 - p)) ? fmtMoney(v * (1 - p)) : "—");
//   }
//   function clear6() { setV6(""); setP6(""); setR6(""); }

//   const [vf7, setVf7] = useState("");
//   const [p7, setP7] = useState("");
//   const [r7, setR7] = useState("");
//   function calc7() {
//     const vf = parseNum(vf7), p = parseNum(p7) / 100;
//     setR7(Number.isFinite(vf / (1 + p)) ? fmtMoney(vf / (1 + p)) : "—");
//   }
//   function clear7() { setVf7(""); setP7(""); setR7(""); }

//   const [vf8, setVf8] = useState("");
//   const [p8, setP8] = useState("");
//   const [r8, setR8] = useState("");
//   function calc8() {
//     const vf = parseNum(vf8), p = parseNum(p8) / 100;
//     setR8(Number.isFinite(vf / (1 - p)) ? fmtMoney(vf / (1 - p)) : "—");
//   }
//   function clear8() { setVf8(""); setP8(""); setR8(""); }

//   return (
//     <main className="mx-auto max-w-4xl px-4 py-8">
//       <h1 className="text-2xl font-bold">Calculadora de Porcentagem</h1>
//       <p className="mt-2 text-sm text-slate-600">
//         Preencha os campos nas frases abaixo e clique em <b>CALCULAR</b>. O resultado aparece logo ao lado.
//       </p>

//       <div className="mt-6 space-y-6">
//         {/* 1 */}
//         <Card title="Cálculo 1 — Quanto é X% de Y?">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Quanto é</span>
//             <InlineInput value={p1} onChange={setP1} placeholder="0" suffix="%" width="7ch" />
//             <span>de</span>
//             <InlineInput value={v1} onChange={setV1} prefix="R$" placeholder="0" width="12ch" />
//             <span>?</span>
//             <InlineInput value={r1} readOnly prefix="R$" width="12ch" />
//           </div>
//           <Buttons onCalc={calc1} onClear={clear1} />
//         </Card>

//         {/* 2 */}
//         <Card title="Cálculo 2 — X é qual porcentagem de Y?">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>O valor</span>
//             <InlineInput value={x2} onChange={setX2} prefix="R$" placeholder="0" width="12ch" />
//             <span>é qual porcentagem de</span>
//             <InlineInput value={y2} onChange={setY2} prefix="R$" placeholder="0" width="12ch" />
//             <span>?</span>
//             <InlineInput value={r2} readOnly suffix="%" width="10ch" />
//           </div>
//           <Buttons onCalc={calc2} onClear={clear2} />
//         </Card>

//         {/* 3 */}
//         <Card title="Cálculo 3 — Aumentou: qual foi o aumento percentual?">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Um valor de</span>
//             <InlineInput value={a3} onChange={setA3} prefix="R$" placeholder="0" width="12ch" />
//             <span>que</span>
//             <b className="text-slate-900">AUMENTOU</b>
//             <span>para</span>
//             <InlineInput value={b3} onChange={setB3} prefix="R$" placeholder="0" width="12ch" />
//             <span>→</span>
//             <span className="text-slate-600">Aumento</span>
//             <InlineInput value={r3} readOnly suffix="%" width="10ch" />
//           </div>
//           <Buttons onCalc={calc3} onClear={clear3} />
//         </Card>

//         {/* 4 */}
//         <Card title="Cálculo 4 — Diminuiu: qual foi a diminuição percentual?">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Um valor de</span>
//             <InlineInput value={a4} onChange={setA4} prefix="R$" placeholder="0" width="12ch" />
//             <span>que</span>
//             <b className="text-slate-900">DIMINUIU</b>
//             <span>para</span>
//             <InlineInput value={b4} onChange={setB4} prefix="R$" placeholder="0" width="12ch" />
//             <span>→</span>
//             <span className="text-slate-600">Redução</span>
//             <InlineInput value={r4} readOnly suffix="%" width="10ch" />
//           </div>
//           <Buttons onCalc={calc4} onClear={clear4} />
//         </Card>

//         {/* 5 */}
//         <Card title="Cálculo 5 — Aumentar um valor em X%">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Tenho</span>
//             <InlineInput value={v5} onChange={setV5} prefix="R$" placeholder="0" width="12ch" />
//             <span>e quero</span>
//             <b className="text-slate-900">AUMENTAR</b>
//             <InlineInput value={p5} onChange={setP5} suffix="%" placeholder="0" width="7ch" />
//             <span>→</span>
//             <span className="text-slate-600">Resultado</span>
//             <InlineInput value={r5} readOnly prefix="R$" width="12ch" />
//           </div>
//           <Buttons onCalc={calc5} onClear={clear5} />
//         </Card>

//         {/* 6 */}
//         <Card title="Cálculo 6 — Diminuir um valor em X%">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Tenho</span>
//             <InlineInput value={v6} onChange={setV6} prefix="R$" placeholder="0" width="12ch" />
//             <span>e quero</span>
//             <b className="text-slate-900">DIMINUIR</b>
//             <InlineInput value={p6} onChange={setP6} suffix="%" placeholder="0" width="7ch" />
//             <span>→</span>
//             <span className="text-slate-600">Resultado</span>
//             <InlineInput value={r6} readOnly prefix="R$" width="12ch" />
//           </div>
//           <Buttons onCalc={calc6} onClear={clear6} />
//         </Card>

//         {/* 7 */}
//         <Card title="Cálculo 7 — Sei o valor final e o % de aumento. Qual era o inicial?">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Valor final</span>
//             <InlineInput value={vf7} onChange={setVf7} prefix="R$" placeholder="0" width="12ch" />
//             <span>após</span>
//             <InlineInput value={p7} onChange={setP7} suffix="%" placeholder="0" width="7ch" />
//             <span>de aumento →</span>
//             <span className="text-slate-600">Valor inicial</span>
//             <InlineInput value={r7} readOnly prefix="R$" width="12ch" />
//           </div>
//           <Buttons onCalc={calc7} onClear={clear7} />
//         </Card>

//         {/* 8 */}
//         <Card title="Cálculo 8 — Sei o valor final e o % de redução. Qual era o inicial?">
//           <div className="flex flex-wrap items-center gap-2 leading-8">
//             <span>Valor final</span>
//             <InlineInput value={vf8} onChange={setVf8} prefix="R$" placeholder="0" width="12ch" />
//             <span>após</span>
//             <InlineInput value={p8} onChange={setP8} suffix="%" placeholder="0" width="7ch" />
//             <span>de redução →</span>
//             <span className="text-slate-600">Valor inicial</span>
//             <InlineInput value={r8} readOnly prefix="R$" width="12ch" />
//           </div>
//           <Buttons onCalc={calc8} onClear={clear8} />
//         </Card>
//       </div>
//     </main>
//   );
// }
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
        <TabButton
          active={tab === "reajuste"}
          onClick={() => setTab("reajuste")}
          label="Reajuste"
        />
        <TabButton
          active={tab === "variacao"}
          onClick={() => setTab("variacao")}
          label="Variação"
        />
        <TabButton
          active={tab === "proporcao"}
          onClick={() => setTab("proporcao")}
          label="Proporção (%)"
        />
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

          <ResultCard
            title={`${fmtBR(basico.percentual, 2)}% de ${fmtBR(basico.base, 2)}`}
            value={fmtBR(basico.resultado, 2)}
          />
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
