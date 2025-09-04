"use client";

import { useMemo, useState } from "react";
import ShapeCanvas from "@/components/ShapeCanvas";
import {
  SHAPES2D,
  SHAPES3D,
  type Shape2D,
  type Shape3D,
} from "./shapes";
import {
  AREA_UNITS,
  LENGTH_UNITS,
  VOLUME_UNITS,
  byId,
} from "@/config/units-area-volume";

type Mode = "2d" | "3d" | "draw";
type Inputs = Record<string, string>;

const num = (s: string) => {
  const n = Number(String(s).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (v: number, frac = 6) =>
  Number.isFinite(v) ? v.toLocaleString("pt-BR", { maximumFractionDigits: frac }) : "";

const GRID_UNIT_LENGTH = 1;

export default function AreaVolumeClient() {
  const [mode, setMode] = useState<Mode>("2d");
  const [shape2d, setShape2d] = useState<Shape2D>(SHAPES2D[0]);
  const [shape3d, setShape3d] = useState<Shape3D>(SHAPES3D[0]);
  const [inputs2d, setInputs2d] = useState<Inputs>({});
  const [inputs3d, setInputs3d] = useState<Inputs>({});

  const [lenId, setLenId] = useState("m");
  const [areaId, setAreaId] = useState("m²");
  const [volId, setVolId] = useState("m³");

  const [drawAreaM2, setDrawAreaM2] = useState(0);

  const lenSI = byId(LENGTH_UNITS, lenId).toSI;
  const areaSI = byId(AREA_UNITS, areaId).toSI;
  const volSI = byId(VOLUME_UNITS, volId).toSI;

  const area = useMemo(() => {
    if (mode !== "2d") return NaN;
    const vals: Record<string, number> = {};
    for (const p of shape2d.params) {
      const v = num(inputs2d[p.id] ?? "");
      if (!Number.isFinite(v)) return NaN;
      vals[p.id] = p.dim === "L" ? v * lenSI : v;
    }
    const a_m2 = shape2d.area(vals);
    return a_m2 / areaSI;
  }, [mode, shape2d, inputs2d, lenSI, areaSI]);

  const vol = useMemo(() => {
    if (mode !== "3d") return NaN;
    const vals: Record<string, number> = {};
    for (const p of shape3d.params) {
      const v = num(inputs3d[p.id] ?? "");
      if (!Number.isFinite(v)) return NaN;
      vals[p.id] = p.dim === "L" ? v * lenSI : v;
    }
    const v_m3 = shape3d.volume(vals);
    return v_m3 / volSI;
  }, [mode, shape3d, inputs3d, lenSI, volSI]);

  function syncOutputsForLength(newLenId: string) {
    const base = byId(LENGTH_UNITS, newLenId).id;
    const a = base + "²";
    const v = base + "³";
    if (AREA_UNITS.some((u) => u.id === a)) setAreaId(a);
    if (VOLUME_UNITS.some((u) => u.id === v)) setVolId(v);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Área & Volume</h1>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <UnitSelect
          label="Comprimento"
          value={lenId}
          options={LENGTH_UNITS.map((u) => u.id)}
          onChange={(id) => {
            setLenId(id);
            syncOutputsForLength(id);
          }}
        />
        <UnitSelect
          label="Área"
          value={areaId}
          options={AREA_UNITS.map((u) => u.id)}
          onChange={setAreaId}
        />
        <UnitSelect
          label="Volume"
          value={volId}
          options={VOLUME_UNITS.map((u) => u.id)}
          onChange={setVolId}
        />
      </div>

      <div className="mt-4 inline-flex rounded-lg bg-slate-100 p-1">
        <TabBtn on={() => setMode("2d")} active={mode === "2d"}>
          2D (Área)
        </TabBtn>
        <TabBtn on={() => setMode("3d")} active={mode === "3d"}>
          3D (Volume)
        </TabBtn>
        <TabBtn on={() => setMode("draw")} active={mode === "draw"}>
          Desenhar
        </TabBtn>
      </div>

      {mode === "2d" && (
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <FigureForm2D
            shape={shape2d}
            setShape={(s) => {
              setShape2d(s);
              setInputs2d({});
            }}
            inputs={inputs2d}
            setInputs={setInputs2d}
            lenId={lenId}
          />
          <FigureCard
            title={shape2d.name}
            formula={shape2d.formula}
            resultLabel="Área"
            result={fmt(area)}
            unit={areaId}
            preview={
              <FigurePreview2D
                key={shape2d.id}
                shape={shape2d}
                inputs={inputs2d}
                lenId={lenId}
              />
            }
          />
        </section>
      )}

      {mode === "3d" && (
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <FigureForm3D
            shape={shape3d}
            setShape={(s) => {
              setShape3d(s);
              setInputs3d({});
            }}
            inputs={inputs3d}
            setInputs={setInputs3d}
            lenId={lenId}
          />
          <FigureCard
            title={shape3d.name}
            formula={shape3d.formula}
            resultLabel="Volume"
            result={fmt(vol)}
            unit={volId}
            preview={
              <FigurePreview3D
                key={shape3d.id}
                shape={shape3d}
                inputs={inputs3d}
                lenId={lenId}
              />
            }
          />
        </section>
      )}

      {mode === "draw" && (
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Desenhar polígono</h2>
            <p className="mt-1 text-sm text-slate-600">
              Grid: 1 célula = {GRID_UNIT_LENGTH} {lenId}.
            </p>
            <ShapeCanvas
              unitLabel={lenId}
              cellLengthInMeters={byId(LENGTH_UNITS, lenId).toSI * GRID_UNIT_LENGTH}
              onArea={(_, areaM2) => setDrawAreaM2(areaM2)}
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-medium">Resultado</h3>
            <p className="mt-2 text-sm text-slate-600">
              <b>Área:</b> {fmt(drawAreaM2 / areaSI)} {areaId}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

function TabBtn({
  children,
  on,
  active,
}: {
  children: React.ReactNode;
  on: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={on}
      className={`cursor-pointer px-3 py-2 text-sm rounded-md ${
        active ? "bg-white border border-slate-300" : "text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function UnitSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ===== forms ===== */

function FigureForm2D({
  shape,
  setShape,
  inputs,
  setInputs,
  lenId,
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
          const s = SHAPES2D.find((x) => x.id === e.target.value)!;
          setShape(s);
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      >
        {SHAPES2D.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="mt-4 grid gap-3">
        {shape.params.map((p) => (
          <div key={p.id}>
            <label className="text-sm text-slate-600">
              {p.label}
              {p.dim === "L" ? ` (${lenId})` : ""}
            </label>
            <input
              value={inputs[p.id] ?? ""}
              onChange={(e) =>
                setInputs((v) => ({ ...v, [p.id]: e.target.value }))
              }
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
  shape,
  setShape,
  inputs,
  setInputs,
  lenId,
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
          const s = SHAPES3D.find((x) => x.id === e.target.value)!;
          setShape(s);
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      >
        {SHAPES3D.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="mt-4 grid gap-3">
        {shape.params.map((p) => (
          <div key={p.id}>
            <label className="text-sm text-slate-600">
              {p.label}
              {p.dim === "L" ? ` (${lenId})` : ""}
            </label>
            <input
              value={inputs[p.id] ?? ""}
              onChange={(e) =>
                setInputs((v) => ({ ...v, [p.id]: e.target.value }))
              }
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
  title,
  formula,
  resultLabel,
  result,
  unit,
  preview,
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

/* ===== previews com anotações ===== */

function FigurePreview2D({
  shape,
  inputs,
  lenId,
}: {
  shape: Shape2D;
  inputs: Inputs;
  lenId: string;
}) {
  const b = num(inputs.b ?? "");
  const h = num(inputs.h ?? "");
  const r = num(inputs.r ?? "");
  const a = num(inputs.a ?? "");
  const smB = num(inputs.B ?? "");
  const smb = num(inputs.b ?? "");

  return (
    <svg viewBox="0 0 240 160" className="mt-1 h-48 w-full rounded border border-slate-200">
      {shape.id === "retangulo" && (
        <>
          <rect x="50" y="35" width="140" height="90" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(b) && b > 0 && (
            <>
              <line x1="50" y1="130" x2="190" y2="130" stroke="#0ea5e9" />
              <text x="120" y="148" textAnchor="middle" fontSize="12">b = {inputs.b} {lenId}</text>
            </>
          )}
          {Number.isFinite(h) && h > 0 && (
            <>
              <line x1="45" y1="35" x2="45" y2="125" stroke="#ef4444" />
              <text x="32" y="85" textAnchor="middle" fontSize="12">h = {inputs.h} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "triangulo" && (
        <>
          <polygon points="40,125 200,125 120,30" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(b) && (
            <>
              <line x1="40" y1="140" x2="200" y2="140" stroke="#0ea5e9" />
              <text x="120" y="156" textAnchor="middle" fontSize="12">b = {inputs.b} {lenId}</text>
            </>
          )}
          {Number.isFinite(h) && (
            <>
              <line x1="120" y1="30" x2="120" y2="125" stroke="#ef4444" />
              <text x="132" y="78" fontSize="12">h = {inputs.h} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "circulo" && (
        <>
          <circle cx="120" cy="80" r="50" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(r) && (
            <>
              <line x1="120" y1="80" x2="170" y2="80" stroke="#0ea5e9" />
              <text x="145" y="74" textAnchor="middle" fontSize="12">r = {inputs.r} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "trapezio" && (
        <>
          <polygon points="60,125 180,125 200,70 40,70" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(smB) && (
            <>
              <line x1="60" y1="140" x2="180" y2="140" stroke="#0ea5e9" />
              <text x="120" y="156" textAnchor="middle" fontSize="12">B = {inputs.B} {lenId}</text>
            </>
          )}
          {Number.isFinite(smb) && (
            <>
              <line x1="40" y1="60" x2="200" y2="60" stroke="#22c55e" />
              <text x="120" y="54" textAnchor="middle" fontSize="12">b = {inputs.b} {lenId}</text>
            </>
          )}
          {Number.isFinite(h) && (
            <>
              <line x1="40" y1="70" x2="40" y2="125" stroke="#ef4444" />
              <text x="28" y="100" textAnchor="middle" fontSize="12">h = {inputs.h} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "elipse" && (
        <>
          <ellipse cx="120" cy="80" rx="70" ry="40" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(a) && (
            <>
              <line x1="50" y1="80" x2="190" y2="80" stroke="#0ea5e9" />
              <text x="120" y="72" textAnchor="middle" fontSize="12">a = {inputs.a} {lenId}</text>
            </>
          )}
          {Number.isFinite(b) && (
            <>
              <line x1="120" y1="40" x2="120" y2="120" stroke="#ef4444" />
              <text x="132" y="84" fontSize="12">b = {inputs.b} {lenId}</text>
            </>
          )}
        </>
      )}
    </svg>
  );
}

function FigurePreview3D({
  shape,
  inputs,
  lenId,
}: {
  shape: Shape3D;
  inputs: Inputs;
  lenId: string;
}) {
  const a = num(inputs.a ?? "");
  const b = num(inputs.b ?? "");
  const c = num(inputs.c ?? "");
  const r = num(inputs.r ?? "");
  const h = num(inputs.h ?? "");

  return (
    <svg viewBox="0 0 260 170" className="mt-1 h-48 w-full rounded border border-slate-200">
      {shape.id === "cubo" && (
        <>
          <rect x="60" y="40" width="90" height="90" fill="#e9eefb" stroke="#6366f1" />
          <rect x="90" y="25" width="90" height="90" fill="none" stroke="#6366f1" />
          <line x1="60" y1="40" x2="90" y2="25" stroke="#6366f1" />
          <line x1="150" y1="40" x2="180" y2="25" stroke="#6366f1" />
          <line x1="150" y1="130" x2="180" y2="115" stroke="#6366f1" />
          {Number.isFinite(a) && (
            <>
              <line x1="60" y1="135" x2="150" y2="135" stroke="#0ea5e9" />
              <text x="105" y="152" textAnchor="middle" fontSize="12">a = {inputs.a} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "cilindro" && (
        <>
          <ellipse cx="120" cy="40" rx="55" ry="15" fill="#e9eefb" stroke="#6366f1" />
          <rect x="65" y="40" width="110" height="80" fill="#e9eefb" stroke="#6366f1" />
          <ellipse cx="120" cy="120" rx="55" ry="15" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(r) && (
            <>
              <line x1="120" y1="120" x2="175" y2="120" stroke="#0ea5e9" />
              <text x="148" y="112" textAnchor="middle" fontSize="12">r = {inputs.r} {lenId}</text>
            </>
          )}
          {Number.isFinite(h) && (
            <>
              <line x1="60" y1="40" x2="60" y2="120" stroke="#ef4444" />
              <text x="48" y="82" textAnchor="middle" fontSize="12">h = {inputs.h} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "esfera" && (
        <>
          <circle cx="120" cy="85" r="60" fill="#e9eefb" stroke="#6366f1" />
          {Number.isFinite(r) && (
            <>
              <line x1="120" y1="85" x2="180" y2="85" stroke="#0ea5e9" />
              <text x="150" y="77" textAnchor="middle" fontSize="12">r = {inputs.r} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "cone" && (
        <>
          <ellipse cx="120" cy="120" rx="55" ry="15" fill="#e9eefb" stroke="#6366f1" />
          <line x1="65" y1="120" x2="120" y2="30" stroke="#6366f1" />
          <line x1="175" y1="120" x2="120" y2="30" stroke="#6366f1" />
          {Number.isFinite(r) && (
            <>
              <line x1="120" y1="120" x2="175" y2="120" stroke="#0ea5e9" />
              <text x="148" y="112" textAnchor="middle" fontSize="12">r = {inputs.r} {lenId}</text>
            </>
          )}
          {Number.isFinite(h) && (
            <>
              <line x1="60" y1="120" x2="60" y2="30" stroke="#ef4444" />
              <text x="48" y="78" textAnchor="middle" fontSize="12">h = {inputs.h} {lenId}</text>
            </>
          )}
        </>
      )}

      {shape.id === "paralelepipedo" && (
        <>
          <rect x="40" y="50" width="120" height="80" fill="#e9eefb" stroke="#6366f1" />
          <rect x="80" y="35" width="120" height="80" fill="none" stroke="#6366f1" />
          <line x1="40" y1="50" x2="80" y2="35" stroke="#6366f1" />
          <line x1="160" y1="50" x2="200" y2="35" stroke="#6366f1" />
          <line x1="160" y1="130" x2="200" y2="115" stroke="#6366f1" />
          {(Number.isFinite(a) || Number.isFinite(b) || Number.isFinite(c)) && (
            <text x="130" y="155" textAnchor="middle" fontSize="12">
              {Number.isFinite(a) ? `a=${inputs.a} ` : ""}{Number.isFinite(b) ? `b=${inputs.b} ` : ""}{Number.isFinite(c) ? `c=${inputs.c}` : ""}
              {` ${lenId}`}
            </text>
          )}
        </>
      )}
    </svg>
  );
}
