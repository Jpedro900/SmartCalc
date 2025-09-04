"use client";

import { useMemo, useState, ReactNode } from "react";

/* ========== helpers ========== */

function parseNum(s: string) {
  const n = Number(
    String(s)
      .replace(/[^\d,.-]/g, "")
      .replace(",", ".")
  );
  return Number.isFinite(n) ? n : NaN;
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
}

/* ========== UI básicos ========== */

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function InlineBox({
  value,
  onChange,
  placeholder,
  readOnly = false,
  width = "12ch",
}: {
  value: string;
  onChange?: (s: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  width?: string;
}) {
  return (
    <input
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      inputMode="decimal"
      placeholder={placeholder}
      readOnly={readOnly}
      style={{ width }}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm outline-none"
    />
  );
}

function Pill() {
  return (
    <span className="rounded-md bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
      ESTÁ PARA
    </span>
  );
}

function Tabs({
  value,
  onChange,
}: {
  value: "simples" | "composta";
  onChange: (v: "simples" | "composta") => void;
}) {
  const btn = "px-3 py-2 text-sm font-medium rounded-lg border transition-colors";
  return (
    <div className="inline-flex gap-2 rounded-xl bg-slate-100 p-1">
      <button
        className={`${btn} ${
          value === "simples"
            ? "bg-white border-slate-300"
            : "bg-transparent border-transparent text-slate-600 hover:text-slate-900"
        }`}
        onClick={() => onChange("simples")}
      >
        Regra de 3 Simples
      </button>
      <button
        className={`${btn} ${
          value === "composta"
            ? "bg-white border-slate-300"
            : "bg-transparent border-transparent text-slate-600 hover:text-slate-900"
        }`}
        onClick={() => onChange("composta")}
      >
        Regra de 3 Composta
      </button>
    </div>
  );
}

/* ========== Página ========== */

type Rel = "direta" | "inversa";
type Row = { a: string; b: string; rel: Rel };

export default function RegraDe3Client() {
  const [tab, setTab] = useState<"simples" | "composta">("simples");

  /* ---- simples ---- */
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const xSimple = useMemo(() => {
    const A = parseNum(a);
    const B = parseNum(b);
    const C = parseNum(c);
    if (!Number.isFinite(A) || A === 0 || !Number.isFinite(B) || !Number.isFinite(C)) return NaN;
    return (B * C) / A;
  }, [a, b, c]);

  /* ---- composta ---- */
  const [baseC, setBaseC] = useState("");
  const [rows, setRows] = useState<Row[]>([
    { a: "", b: "", rel: "direta" },
    { a: "", b: "", rel: "direta" },
  ]);

  const xComposite = useMemo(() => {
    const C = parseNum(baseC);
    if (!Number.isFinite(C)) return NaN;

    let factor = 1;
    for (const r of rows) {
      const A = parseNum(r.a);
      const B = parseNum(r.b);
      if (!Number.isFinite(A) || !Number.isFinite(B) || A === 0 || B === 0) return NaN;
      factor *= r.rel === "direta" ? B / A : A / B;
    }
    return C * factor;
  }, [baseC, rows]);

  function addRow() {
    setRows((rs) => [...rs, { a: "", b: "", rel: "direta" }]);
  }
  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }
  function updateRow(i: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Regra de 3</h1>
      <p className="mt-2 text-sm text-slate-600">
        Preencha os campos. O cálculo é automático. Na <b>composta</b>, indique se cada grandeza é{" "}
        <b>direta</b> ou <b>inversa</b> em relação ao resultado.
      </p>

      <div className="mt-4">
        <Tabs value={tab} onChange={setTab} />
      </div>

      {tab === "simples" ? (
        <div className="mt-6 space-y-6">
          <Card title="Regra de 3 Simples">
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex items-center gap-2">
                <InlineBox value={a} onChange={setA} placeholder="A" width="14ch" />
                <Pill />
                <InlineBox value={b} onChange={setB} placeholder="B" width="14ch" />
              </div>

              <div className="text-xs font-semibold tracking-wide text-slate-500">ASSIM COMO</div>

              <div className="flex items-center gap-2">
                <InlineBox value={c} onChange={setC} placeholder="C" width="14ch" />
                <Pill />
                <InlineBox value={fmt(xSimple)} readOnly placeholder="X" width="14ch" />
              </div>
            </div>
          </Card>

          <div className="text-xs text-slate-500">
            Fórmula: <code>X = (B × C) ÷ A</code>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <Card title="Regra de 3 Composta">
            <div className="space-y-3">
              {/* linha base C -> X */}
              <div className="flex items-center justify-center gap-2">
                <InlineBox value={baseC} onChange={setBaseC} placeholder="C (base)" width="16ch" />
                <Pill />
                <InlineBox value={fmt(xComposite)} readOnly placeholder="X" width="16ch" />
              </div>

              {/* linhas de grandezas */}
              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Grandezas (adicione quantas precisar)
                </div>

                <div className="space-y-2">
                  {rows.map((r, i) => (
                    <div key={i} className="flex flex-wrap items-center justify-center gap-2">
                      <InlineBox
                        value={r.a}
                        onChange={(v) => updateRow(i, { a: v })}
                        placeholder={`A${i + 1}`}
                        width="12ch"
                      />

                      <select
                        value={r.rel}
                        onChange={(e) => updateRow(i, { rel: e.target.value as Rel })}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          r.rel === "direta"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"
                        }`}
                        title="Relação com o resultado"
                      >
                        <option value="direta">direta</option>
                        <option value="inversa">inversa</option>
                      </select>

                      <Pill />

                      <InlineBox
                        value={r.b}
                        onChange={(v) => updateRow(i, { b: v })}
                        placeholder={`B${i + 1}`}
                        width="12ch"
                      />

                      <button
                        onClick={() => removeRow(i)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                        title="Remover linha"
                        type="button"
                      >
                        remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-center">
                  <button
                    onClick={addRow}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    type="button"
                  >
                    + adicionar grandeza
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-xs text-slate-500">
            Fórmula (composta):{" "}
            <code>
              X = C × ∏[
              <span className="text-emerald-700">direta</span>: (Bᵢ/Aᵢ),
              <span className="text-amber-700"> inversa</span>: (Aᵢ/Bᵢ)]
            </code>
          </div>
        </div>
      )}
    </main>
  );
}
