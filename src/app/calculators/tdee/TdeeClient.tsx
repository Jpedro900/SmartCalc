"use client";

import { useMemo, useState } from "react";
import { Activity, Ruler, Scale, Calendar, Info, Flame } from "lucide-react";
import { FATORES_ATIVIDADE, Sex, tdeeFromTmb, tmbMifflin } from "@/lib/health";

function numBR(s: string): number {
  if (typeof s !== "string") return NaN;
  const cleaned = s.replace(/\s/g, "");
  if (cleaned.includes(",") && cleaned.includes("."))
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  if (cleaned.includes(",") && !cleaned.includes(".")) return Number(cleaned.replace(",", "."));
  return Number(cleaned);
}
function kcal(n: number) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

export default function TdeeClient() {
  const [sex, setSex] = useState<Sex>("M");
  const [idadeStr, setIdadeStr] = useState("30");
  const [pesoStr, setPesoStr] = useState("75");
  const [alturaStr, setAlturaStr] = useState("175");
  const [fatorId, setFatorId] = useState<string>(FATORES_ATIVIDADE[1].id);

  const out = useMemo(() => {
    const idade = numBR(idadeStr);
    const peso = numBR(pesoStr);
    const altura = numBR(alturaStr);
    const fator = FATORES_ATIVIDADE.find((f) => f.id === fatorId)?.fator ?? 1.375;

    if (![idade, peso, altura].every((v) => isFinite(v) && v > 0)) return null;

    const tmb = tmbMifflin(sex, peso, altura, idade);
    const tdee = tdeeFromTmb(tmb, fator);

    return { tmb, tdee, fator };
  }, [sex, idadeStr, pesoStr, alturaStr, fatorId]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Flame className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">TDEE — Gasto Calórico Diário</h1>
          <p className="text-slate-500">
            Estimativa de calorias para manter o peso com base na TMB e no nível de atividade.
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

          <Field label="Idade (anos)" icon={<Calendar className="h-4 w-4" />}>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="numeric"
              value={idadeStr}
              onChange={(e) => setIdadeStr(e.target.value)}
            />
          </Field>

          <Field label="Peso (kg)" icon={<Scale className="h-4 w-4" />}>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="decimal"
              value={pesoStr}
              onChange={(e) => setPesoStr(e.target.value)}
            />
          </Field>

          <Field label="Altura (cm)" icon={<Ruler className="h-4 w-4" />}>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="decimal"
              value={alturaStr}
              onChange={(e) => setAlturaStr(e.target.value)}
            />
          </Field>

          <label className="block md:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Activity className="h-4 w-4" /> Nível de atividade
            </div>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={fatorId}
              onChange={(e) => setFatorId(e.target.value)}
            >
              {FATORES_ATIVIDADE.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label} (~{f.fator})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            TMB (Mifflin-St Jeor) calcula calorias de repouso; TDEE multiplica pela atividade.
            Sugestões: déficit <strong>−15%/−20%</strong> para cutting; superávit{" "}
            <strong>+10%/+15%</strong> para bulking.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="TMB (repouso)" value={out ? `${kcal(out.tmb)} kcal/dia` : "—"} />
        <Card title="TDEE (manutenção)" value={out ? `${kcal(out.tdee)} kcal/dia` : "—"} />
        <Card title="Fator atividade" value={out ? `${out.fator}` : "—"} />

        <div className="md:col-span-3 grid gap-3 md:grid-cols-3">
          <Card title="Déficit -15%" value={out ? `${kcal(out.tdee * 0.85)} kcal/dia` : "—"} />
          <Card title="Déficit -20%" value={out ? `${kcal(out.tdee * 0.8)} kcal/dia` : "—"} />
          <Card title="Superávit +10%" value={out ? `${kcal(out.tdee * 1.1)} kcal/dia` : "—"} />
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        <span>{label}</span>
      </div>
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
