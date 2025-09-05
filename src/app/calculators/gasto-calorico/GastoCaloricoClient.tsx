"use client";

import { useMemo, useState, ReactNode } from "react";
import { GiMeat, GiAvocado } from "react-icons/gi";
import { FaBreadSlice } from "react-icons/fa";
import Link from "next/link";
import {
  Activity,
  Info,
  Flame,
  Equal,
  TrendingDown,
  TrendingUp,
  Footprints,
  Droplets,
  CalendarDays,
  ChefHat,
  Scale,
} from "lucide-react";
import { tmbMifflin, tdeeFromTmb } from "@/lib/health";

type Sexo = "M" | "F";
type Ritmo = "devagar" | "moderado" | "rapido";

const NIVEIS = [
  { id: "sed", label: "Sedentário", fator: 1.2, desc: "Sem exercícios regulares" },
  {
    id: "leve",
    label: "Leve (1–3x/sem)",
    fator: 1.375,
    desc: "Caminhadas leves, treinos ocasionais",
  },
  { id: "mod", label: "Moderado (3–5x/sem)", fator: 1.55, desc: "Treinos/passeios moderados" },
  {
    id: "alto",
    label: "Alto (6–7x/sem)",
    fator: 1.725,
    desc: "Exercícios intensos com frequência",
  },
  { id: "muito", label: "Muito alto", fator: 1.9, desc: "Trabalho físico e treinos pesados" },
] as const;

// 7.700 kcal ≈ 1 kg
const KCAL_POR_KG = 7700;
const KCAL_DIA = {
  devagar: Math.round((KCAL_POR_KG * 0.25) / 7), // ~275
  moderado: Math.round((KCAL_POR_KG * 0.5) / 7), // ~550
  rapido: Math.round((KCAL_POR_KG * 0.75) / 7), // ~825
} as const;
const KG_SEM = { devagar: 0.25, moderado: 0.5, rapido: 0.75 } as const;

