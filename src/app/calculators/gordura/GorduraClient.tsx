"use client";

import { useMemo, useState } from "react";
import { Info, Percent } from "lucide-react";
import { Sex, bodyFatClass, bodyFatUSNavy } from "@/lib/health";

function numBR(s: string): number {
  if (typeof s !== "string") return NaN;
  const cleaned = s.replace(/\s/g, "");
  if (cleaned.includes(",") && cleaned.includes("."))
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  if (cleaned.includes(",") && !cleaned.includes(".")) return Number(cleaned.replace(",", "."));
  return Number(cleaned);
}
function fmtPct(n: number, max = 1) {
  return `${n.toLocaleString("pt-BR", { maximumFractionDigits: max })}%`;
}

export default function GorduraClient() {
  const [sex, setSex] = useState<Sex>("M");
  const [idadeStr, setIdadeStr] = useState("30");
  const [alturaStr, setAlturaStr] = useState("175");
  const [pescocoStr, setPescocoStr] = useState("38");
  const [cinturaStr, setCinturaStr] = useState("85");
  const [quadrilStr, setQuadrilStr] = useState("");

  const out = useMemo(() => {
    const idade = numBR(idadeStr);
    const altura = numBR(alturaStr);
    const pescoco = numBR(pescocoStr);
    const cintura = numBR(cinturaStr);
    const quadril = numBR(quadrilStr);

    if (![idade, altura, pescoco, cintura].every((v) => isFinite(v) && v > 0)) return null;
    if (sex === "F" && !(isFinite(quadril) && quadril > 0)) return null;

    const bf = bodyFatUSNavy(sex, altura, pescoco, cintura, sex === "F" ? quadril : undefined);
    const classe = bodyFatClass(sex, idade, bf);

    return { bf, classe };
  }, [sex, idadeStr, alturaStr, pescocoStr, cinturaStr, quadrilStr]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Percent className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">% Gordura corporal — Circunferências</h1>
          <p className="text-slate-500">
            Método US Navy, medidas em <strong>centímetros</strong>.
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-slate-700">Sexo</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["M", "F"] as Sex[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-sm ${sex === s ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-300 bg-white hover:bg-slate-50"}`}
                  onClick={() => setSex(s)}
                >
                  {s === "M" ? "Masculino" : "Feminino"}
                </button>
              ))}
            </div>
          </label>

          <Field label="Idade (anos)">
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="numeric"
              value={idadeStr}
              onChange={(e) => setIdadeStr(e.target.value)}
            />
          </Field>
          <Field label="Altura (cm)" icon>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="decimal"
              value={alturaStr}
              onChange={(e) => setAlturaStr(e.target.value)}
            />
          </Field>
          <Field label="Pescoço (cm)">
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="decimal"
              value={pescocoStr}
              onChange={(e) => setPescocoStr(e.target.value)}
            />
          </Field>
          <Field label="Cintura (cm)">
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="decimal"
              value={cinturaStr}
              onChange={(e) => setCinturaStr(e.target.value)}
            />
          </Field>
          {sex === "F" && (
            <Field label="Quadril (cm)">
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
                inputMode="decimal"
                value={quadrilStr}
                onChange={(e) => setQuadrilStr(e.target.value)}
              />
            </Field>
          )}
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Para melhor precisão: fita na horizontal; pescoço na parte mais fina; cintura na parte
            mais estreita (ou nível do umbigo).
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="% Gordura" value={out ? fmtPct(out.bf, 1) : "—"} />
        <Card title="Classificação" value={out ? out.classe : "—"} />
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode; icon?: boolean }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {children}
    </label>
  );
}
function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 text-sm text-slate-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
