"use client";

"use client";

import { useMemo, useState } from "react";
import { Shape2D, Shape3D, SHAPES2D, SHAPES3D } from "./shapes";
import ShapeCanvas from "@/components/ShapeCanvas";
import { AREA_UNITS, LENGTH_UNITS, VOLUME_UNITS, byId } from "@/config/units-area-volume";

type Mode = "2d" | "3d" | "draw";
type Inputs = Record<string, string>;

const num = (s: string) => {
  const n = Number(String(s).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (v: number, frac = 6) =>
  Number.isFinite(v) ? v.toLocaleString("pt-BR", { maximumFractionDigits: frac }) : "";

const GRID_UNIT_LENGTH = 1;

function hasFormula(x: unknown): x is { formula?: string } {
  return !!x && typeof x === "object" && "formula" in (x as Record<string, unknown>);
}

export default function AreaVolumeClient() {
  const [mode, setMode] = useState<Mode>("2d");

  const [shape2d, setShape2d] = useState<Shape2D>(SHAPES2D[0]);
  const [shape3d, setShape3d] = useState<Shape3D>(SHAPES3D[0]);
  const [inputs2d, setInputs2d] = useState<Inputs>({});
  const [inputs3d, setInputs3d] = useState<Inputs>({});

  const [lenId, setLenId] = useState("m");
  const [areaId, setAreaId] = useState("m²");
  const [volId, setVolId] = useState("m³");

  const [polyAreaPx2, setPolyAreaPx2] = useState<number>(0);

  const lenSI = byId(LENGTH_UNITS, lenId).toSI;
  const areaSI = byId(AREA_UNITS, areaId).toSI;
  const volSI = byId(VOLUME_UNITS, volId).toSI;

  const pxToMeter = (GRID_UNIT_LENGTH * lenSI) / 20;

  const area = useMemo(() => {
    if (mode !== "2d") return NaN;
    const vals: Record<string, number> = {};
    for (const p of shape2d.params ?? []) {
      const v = num(inputs2d[p.id] ?? "");
      if (!Number.isFinite(v)) return NaN;
      vals[p.id] = v * lenSI;
    }
    const a_m2 = shape2d.area(vals);
    return a_m2 / areaSI;
  }, [mode, shape2d, inputs2d, lenSI, areaSI]);

  const vol = useMemo(() => {
    if (mode !== "3d") return NaN;
    const vals: Record<string, number> = {};
    for (const p of shape3d.params ?? []) {
      const v = num(inputs3d[p.id] ?? "");
      if (!Number.isFinite(v)) return NaN;
      vals[p.id] = v * lenSI;
    }
    const v_m3 = shape3d.volume(vals);
    return v_m3 / volSI;
  }, [mode, shape3d, inputs3d, lenSI, volSI]);

  const polyAreaDisplay = useMemo(() => {
    if (mode !== "draw") return "";
    const area_m2 = polyAreaPx2 * (pxToMeter * pxToMeter);
    const a = area_m2 / areaSI;
    return fmt(Math.abs(a));
  }, [mode, polyAreaPx2, pxToMeter, areaSI]);

  function syncOutputsForLength(newLenId: string) {
    const base = byId(LENGTH_UNITS, newLenId).id;
    const a = base + "²";
    const v = base + "³";
    if (AREA_UNITS.some(u => u.id === a)) setAreaId(a);
    if (VOLUME_UNITS.some(u => u.id === v)) setVolId(v);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Área & Volume</h1>
      <p className="mt-2 text-sm text-slate-600">
        Conversão automática de unidades. O desenho usa a escala do comprimento selecionado.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <UnitSelect
          label="Comprimento"
          value={lenId}
          options={LENGTH_UNITS.map(u => u.id)}
          onChange={(id) => { setLenId(id); syncOutputsForLength(id); }}
        />
        <UnitSelect
          label="Área"
          value={areaId}
          options={AREA_UNITS.map(u => u.id)}
          onChange={setAreaId}
        />
        <UnitSelect
          label="Volume"
          value={volId}
          options={VOLUME_UNITS.map(u => u.id)}
          onChange={setVolId}
        />
      </div>

      <div className="mt-4 inline-flex rounded-lg bg-slate-100 p-1">
        <TabBtn on={() => setMode("2d")} active={mode === "2d"}>2D (Área)</TabBtn>
        <TabBtn on={() => setMode("3d")} active={mode === "3d"}>3D (Volume)</TabBtn>
        <TabBtn on={() => setMode("draw")} active={mode === "draw"}>Desenhar</TabBtn>
      </div>

      {mode === "2d" && (
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <FigureForm2D
            shape={shape2d}
            setShape={(s) => { setShape2d(s); setInputs2d({}); }}
            inputs={inputs2d}
            setInputs={setInputs2d}
            lenId={lenId}
          />
          <FigureCard
            title={shape2d.name}
            formula={hasFormula(shape2d) ? shape2d.formula : undefined}
            resultLabel="Área"
            result={fmt(area)}
            unit={areaId}
            preview={<FigurePreview2D shape={shape2d} />}
          />
        </section>
      )}

      {mode === "3d" && (
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <FigureForm3D
            shape={shape3d}
            setShape={(s) => { setShape3d(s); setInputs3d({}); }}
            inputs={inputs3d}
            setInputs={setInputs3d}
            lenId={lenId}
          />
          <FigureCard
            title={shape3d.name}
            formula={hasFormula(shape3d) ? shape3d.formula : undefined}
            resultLabel="Volume"
            result={fmt(vol)}
            unit={volId}
            preview={<FigurePreview3D shape={shape3d} />}
          />
        </section>
      )}

      {mode === "draw" && (
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Desenhar polígono</h2>
            <p className="mt-1 text-sm text-slate-600">
              Grid: 1 célula = {GRID_UNIT_LENGTH} {lenId}. Clique para marcar pontos, duplo-clique para fechar.
            </p>
            <ShapeCanvas onArea={(aPx2) => setPolyAreaPx2(aPx2)} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-medium">Resultado</h3>
            <p className="mt-2 text-sm text-slate-600">
              <b>Área:</b> {polyAreaDisplay ? `${polyAreaDisplay} ${areaId}` : "—"}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Conversão: px² → m² via escala ({lenId}), depois m² → {areaId}.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

/* ===== Subcomponentes ===== */

function TabBtn({
  children, on, active,
}: { children: React.ReactNode; on: () => void; active: boolean }) {
  return (
    <button
      onClick={on}
      className={`cursor-pointer px-3 py-2 text-sm rounded-md ${active ? "bg-white border border-slate-300" : "text-slate-600"}`}
      type="button"
    >
      {children}
    </button>
  );
}

function UnitSelect({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="text-sm text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function FigureForm2D({
  shape, setShape, inputs, setInputs, lenId,
}: {
  shape: Shape2D;
  setShape: (s: Shape2D) => void;
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  lenId: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <label className="mb-1 block text-sm text-slate-600">Figura 2D</label>
      <select
        value={shape.id}
        onChange={(e) => {
          const s = SHAPES2D.find(x => x.id === e.target.value)!;
          setShape(s);
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      >
        {SHAPES2D.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <div className="mt-4 grid gap-3">
        {shape.params?.map(p => (
          <div key={p.id}>
            <label className="text-sm text-slate-600">
              {p.label} ({lenId})
            </label>
            <input
              value={inputs[p.id] ?? ""}
              onChange={(e) => setInputs(v => ({ ...v, [p.id]: e.target.value }))}
              className="mt-1 w-full rounded-md bg-slate-100 px-3 py-2"
              inputMode="decimal"
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FigureForm3D({
  shape, setShape, inputs, setInputs, lenId,
}: {
  shape: Shape3D;
  setShape: (s: Shape3D) => void;
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  lenId: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <label className="mb-1 block text-sm text-slate-600">Sólido 3D</label>
      <select
        value={shape.id}
        onChange={(e) => {
          const s = SHAPES3D.find(x => x.id === e.target.value)!;
          setShape(s);
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      >
        {SHAPES3D.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <div className="mt-4 grid gap-3">
        {shape.params?.map(p => (
          <div key={p.id}>
            <label className="text-sm text-slate-600">
              {p.label} ({lenId})
            </label>
            <input
              value={inputs[p.id] ?? ""}
              onChange={(e) => setInputs(v => ({ ...v, [p.id]: e.target.value }))}
              className="mt-1 w-full rounded-md bg-slate-100 px-3 py-2"
              inputMode="decimal"
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FigureCard({
  title, formula, resultLabel, result, unit, preview,
}: {
  title: string;
  formula?: string;
  resultLabel: string;
  result: string;
  unit: string;
  preview: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-medium">{title}</h3>
      <div className="mt-3">{preview}</div>
      <div className="mt-4 text-sm text-slate-600">
        {formula && (
          <div>
            <b>Fórmula:</b> <span className="font-mono">{formula}</span>
          </div>
        )}
        <div className="mt-2">
          <b>{resultLabel}:</b> {result} {unit}
        </div>
      </div>
    </div>
  );
}

/* ===== Previews ===== */

function FigurePreview2D({ shape }: { shape: Shape2D }) {
  const is = (keys: string[]) => keys.includes(shape.id);
  return (
    <svg viewBox="0 0 200 150" className="mt-1 h-48 w-full rounded border border-slate-200">
      {is(["rectangle", "retangulo"]) && (
        <rect x="30" y="30" width="140" height="90" fill="#e9eefb" stroke="#6b7fd7" />
      )}
      {is(["triangle", "triangulo"]) && (
        <polygon points="30,120 170,120 100,30" fill="#e9eefb" stroke="#6b7fd7" />
      )}
      {is(["circle", "circulo"]) && (
        <circle cx="100" cy="75" r="50" fill="#e9eefb" stroke="#6b7fd7" />
      )}
      {is(["trapezoid", "trapezio"]) && (
        <polygon points="50,120 150,120 170,60 30,60" fill="#e9eefb" stroke="#6b7fd7" />
      )}
      {is(["ellipse", "elipse"]) && (
        <ellipse cx="100" cy="75" rx="60" ry="40" fill="#e9eefb" stroke="#6b7fd7" />
      )}
      {is(["regularPolygon", "poligono_regular"]) && (
        <polygon
          points="100,25 152,57 152,117 100,149 48,117 48,57"
          fill="#e9eefb"
          stroke="#6b7fd7"
        />
      )}
    </svg>
  );
}

function FigurePreview3D({ shape }: { shape: Shape3D }) {
  const is = (keys: string[]) => keys.includes(shape.id);
  return (
    <svg viewBox="0 0 220 160" className="mt-1 h-48 w-full rounded border border-slate-200">
      {is(["cube", "cubo"]) && (
        <>
          <rect x="40" y="40" width="100" height="100" fill="#e9eefb" stroke="#6b7fd7" />
          <rect x="80" y="20" width="100" height="100" fill="none" stroke="#6b7fd7" />
          <line x1="40" y1="40" x2="80" y2="20" stroke="#6b7fd7" />
          <line x1="140" y1="40" x2="180" y2="20" stroke="#6b7fd7" />
          <line x1="140" y1="140" x2="180" y2="120" stroke="#6b7fd7" />
        </>
      )}
      {is(["cylinder", "cilindro"]) && (
        <>
          <ellipse cx="110" cy="40" rx="60" ry="15" fill="#e9eefb" stroke="#6b7fd7" />
          <rect x="50" y="40" width="120" height="80" fill="#e9eefb" stroke="#6b7fd7" />
          <ellipse cx="110" cy="120" rx="60" ry="15" fill="#e9eefb" stroke="#6b7fd7" />
        </>
      )}
      {is(["sphere", "esfera"]) && (
        <circle cx="110" cy="85" r="60" fill="#e9eefb" stroke="#6b7fd7" />
      )}
      {is(["cone"]) && (
        <>
          <ellipse cx="110" cy="120" rx="60" ry="15" fill="#e9eefb" stroke="#6b7fd7" />
          <line x1="50" y1="120" x2="110" y2="30" stroke="#6b7fd7" />
          <line x1="170" y1="120" x2="110" y2="30" stroke="#6b7fd7" />
        </>
      )}
      {is(["cuboid", "paralelepipedo"]) && (
        <>
          <rect x="30" y="50" width="120" height="80" fill="#e9eefb" stroke="#6b7fd7" />
          <rect x="70" y="30" width="120" height="80" fill="none" stroke="#6b7fd7" />
          <line x1="30" y1="50" x2="70" y2="30" stroke="#6b7fd7" />
          <line x1="150" y1="50" x2="190" y2="30" stroke="#6b7fd7" />
          <line x1="150" y1="130" x2="190" y2="110" stroke="#6b7fd7" />
        </>
      )}
    </svg>
  );
}
