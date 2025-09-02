"use client";
import { useMemo, useState } from "react";

type Kind = "Área" | "Volume";
type Shape =
  | "Retângulo" | "Círculo" | "Triângulo"
  | "Cubo" | "Paralelepípedo" | "Cilindro";

const SHAPES: Record<Kind, Shape[]> = {
  "Área": ["Retângulo","Círculo","Triângulo"],
  "Volume": ["Cubo","Paralelepípedo","Cilindro"],
};

export default function AreaVolumeClient() {
  const [kind, setKind] = useState<Kind>("Área");
  const [shape, setShape] = useState<Shape>("Retângulo");
  const [a, setA] = useState(""), [b, setB] = useState(""), [c, setC] = useState("");

  const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c);

  const result = useMemo(() => {
    switch (shape) {
      case "Retângulo":      return Number.isFinite(A) && Number.isFinite(B) ? A * B : NaN;
      case "Círculo":        return Number.isFinite(A) ? Math.PI * Math.pow(A, 2) : NaN;
      case "Triângulo":      return Number.isFinite(A) && Number.isFinite(B) ? (A * B) / 2 : NaN;
      case "Cubo":           return Number.isFinite(A) ? Math.pow(A, 3) : NaN;
      case "Paralelepípedo": return [A,B,C].every(Number.isFinite) ? A * B * C : NaN;
      case "Cilindro":       return Number.isFinite(A) && Number.isFinite(B) ? Math.PI * Math.pow(A,2) * B : NaN;
      default: return NaN;
    }
  }, [shape, A, B, C]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Área & Volume</h1>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Select id="kind" label="Tipo" value={kind} onChange={(v)=>{
          const k = v as Kind; setKind(k); setShape(SHAPES[k][0]); setA(""); setB(""); setC("");
        }} options={Object.keys(SHAPES)} />
        <Select id="shape" label="Forma" value={shape} onChange={(v)=>{
          setShape(v as Shape); setA(""); setB(""); setC("");
        }} options={SHAPES[kind]} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {shape === "Retângulo" && (<><Field id="a" label="Lado A" v={a} setV={setA} /><Field id="b" label="Lado B" v={b} setV={setB} /></>)}
        {shape === "Círculo" && <Field id="a" label="Raio" v={a} setV={setA} />}
        {shape === "Triângulo" && (<><Field id="a" label="Base" v={a} setV={setA} /><Field id="b" label="Altura" v={b} setV={setB} /></>)}
        {shape === "Cubo" && <Field id="a" label="Aresta" v={a} setV={setA} />}
        {shape === "Paralelepípedo" && (<><Field id="a" label="Largura" v={a} setV={setA} /><Field id="b" label="Comprimento" v={b} setV={setB} /><Field id="c" label="Altura" v={c} setV={setC} /></>)}
        {shape === "Cilindro" && (<><Field id="a" label="Raio" v={a} setV={setA} /><Field id="b" label="Altura" v={b} setV={setB} /></>)}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm text-slate-600">Resultado</div>
        <div className="mt-1 text-3xl font-semibold">
          {Number.isFinite(result) ? result.toPrecision(6).replace(/\.?0+$/,"") : "--"}
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
