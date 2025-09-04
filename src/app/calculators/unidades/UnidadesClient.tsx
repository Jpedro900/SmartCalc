"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import { UNITS, Category } from "@/config/units";
import {
  Repeat,
  Move3d,
  GaugeCircle,
  Zap,
  Beaker,
  Scale,
  Ruler,
  Lightbulb,
  Wind,
  Thermometer,
  Timer,
  Droplets,
  Activity,
  Battery,
  Package,
  Flame,
} from "lucide-react";

const ICON: Record<string, ReactNode> = {
  aceleracao: <Activity size={16} />,
  area: <Move3d size={16} />,
  torque: <GaugeCircle size={16} />,
  carga_eletrica: <Battery size={16} />,
  energia: <Flame size={16} />,
  forca: <Scale size={16} />,
  forca_comprimento: <Scale size={16} />,
  comprimento: <Ruler size={16} />,
  iluminacao: <Lightbulb size={16} />,
  massa: <Package size={16} />,
  fluxo_massa: <Wind size={16} />,
  densidade_capacidade: <Beaker size={16} />,
  potencia: <Zap size={16} />,
  pressao_tensao: <GaugeCircle size={16} />,
  temperatura: <Thermometer size={16} />,
  tempo: <Timer size={16} />,
  velocidade: <Wind size={16} />,
  viscosidade: <Droplets size={16} />,
  volume_capacidade: <Beaker size={16} />,
  fluxo_volume: <Wind size={16} />,
};

type Pair = {
  fromUnit: string;
  toUnit: string;
  fromVal: string;
  toVal: string;
};

const num = (s: string) => {
  const n = Number(
    String(s)
      .replace(/[^\d,.-]/g, "")
      .replace(",", ".")
  );
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (v: number) =>
  Number.isFinite(v) ? v.toLocaleString("pt-BR", { maximumFractionDigits: 10 }) : "";

function firstTwo(units: Category["units"]): [string, string] {
  const a = units[0]?.id ?? "";
  const b = units[1]?.id ?? a;
  return [a, b];
}

export default function UnidadesClient() {
  const [cat, setCat] = useState<Category>(UNITS[0]);
  const [pair, setPair] = useState<Pair>(() => {
    const [u0, u1] = firstTwo(UNITS[0].units);
    return { fromUnit: u0, toUnit: u1, fromVal: "1", toVal: "" };
  });

  useEffect(() => {
    const [u0, u1] = firstTwo(cat.units);
    setPair({ fromUnit: u0, toUnit: u1, fromVal: "1", toVal: "" });
  }, [cat]);

  const from = useMemo(() => cat.units.find((u) => u.id === pair.fromUnit), [cat, pair.fromUnit]);
  const to = useMemo(() => cat.units.find((u) => u.id === pair.toUnit), [cat, pair.toUnit]);

  useEffect(() => {
    if (!from || !to || typeof from.toSI !== "function" || typeof to.fromSI !== "function") return;
    const v = num(pair.fromVal);
    if (!Number.isFinite(v)) {
      setPair((p) => ({ ...p, toVal: "" }));
      return;
    }
    const si = from.toSI(v);
    const out = to.fromSI(si);
    setPair((p) => ({ ...p, toVal: fmt(out) }));
  }, [pair.fromVal, pair.fromUnit, pair.toUnit, from, to]);

  const swap = () => {
    setPair((p) => ({
      fromUnit: p.toUnit,
      toUnit: p.fromUnit,
      fromVal: p.toVal ? p.toVal.replace(/\./g, "").replace(",", ".") : p.fromVal,
      toVal: "",
    }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Conversor de Unidades</h1>
      <p className="mt-2 text-sm text-slate-600">
        Selecione a categoria, digite um valor e converta entre unidades.
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {UNITS.map((c) => {
          const active = c.id === cat.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c)}
              className={`cursor-pointer flex items-center gap-2 rounded-lg border px-3 py-2 text-sm
                ${active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white hover:bg-slate-50"}`}
              title={c.name}
              type="button"
            >
              <span className="text-slate-700">{ICON[c.id] ?? <GaugeCircle size={16} />}</span>
              <span className="truncate">{c.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid items-start gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-1 block text-sm text-slate-600">De</label>
          <select
            value={pair.fromUnit}
            onChange={(e) => setPair((p) => ({ ...p, fromUnit: e.target.value }))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            {cat.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
                {u.symbol ? ` (${u.symbol})` : ""}
              </option>
            ))}
          </select>

          <input
            value={pair.fromVal}
            onChange={(e) => setPair((p) => ({ ...p, fromVal: e.target.value }))}
            inputMode="decimal"
            placeholder="0"
            className="mt-3 w-full rounded-lg bg-slate-100 px-4 py-4 text-2xl outline-none"
          />

          {!!cat.chips?.length && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {cat.chips!.map((id) => {
                const u = cat.units.find((x) => x.id === id);
                if (!u) return null;
                return (
                  <button
                    key={id}
                    onClick={() => setPair((p) => ({ ...p, fromUnit: id }))}
                    className={`cursor-pointer rounded-full px-2 py-1 ${pair.fromUnit === id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
                    title={u.label}
                    type="button"
                  >
                    {u.symbol ?? u.id}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={swap}
            aria-label="Trocar"
            className="mt-8 cursor-pointer rounded-full border border-slate-200 bg-white p-3 text-blue-600 shadow-sm hover:bg-blue-50"
            title="Trocar unidades"
            type="button"
          >
            <Repeat />
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-1 block text-sm text-slate-600">Para</label>
          <select
            value={pair.toUnit}
            onChange={(e) => setPair((p) => ({ ...p, toUnit: e.target.value }))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            {cat.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
                {u.symbol ? ` (${u.symbol})` : ""}
              </option>
            ))}
          </select>

          <input
            value={pair.toVal}
            onChange={(e) => {
              const v = e.target.value;
              const n = num(v);
              if (
                !from ||
                !to ||
                typeof to.toSI !== "function" ||
                typeof from.fromSI !== "function"
              ) {
                setPair({ ...pair, toVal: v });
                return;
              }
              if (Number.isFinite(n)) {
                const si = to.toSI(n);
                const out = from.fromSI(si);
                setPair({ ...pair, toVal: v, fromVal: fmt(out) });
              } else {
                setPair({ ...pair, toVal: v });
              }
            }}
            inputMode="decimal"
            placeholder="0"
            className="mt-3 w-full rounded-lg bg-slate-100 px-4 py-4 text-2xl outline-none"
          />

          {!!cat.chips?.length && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {cat.chips!.map((id) => {
                const u = cat.units.find((x) => x.id === id);
                if (!u) return null;
                return (
                  <button
                    key={id}
                    onClick={() => setPair((p) => ({ ...p, toUnit: id }))}
                    className={`cursor-pointer rounded-full px-2 py-1 ${pair.toUnit === id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
                    title={u.label}
                    type="button"
                  >
                    {u.symbol ?? u.id}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {cat.kind === "affine" && (
        <p className="mt-3 text-xs text-slate-500">
          Para temperatura, a conversão usa ajustes de escala e deslocamento (ex.: °C → K = °C +
          273,15).
        </p>
      )}
    </div>
  );
}
