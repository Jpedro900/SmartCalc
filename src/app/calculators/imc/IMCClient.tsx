"use client";
import { useMemo, useState } from "react";
import Image from "next/image";

type Unit = "metric" | "imperial";
type Sex = "male" | "female";
type BmiCat = "abaixo" | "normal" | "acima" | "obeso" | "-";

const IMAGES: Record<Sex, Record<Exclude<BmiCat, "-">, string>> = {
  male: {
    abaixo: "/silhuetta-homem-abaixo-do-peso.jpg",
    normal: "/silhuetta-homem-normal.jpg",
    acima: "/silhuetta-homem-acima-do-peso.jpg",
    obeso: "/silhuetta-homem-obeso.jpg",
  },
  female: {
    abaixo: "/silhuetta-mulher-abaixo-do-peso.jpg",
    normal: "/silhuetta-mulher-normal.jpg",
    acima: "/silhuetta-mulher-acima-do-peso.jpg",
    obeso: "/silhuetta-mulher-obesa.jpg",
  },
};

/* ---------------- Helpers de IMC ---------------- */

function classifyBMI(bmi: number): BmiCat {
  if (!Number.isFinite(bmi)) return "-";
  if (bmi < 18.5) return "abaixo";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "acima";
  return "obeso";
}

function idealWeightRangeKg(
  heightM: number
): { min: number; max: number; target: number } | null {
  if (!Number.isFinite(heightM) || heightM <= 0) return null;
  const min = 18.5 * heightM * heightM;
  const max = 24.9 * heightM * heightM;
  const target = 22.0 * heightM * heightM;
  return { min, max, target };
}

function imageFor(sex: Sex, cat: BmiCat): string {
  if (cat === "-") return IMAGES[sex].normal;
  return IMAGES[sex][cat];
}

/* ---------------- Componente principal ---------------- */

export default function IMCClient() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [h, setH] = useState(""); // altura (cm | in)
  const [w, setW] = useState(""); // peso   (kg | lb)

  const H = parseFloat(h);
  const W = parseFloat(w);

  // altura em metros
  const heightM = useMemo(() => {
    if (!Number.isFinite(H)) return NaN;
    return unit === "metric" ? H / 100 : H * 0.0254;
  }, [H, unit]);

  // peso em kg
  const weightKg = useMemo(() => {
    if (!Number.isFinite(W)) return NaN;
    return unit === "metric" ? W : W * 0.45359237;
  }, [W, unit]);

  // IMC
  const bmi = useMemo(() => {
    if (!Number.isFinite(heightM) || heightM <= 0 || !Number.isFinite(weightKg))
      return NaN;
    return weightKg / (heightM * heightM);
  }, [heightM, weightKg]);

  const cat = classifyBMI(bmi);
  const ideal = idealWeightRangeKg(heightM);

  const targetKg = ideal?.target ?? NaN;
  const deltaKg =
    Number.isFinite(targetKg) && Number.isFinite(weightKg)
      ? targetKg - weightKg
      : NaN;

  const imgSrc = imageFor(sex, cat);
  const [imgError, setImgError] = useState(false);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Calculadora de IMC</h1>
      <p className="mt-2 text-sm text-slate-600">
        Informe seu sexo, altura e peso. O IMC usa faixas OMS e o peso ideal é
        estimado pela faixa saudável (18.5–24.9). Resultado meramente
        informativo.
      </p>

      {/* sexo e unidades */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-sm font-medium">Sexo</div>
          <div className="mt-2 flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="sex"
                checked={sex === "male"}
                onChange={() => setSex("male")}
              />{" "}
              Masculino
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="sex"
                checked={sex === "female"}
                onChange={() => setSex("female")}
              />{" "}
              Feminino
            </label>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Unidades</div>
          <div className="mt-2 flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="u"
                checked={unit === "metric"}
                onChange={() => setUnit("metric")}
              />{" "}
              Métrico
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="u"
                checked={unit === "imperial"}
                onChange={() => setUnit("imperial")}
              />{" "}
              Imperial
            </label>
          </div>
        </div>
      </div>

      {/* inputs */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="h" className="block text-sm font-medium">
            Altura ({unit === "metric" ? "cm" : "in"})
          </label>
          <input
            id="h"
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            value={h}
            onChange={(e) => setH(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="w" className="block text-sm font-medium">
            Peso ({unit === "metric" ? "kg" : "lb"})
          </label>
          <input
            id="w"
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            value={w}
            onChange={(e) => setW(e.target.value)}
          />
        </div>
      </div>

      {/* resultado + imagem */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* painel de números */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">IMC</div>
          <div className="mt-1 text-3xl font-semibold">
            {Number.isFinite(bmi) ? bmi.toFixed(2) : "--"}
          </div>
          <div className="mt-1 text-sm">
            {cat === "-"
              ? "--"
              : cat === "abaixo"
              ? "Abaixo do peso"
              : cat === "normal"
              ? "Peso normal"
              : cat === "acima"
              ? "Sobrepeso"
              : "Obesidade"}
          </div>

          <div className="mt-4 text-sm text-slate-600">
            Peso ideal (estimativa)
          </div>
          <div className="mt-1 text-sm">
            {ideal ? (
              <>
                Faixa saudável: <b>{ideal.min.toFixed(1)} kg</b> –{" "}
                <b>{ideal.max.toFixed(1)} kg</b>
                <br />
                Alvo sugerido: <b>{ideal.target.toFixed(1)} kg</b>
              </>
            ) : (
              "--"
            )}
          </div>

          <div className="mt-3 text-sm">
            {Number.isFinite(deltaKg) ? (
              deltaKg > 0 ? (
                <>
                  Para atingir o alvo, <b>ganhe {deltaKg.toFixed(1)} kg</b>.
                </>
              ) : deltaKg < 0 ? (
                <>
                  Para atingir o alvo,{" "}
                  <b>perca {Math.abs(deltaKg).toFixed(1)} kg</b>.
                </>
              ) : (
                <>Você já está no alvo sugerido.</>
              )
            ) : (
              "--"
            )}
          </div>
        </div>

        {/* painel visual (imagem) */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Seu corpo (ilustração)</div>

          <div className="mt-2 grid place-items-center">
            {!imgError ? (
              <Image
                src={imgSrc}
                alt="Silhueta representando a faixa de IMC"
                width={180}
                height={240}
                unoptimized 
                onError={() => setImgError(true)}
                className="h-48 w-auto"
              />
            ) : (
              <Image
                src={imgSrc}
                alt="Silhueta representando a faixa de IMC"
                width={180}
                height={240}
                className="h-48 w-auto"
                unoptimized
              />
            )}
          </div>

          <div className="mt-2 text-center text-xs text-slate-500">
            A imagem muda conforme a faixa do IMC.
          </div>
        </div>
      </div>
    </main>
  );
}