function fmtKcalDia(n: number) {
  return `${n.toLocaleString("pt-BR")} kcal/dia`;
}
function fmtKcalRaw(n: number) {
  return n.toLocaleString("pt-BR");
}
function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export default function TdeeClient() {
  // === seção 1: dados ===
  const [sexo, setSexo] = useState<Sexo>("M");
  const [idade, setIdade] = useState("30");
  const [peso, setPeso] = useState("80"); // kg
  const [altura, setAltura] = useState("180"); // cm
  const [nivelId, setNivelId] = useState("mod");

  // === seção 2: meta ===
  const [pesoDesejado, setPesoDesejado] = useState<number | null>(null);
  const [ritmo, setRitmo] = useState<Ritmo>("moderado");

  const nivel = useMemo(() => NIVEIS.find((n) => n.id === nivelId) ?? NIVEIS[2], [nivelId]);

  const parsed = useMemo(() => {
    const i = Number(idade);
    const p = Number(peso.replace(",", "."));
    const a = Number(altura.replace(",", "."));
    if (![i, p, a].every((v) => Number.isFinite(v) && v > 0)) return null;
    return { i, p, a };
  }, [idade, peso, altura]);

  // limites do slider: ±30% do peso atual (mín 30 kg, máx 300 kg)
  const slider = useMemo(() => {
    const p = parsed?.p ?? 70;
    const min = Math.max(30, Math.round(p * 0.7));
    const max = Math.min(300, Math.round(p * 1.3));
    const value = clamp(pesoDesejado ?? Math.round(p - 5), min, max);
    return { min, max, value };
  }, [parsed, pesoDesejado]);

  const tmb = useMemo(() => {
    if (!parsed) return null;
    return tmbMifflin(sexo, parsed.p, parsed.a, parsed.i);
  }, [parsed, sexo]);

  const tdee = useMemo(() => {
    if (tmb == null) return null;
    return tdeeFromTmb(tmb, nivel.fator);
  }, [tmb, nivel.fator]);

  // intenção via slider
  const modo: "cut" | "maintain" | "bulk" = useMemo(() => {
    if (!parsed) return "maintain";
    const tgt = slider.value;
    if (tgt < parsed.p - 0.1) return "cut";
    if (tgt > parsed.p + 0.1) return "bulk";
    return "maintain";
  }, [parsed, slider.value]);

  // ajuste pela escolha do ritmo
  const ajusteDiario = useMemo(() => {
    if (!parsed || !tdee) return 0;
    const base = KCAL_DIA[ritmo];
    if (modo === "maintain") return 0;
    return modo === "cut" ? -base : base;
  }, [parsed, tdee, ritmo, modo]);

  const alvo = useMemo(() => {
    if (!tdee) return null;
    return Math.max(1000, Math.round(tdee + ajusteDiario));
  }, [tdee, ajusteDiario]);

  const getSemanal = useMemo(() => (alvo ? alvo * 7 : null), [alvo]);

  // água 30–45 ml/kg
  const agua = useMemo(() => {
    if (!parsed) return null;
    const min = Math.round(parsed.p * 30);
    const max = Math.round(parsed.p * 45);
    return { min, max, minL: (min / 1000).toFixed(1), maxL: (max / 1000).toFixed(1) };
  }, [parsed]);

  // macros
  const macros = useMemo(() => {
    if (!parsed || !alvo) return null;
    const pKg = parsed.p;
    const protG = modo === "cut" ? 2.0 * pKg : 1.8 * pKg;
    const gordG = clamp(0.8 * pKg, 40, 120);
    const protKcal = protG * 4;
    const gordKcal = gordG * 9;
    const carbKcal = Math.max(0, alvo - protKcal - gordKcal);
    const carbG = carbKcal / 4;
    const pct = (kcal: number) => Math.round((kcal / alvo) * 100);
    return {
      proteina: { g: Math.round(protG), kcal: Math.round(protKcal), pct: pct(protKcal) },
      gordura: { g: Math.round(gordG), kcal: Math.round(gordKcal), pct: pct(gordKcal) },
      carbo: { g: Math.round(carbG), kcal: Math.round(carbKcal), pct: pct(carbKcal) },
    };
  }, [parsed, alvo, modo]);

  // estimativa de tempo (informativa)
  const estimativa = useMemo(() => {
    if (!parsed) return null;
    const diff = Math.abs(slider.value - parsed.p);
    if (diff < 0.1 || modo === "maintain") return { semanas: 0, meses: 0 };
    const semanas = diff / KG_SEM[ritmo];
    const meses = semanas / 4.345; // aprox.
    return { semanas, meses, diff };
  }, [parsed, slider.value, ritmo, modo]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Título */}
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Activity className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">TDEE — Gasto Calórico Diário</h1>
          <p className="text-slate-500">
            Preencha seus dados. Depois ajuste o <strong>peso desejado</strong> e o{" "}
            <strong>ritmo</strong> na seção de meta.
          </p>
        </div>
      </header>

      {/* === SEÇÃO 1 — Seus dados === */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Seus dados</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <Field label="Idade (anos)">
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
            />
          </Field>
          <Field label="Peso atual (kg)">
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </Field>
          <Field label="Altura (cm)">
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
            />
          </Field>

          {/* Nível de atividade */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="text-sm font-medium text-slate-700">Nível de atividade</div>
            <div className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {NIVEIS.map((n) => (
                <button
                  key={n.id}
                  className={`cursor-pointer rounded-lg border p-2.5 text-left transition ${
                    n.id === nivelId
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => setNivelId(n.id)}
                  aria-pressed={n.id === nivelId}
                >
                  <div className="text-sm font-medium">{n.label}</div>
                  <div className="text-xs text-slate-600">
                    fator <strong>{n.fator}</strong> • {n.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            TMB usa <strong>Mifflin–St Jeor</strong>. O TDEE = TMB × fator do seu nível de
            atividade.
          </p>
        </div>
      </section>

      {/* === SEÇÃO 2 — Meta (duas colunas separadas) === */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Meta</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Coluna A — Slider do Peso Desejado */}
          {/* Coluna A — Slider do Peso Desejado (revisto) */}
          <div className="rounded-lg border border-slate-200 p-4">
            {/* faixa à direita */}
            <div className="text-right text-xs text-slate-500">
              Faixa: {slider.min}–{slider.max} kg
            </div>

            {/* slider */}
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={0.5}
              value={slider.value}
              onChange={(e) => setPesoDesejado(Number(e.target.value))}
              className="mt-2 w-full"
              aria-label="Peso desejado em quilogramas"
            />

            {/* linha do peso + badge e chips */}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Scale className="h-4 w-4 text-indigo-600" />
                Peso desejado: <strong className="ml-1">{slider.value} kg</strong>
                {/* badge de diferença */}
                {parsed && slider.value !== parsed.p && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold
            ${
              slider.value < parsed.p
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
                  >
                    {slider.value < parsed.p
                      ? `-${(parsed.p - slider.value).toFixed(1)} kg`
                      : `+${(slider.value - parsed.p).toFixed(1)} kg`}
                  </span>
                )}
              </div>

              {/* chips rápidos: -5 kg e IMC 25 */}
              {parsed && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* -5 kg */}
                  <button
                    onClick={() => setPesoDesejado(clamp(parsed.p - 5, slider.min, slider.max))}
                    className="cursor-pointer rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    aria-label="Definir peso desejado para -5 kg"
                  >
                    −5 kg
                  </button>

                  {/* IMC 25 */}
                  {(() => {
                    const h = parsed.a / 100; // metros
                    const alvoIMC22Raw = 22 * h * h;
                    const alvoIMC22 = clamp(
                      Math.round(alvoIMC22Raw * 2) / 2,
                      slider.min,
                      slider.max
                    ); // arredonda de 0.5 em 0.5
                    return (
                      <button
                        onClick={() => setPesoDesejado(alvoIMC22)}
                        className="cursor-pointer rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        aria-label="Definir peso desejado equivalente a IMC 22"
                        title={`Peso equivalente a IMC 22: ${alvoIMC22} kg`}
                      >
                        IMC 22
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* info leve: faixa saudável de IMC → pesos correspondentes */}
            {parsed && (
              <p className="mt-2 text-xs text-slate-600">
                Peso para IMC saudável (18,5–24,9):{" "}
                {(() => {
                  const h = parsed.a / 100;
                  const minKg = Math.round(18.5 * h * h * 2) / 2;
                  const maxKg = Math.round(24.9 * h * h * 2) / 2;
                  return (
                    <strong>
                      {minKg}–{maxKg} kg
                    </strong>
                  );
                })()}
              </p>
            )}
          </div>

          {/* Coluna B — Ritmo + Estimativa */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-700">Ritmo</div>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5"
              value={ritmo}
              onChange={(e) => setRitmo(e.target.value as Ritmo)}
            >
              <option value="devagar">Devagar (~0,25 kg por semana)</option>
              <option value="moderado">Moderado (~0,5 kg por semana)</option>
              <option value="rapido">Rápido (~0,75 kg por semana)</option>
            </select>

            {estimativa && (
              <p className="mt-3 text-sm text-slate-700">
                Estimativa de tempo com esse ritmo:{" "}
                <strong>~{Math.ceil(estimativa.semanas)} semanas</strong> (≈{" "}
                <strong>{Math.ceil(estimativa.meses)} meses</strong>).
                <br />
                <span className="text-xs text-slate-600">
                  *Apenas uma estimativa — o progresso real varia com adesão, metabolismo e rotina.
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Resumo principal (TMB/TDEE/GET) */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card
          title="TMB (repouso)"
          icon={<Flame className="h-5 w-5 text-indigo-600" />}
          value={tmb != null ? fmtKcalDia(Math.round(tmb)) : "—"}
          expl="Energia mínima para funções vitais, mesmo sem atividade."
        />
        <Card
          title="Gasto Calórico Diário"
          icon={<Equal className="h-5 w-5 text-indigo-600" />}
          value={tdee != null ? fmtKcalDia(Math.round(tdee)) : "—"}
          expl="Estimativa diária para manter o peso, conforme sua rotina."
        />
        <Card
          title="GET semanal"
          icon={<CalendarDays className="h-5 w-5 text-indigo-600" />}
          value={alvo != null ? `${fmtKcalRaw(alvo * 7)} kcal/semana` : "—"}
          expl="Total estimado de energia por semana com a meta atual."
        />
      </section>

      {/* Meta diária + água + nível */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title={
              modo === "bulk"
                ? "Meta (ganho de peso)"
                : modo === "cut"
                  ? "Meta (perda de peso)"
                  : "Meta (manutenção)"
            }
            icon={
              modo === "bulk" ? (
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              ) : modo === "cut" ? (
                <TrendingDown className="h-5 w-5 text-indigo-600" />
              ) : (
                <Equal className="h-5 w-5 text-indigo-600" />
              )
            }
            value={alvo != null ? fmtKcalDia(alvo) : "—"}
            expl={
              modo === "maintain"
                ? "Calorias para manter o peso atual."
                : "Calorias alvo por dia conforme peso desejado e ritmo."
            }
          />
          <Card
            title="Água sugerida"
            icon={<Droplets className="h-5 w-5 text-indigo-600" />}
            value={agua ? `${agua.minL}–${agua.maxL} L/dia` : "—"}
            expl="Faixa de 30–45 ml por kg de peso corporal."
          />
          <Card
            title="Nível de atividade"
            icon={<Activity className="h-5 w-5 text-indigo-600" />}
            value={nivel.fator.toLocaleString("pt-BR")}
            expl={`${nivel.label} • multiplicador do TDEE`}
          />
        </div>
      </section>

      {/* Macros sugeridas */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <ChefHat className="h-4 w-4 text-indigo-600" />
          <span>Distribuição de macronutrientes (meta diária)</span>
        </div>
        {macros ? (
          <div className="grid gap-4 md:grid-cols-3">
            <MacroCard
              title="Proteína"
              value={180}
              unit="g"
              percent={26}
              icon={<GiMeat className="h-5 w-5 text-rose-600" />}
            />
            <MacroCard
              title="Carboidratos"
              value={364}
              unit="g"
              percent={52}
              icon={<FaBreadSlice className="h-5 w-5 text-yellow-600" />}
            />
            <MacroCard
              title="Gordura"
              value={72}
              unit="g"
              percent={23}
              icon={<GiAvocado className="h-5 w-5 text-green-600" />}
            />
          </div>
        ) : (
          <div className="text-sm text-slate-600">Preencha os dados para ver as metas.</div>
        )}
        <p className="mt-3 text-sm text-slate-600">
          Regra base: proteína ~{modo === "cut" ? "2,0" : "1,8"} g/kg, gordura ~0,8 g/kg e o
          restante em carboidratos. Ajuste conforme saciedade, performance e preferências.
        </p>
      </section>

      {/* CTA IMC */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Footprints className="h-5 w-5 text-indigo-600" />
          <p className="text-sm">
            Quer conferir seu <strong>IMC</strong> agora? Compare com as faixas de referência.
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

function Field({ label, children }: { label: string; children: ReactNode }) {
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
  icon: ReactNode;
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

function MacroCard({
  title,
  value,
  unit,
  percent,
  icon,
}: {
  title: string;
  value: number;
  unit: string;
  percent: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-sm text-slate-600">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-900">
        {value} {unit}
      </div>
      <p className="mt-1 text-sm text-slate-600">{percent}%</p>
    </div>
  );
}
