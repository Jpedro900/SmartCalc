"use client";

import { useState } from "react";

/* ======= helpers ======= */
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percent  = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseNum(s: string) {
  const n = Number(String(s).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function fmtMoney(n: number) {
  return Number.isFinite(n) ? currency.format(n) : "—";
}
function fmtPercent(n: number) {
  return Number.isFinite(n) ? percent.format(n) : "—";
}

/* ======= UI atoms ======= */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function InlineInput({
  id, value, onChange, placeholder, prefix, suffix, width = "10ch",
  type = "text", readOnly = false,
}: {
  id?: string;
  value: string;
  onChange?: (s: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  width?: string;
  type?: "text" | "number";
  readOnly?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2">
      {prefix ? <span className="text-slate-500 text-sm">{prefix}</span> : null}
      <input
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        inputMode="decimal"
        className={`w-[${width}] bg-transparent py-2 outline-none text-slate-900`}
        type={type}
        readOnly={readOnly}
      />
      {suffix ? <span className="text-slate-500 text-sm">{suffix}</span> : null}
    </span>
  );
}

function Buttons({ onCalc, onClear }: { onCalc: () => void; onClear: () => void }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <button
        onClick={onCalc}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        CALCULAR
      </button>
      <button
        onClick={onClear}
        className="text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        LIMPAR
      </button>
    </div>
  );
}

/* ======= Página ======= */

export default function PercentagePage() {
  const [p1, setP1] = useState("");
  const [v1, setV1] = useState("");
  const [r1, setR1] = useState("");

  function calc1() {
    const p = parseNum(p1) / 100;
    const v = parseNum(v1);
    setR1(Number.isFinite(p * v) ? fmtMoney(p * v) : "—");
  }
  function clear1() { setP1(""); setV1(""); setR1(""); }

  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [r2, setR2] = useState("");
  function calc2() {
    const x = parseNum(x2), y = parseNum(y2);
    setR2(Number.isFinite(x / y) ? fmtPercent(x / y) : "—");
  }
  function clear2() { setX2(""); setY2(""); setR2(""); }

  const [a3, setA3] = useState("");
  const [b3, setB3] = useState("");
  const [r3, setR3] = useState("");
  function calc3() {
    const A = parseNum(a3), B = parseNum(b3);
    setR3(Number.isFinite((B - A) / A) ? fmtPercent((B - A) / A) : "—");
  }
  function clear3() { setA3(""); setB3(""); setR3(""); }

  const [a4, setA4] = useState("");
  const [b4, setB4] = useState("");
  const [r4, setR4] = useState("");
  function calc4() {
    const A = parseNum(a4), B = parseNum(b4);
    setR4(Number.isFinite((A - B) / A) ? fmtPercent((A - B) / A) : "—");
  }
  function clear4() { setA4(""); setB4(""); setR4(""); }

  const [v5, setV5] = useState("");
  const [p5, setP5] = useState("");
  const [r5, setR5] = useState("");
  function calc5() {
    const v = parseNum(v5), p = parseNum(p5) / 100;
    setR5(Number.isFinite(v * (1 + p)) ? fmtMoney(v * (1 + p)) : "—");
  }
  function clear5() { setV5(""); setP5(""); setR5(""); }

  const [v6, setV6] = useState("");
  const [p6, setP6] = useState("");
  const [r6, setR6] = useState("");
  function calc6() {
    const v = parseNum(v6), p = parseNum(p6) / 100;
    setR6(Number.isFinite(v * (1 - p)) ? fmtMoney(v * (1 - p)) : "—");
  }
  function clear6() { setV6(""); setP6(""); setR6(""); }

  const [vf7, setVf7] = useState("");
  const [p7, setP7] = useState("");
  const [r7, setR7] = useState("");
  function calc7() {
    const vf = parseNum(vf7), p = parseNum(p7) / 100;
    setR7(Number.isFinite(vf / (1 + p)) ? fmtMoney(vf / (1 + p)) : "—");
  }
  function clear7() { setVf7(""); setP7(""); setR7(""); }

  const [vf8, setVf8] = useState("");
  const [p8, setP8] = useState("");
  const [r8, setR8] = useState("");
  function calc8() {
    const vf = parseNum(vf8), p = parseNum(p8) / 100;
    setR8(Number.isFinite(vf / (1 - p)) ? fmtMoney(vf / (1 - p)) : "—");
  }
  function clear8() { setVf8(""); setP8(""); setR8(""); }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Calculadora de Porcentagem</h1>
      <p className="mt-2 text-sm text-slate-600">
        Preencha os campos nas frases abaixo e clique em <b>CALCULAR</b>. O resultado aparece logo ao lado.
      </p>

      <div className="mt-6 space-y-6">
        {/* 1 */}
        <Card title="Cálculo 1 — Quanto é X% de Y?">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Quanto é</span>
            <InlineInput value={p1} onChange={setP1} placeholder="0" suffix="%" width="7ch" />
            <span>de</span>
            <InlineInput value={v1} onChange={setV1} prefix="R$" placeholder="0" width="12ch" />
            <span>?</span>
            <InlineInput value={r1} readOnly prefix="R$" width="12ch" />
          </div>
          <Buttons onCalc={calc1} onClear={clear1} />
        </Card>

        {/* 2 */}
        <Card title="Cálculo 2 — X é qual porcentagem de Y?">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>O valor</span>
            <InlineInput value={x2} onChange={setX2} prefix="R$" placeholder="0" width="12ch" />
            <span>é qual porcentagem de</span>
            <InlineInput value={y2} onChange={setY2} prefix="R$" placeholder="0" width="12ch" />
            <span>?</span>
            <InlineInput value={r2} readOnly suffix="%" width="10ch" />
          </div>
          <Buttons onCalc={calc2} onClear={clear2} />
        </Card>

        {/* 3 */}
        <Card title="Cálculo 3 — Aumentou: qual foi o aumento percentual?">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Um valor de</span>
            <InlineInput value={a3} onChange={setA3} prefix="R$" placeholder="0" width="12ch" />
            <span>que</span>
            <b className="text-slate-900">AUMENTOU</b>
            <span>para</span>
            <InlineInput value={b3} onChange={setB3} prefix="R$" placeholder="0" width="12ch" />
            <span>→</span>
            <span className="text-slate-600">Aumento</span>
            <InlineInput value={r3} readOnly suffix="%" width="10ch" />
          </div>
          <Buttons onCalc={calc3} onClear={clear3} />
        </Card>

        {/* 4 */}
        <Card title="Cálculo 4 — Diminuiu: qual foi a diminuição percentual?">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Um valor de</span>
            <InlineInput value={a4} onChange={setA4} prefix="R$" placeholder="0" width="12ch" />
            <span>que</span>
            <b className="text-slate-900">DIMINUIU</b>
            <span>para</span>
            <InlineInput value={b4} onChange={setB4} prefix="R$" placeholder="0" width="12ch" />
            <span>→</span>
            <span className="text-slate-600">Redução</span>
            <InlineInput value={r4} readOnly suffix="%" width="10ch" />
          </div>
          <Buttons onCalc={calc4} onClear={clear4} />
        </Card>

        {/* 5 */}
        <Card title="Cálculo 5 — Aumentar um valor em X%">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Tenho</span>
            <InlineInput value={v5} onChange={setV5} prefix="R$" placeholder="0" width="12ch" />
            <span>e quero</span>
            <b className="text-slate-900">AUMENTAR</b>
            <InlineInput value={p5} onChange={setP5} suffix="%" placeholder="0" width="7ch" />
            <span>→</span>
            <span className="text-slate-600">Resultado</span>
            <InlineInput value={r5} readOnly prefix="R$" width="12ch" />
          </div>
          <Buttons onCalc={calc5} onClear={clear5} />
        </Card>

        {/* 6 */}
        <Card title="Cálculo 6 — Diminuir um valor em X%">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Tenho</span>
            <InlineInput value={v6} onChange={setV6} prefix="R$" placeholder="0" width="12ch" />
            <span>e quero</span>
            <b className="text-slate-900">DIMINUIR</b>
            <InlineInput value={p6} onChange={setP6} suffix="%" placeholder="0" width="7ch" />
            <span>→</span>
            <span className="text-slate-600">Resultado</span>
            <InlineInput value={r6} readOnly prefix="R$" width="12ch" />
          </div>
          <Buttons onCalc={calc6} onClear={clear6} />
        </Card>

        {/* 7 */}
        <Card title="Cálculo 7 — Sei o valor final e o % de aumento. Qual era o inicial?">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Valor final</span>
            <InlineInput value={vf7} onChange={setVf7} prefix="R$" placeholder="0" width="12ch" />
            <span>após</span>
            <InlineInput value={p7} onChange={setP7} suffix="%" placeholder="0" width="7ch" />
            <span>de aumento →</span>
            <span className="text-slate-600">Valor inicial</span>
            <InlineInput value={r7} readOnly prefix="R$" width="12ch" />
          </div>
          <Buttons onCalc={calc7} onClear={clear7} />
        </Card>

        {/* 8 */}
        <Card title="Cálculo 8 — Sei o valor final e o % de redução. Qual era o inicial?">
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Valor final</span>
            <InlineInput value={vf8} onChange={setVf8} prefix="R$" placeholder="0" width="12ch" />
            <span>após</span>
            <InlineInput value={p8} onChange={setP8} suffix="%" placeholder="0" width="7ch" />
            <span>de redução →</span>
            <span className="text-slate-600">Valor inicial</span>
            <InlineInput value={r8} readOnly prefix="R$" width="12ch" />
          </div>
          <Buttons onCalc={calc8} onClear={clear8} />
        </Card>
      </div>
    </main>
  );
}
