"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Percent, Scale, Dumbbell, Info, Ruler, User, ChevronDown, ChevronUp } from "lucide-react";
import { bodyFatUSNavy } from "@/lib/health";

type Sexo = "M" | "F";

function num(s: string) {
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function fmtPct(n: number | null, d = 1) {
  return n == null ? "—" : `${n.toLocaleString("pt-BR", { maximumFractionDigits: d })}%`;
}
function fmtKg(n: number | null, d = 1) {
  return n == null ? "—" : `${n.toLocaleString("pt-BR", { maximumFractionDigits: d })} kg`;
}

function classificacao(sexo: Sexo, bf: number | null): string {
  if (bf == null || !Number.isFinite(bf)) return "—";
  // faixas aproximadas (referência comum)
  const lim =
    sexo === "M"
      ? { atleta: 13, bom: 17, aceitavel: 24, alto: 30 }
      : { atleta: 20, bom: 24, aceitavel: 31, alto: 37 };

  if (bf <= lim.atleta) return "Atleta";
  if (bf <= lim.bom) return "Bom";
  if (bf <= lim.aceitavel) return "Aceitável";
  if (bf <= lim.alto) return "Alto";
  return "Muito alto";
}

export default function GorduraClient() {
  const [sexo, setSexo] = useState<Sexo>("M");
  const [altura, setAltura] = useState("175"); // cm
  const [pescoco, setPescoco] = useState("40"); // cm
  const [cintura, setCintura] = useState("85"); // cm
  const [quadril, setQuadril] = useState("95"); // cm (só F)
  const [peso, setPeso] = useState(""); // kg (opcional)
  const [showHow, setShowHow] = useState(false);

  const parsed = useMemo(() => {
    const a = num(altura);
    const pe = num(pescoco);
    const ci = num(cintura);
    const qu = num(quadril);
    const kg = peso.trim() ? num(peso) : NaN;
    if (![a, pe, ci].every((v) => Number.isFinite(v) && v > 0)) return null;
    if (sexo === "F" && !(Number.isFinite(qu) && qu > 0)) return null;
    return { a, pe, ci, qu: sexo === "F" ? qu : NaN, kg: Number.isFinite(kg) ? kg : NaN };
  }, [sexo, altura, pescoco, cintura, quadril, peso]);

  const bodyFat = useMemo(() => {
    if (!parsed) return null;
    const bf = bodyFatUSNavy(
      sexo,
      parsed.a,
      parsed.pe,
      parsed.ci,
      sexo === "F" ? parsed.qu : undefined
    );
    return Number.isFinite(bf) ? bf : null;
  }, [parsed, sexo]);

  const massaGorda = useMemo(() => {
    if (!parsed || !Number.isFinite(parsed.kg) || bodyFat == null) return null;
    return (parsed.kg * bodyFat) / 100;
  }, [parsed, bodyFat]);

  const massaMagra = useMemo(() => {
    if (!parsed || !Number.isFinite(parsed.kg) || massaGorda == null) return null;
    return parsed.kg - massaGorda;
  }, [parsed, massaGorda]);

  const classe = classificacao(sexo, bodyFat ?? null);
  const badgeColor =
    classe === "Atleta"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : classe === "Bom"
        ? "bg-green-50 text-green-700 border-green-200"
        : classe === "Aceitável"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : classe === "Alto"
            ? "bg-orange-50 text-orange-700 border-orange-200"
            : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Percent className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Percentual de Gordura Corporal</h1>
          <p className="text-slate-500">
            Estimativa pelo método <strong>US Navy</strong>. Informe suas medidas em centímetros.
          </p>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Sexo">
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5"
              value={sexo}
              onChange={(e) => setSexo(e.target.value as Sexo)}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </Field>

          <Field label="Altura (cm)">
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
            />
          </Field>

          <Field label="Pescoço (cm)">
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={pescoco}
              onChange={(e) => setPescoco(e.target.value)}
            />
          </Field>

          <Field label="Cintura (cm)">
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={cintura}
              onChange={(e) => setCintura(e.target.value)}
            />
          </Field>

          {sexo === "F" && (
            <Field label="Quadril (cm)">
              <input
                inputMode="decimal"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
                value={quadril}
                onChange={(e) => setQuadril(e.target.value)}
              />
            </Field>
          )}

          <Field label="Peso (kg) — opcional">
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              placeholder="Ex.: 72,5"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </Field>
        </div>

        {/* Como medir */}
        <button
          className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          onClick={() => setShowHow((v) => !v)}
          aria-expanded={showHow}
        >
          <Info className="h-4 w-4" />
          Como medir corretamente
          {showHow ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showHow && (
          <ul className="mt-2 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex items-start gap-2">
              <Ruler className="mt-0.5 h-4 w-4 text-indigo-600" />
              Pescoço: fita logo abaixo da laringe, com leve inclinação para frente.
            </li>
            <li className="flex items-start gap-2">
              <Ruler className="mt-0.5 h-4 w-4 text-indigo-600" />
              Cintura: ponto mais estreito/umbigo, sem “apertar” a fita.
            </li>
            <li className="flex items-start gap-2">
              <Ruler className="mt-0.5 h-4 w-4 text-indigo-600" />
              Quadril (mulheres): parte mais larga dos glúteos.
            </li>
          </ul>
        )}
      </section>

      {/* Resultados */}
      <section className="grid gap-4 md:grid-cols-4">
        <Card
          title="Gordura corporal"
          value={fmtPct(bodyFat)}
          expl="Porcentagem estimada de gordura corporal."
          icon={<Percent className="h-5 w-5 text-indigo-600" />}
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-600">
            <User className="h-5 w-5 text-indigo-600" />
            <span>Classificação</span>
          </div>
          <div
            className={`inline-flex rounded-full border px-2 py-0.5 text-sm font-semibold ${badgeColor}`}
          >
            {classe}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Faixas variam por sexo e idade; use como referência geral.
          </p>
        </div>
        <Card
          title="Massa gorda"
          value={fmtKg(massaGorda)}
          expl="Peso estimado de gordura (requer peso informado)."
          icon={<Scale className="h-5 w-5 text-indigo-600" />}
        />
        <Card
          title="Massa magra"
          value={fmtKg(massaMagra)}
          expl="Peso corporal sem gordura (requer peso informado)."
          icon={<Dumbbell className="h-5 w-5 text-indigo-600" />}
        />
      </section>

      {/* CTA IMC */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Scale className="h-5 w-5 text-indigo-600" />
          <p className="text-sm">
            Quer conferir seu <strong>IMC</strong>? Compare seu peso com as faixas de referência.
          </p>
        </div>
        <Link
          href="/calculators/imc"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          aria-label="Ir para a calculadora de IMC"
        >
          Calcular IMC
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Card({
  title,
  value,
  expl,
  icon,
}: {
  title: string;
  value: string;
  expl: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-sm text-slate-600">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{expl}</p>
    </div>
  );
}
