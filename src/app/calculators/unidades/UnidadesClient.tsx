"use client";
import { useMemo, useState } from "react";

type Category = "Distância" | "Peso" | "Tempo";

const FACTORS = {
  "Distância": { base: "m", units: { m: 1, km: 1000, mi: 1609.344 } },
  "Peso":      { base: "g", units: { g: 1, kg: 1000, lb: 453.59237 } },
  "Tempo":     { base: "s", units: { s: 1, min: 60, h: 3600, day: 86400 } },
} as const;

export default function UnidadesClient() {
  const [cat, setCat] = useState<Category>("Distância");
  const [from, setFrom] = useState<string>("m");
  const [to, setTo] = useState<string>("km");
  const [value, setValue] = useState("");

  const V = parseFloat(value);
  const units = FACTORS[cat].units;
  const result = useMemo(() => {
    if (!Number.isFinite(V)) return NaN;
    const base = V * (units[from as keyof typeof units] ?? 1);
    return base / (units[to as keyof typeof units] ?? 1);
  }, [V, from, to, units]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Conversor de Unidades</h1>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Select id="cat" label="Categoria" value={cat} onChange={(v)=>{
          const next = v as Category;
          setCat(next);
          const u = Object.keys(FACTORS[next].units);
          setFrom(u[0]); setTo(u[1] ?? u[0]);
        }} options={Object.keys(FACTORS)} />
        <Select id="from" label="De" value={from} onChange={setFrom} options={Object.keys(units)} />
        <Select id="to" label="Para" value={to} onChange={setTo} options={Object.keys(units)} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field id="value" label="Valor" v={value} setV={setValue} />
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Resultado</div>
          <div className="mt-1 text-3xl font-semibold">{Number.isFinite(result) ? result.toPrecision(6).replace(/\.?0+$/,"") : "--"}</div>
        </div>
      </div>
    </main>
  );
}

function Field({ id, label, v, setV }: { id: string; label: string; v: string; setV: (s: string)=>void }) {
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={id}>{label}</label>
      <input id={id} inputMode="decimal" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
             value={v} onChange={e=>setV(e.target.value)} />
    </div>
  );
}
function Select({ id, label, value, onChange, options }:{
  id: string; label: string; value: string; onChange: (v: string)=>void; options: readonly string[] | string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e)=>onChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
