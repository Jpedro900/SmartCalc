"use client";

import { useMemo, useState } from "react";
import { PawPrint, Bone, Fish, Ruler, HeartPulse, Syringe, Info, Sparkles } from "lucide-react";

type Especie = "cao" | "gato";
type Porte = "pequeno" | "medio" | "grande";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function toMonths(years: number, months: number) {
  const y = isFinite(years) ? years : 0;
  const m = isFinite(months) ? months : 0;
  return clamp(Math.round(y * 12 + m), 0, 50 * 12);
}

/** Regras práticas:
 *  Cão:
 *   - 1º ano ≈ 15 “humanos”
 *   - 2º ano ≈ +9 “humanos”
 *   - depois:
 *       pequeno: +4/ano
 *       médio:   +5/ano
 *       grande:  +6/ano
 *  Gato:
 *   - 1º ano ≈ 15, 2º ano ≈ +9, depois +4/ano
 */
function humanAge(especie: Especie, totalMonths: number, porte: Porte): number {
  const years = totalMonths / 12;
  if (years <= 0) return 0;

  if (especie === "gato") {
    if (years <= 1) return years * 15;
    if (years <= 2) return 15 + (years - 1) * 9;
    return 24 + (years - 2) * 4;
  }

  // cão
  let afterRate = 5;
  if (porte === "pequeno") afterRate = 4;
  if (porte === "medio") afterRate = 5;
  if (porte === "grande") afterRate = 6;

  if (years <= 1) return years * 15;
  if (years <= 2) return 15 + (years - 1) * 9;
  return 24 + (years - 2) * afterRate;
}

function faseDaVida(especie: Especie, totalMonths: number, porte: Porte) {
  // janelas aproximadas e amigáveis
  if (especie === "gato") {
    if (totalMonths < 12) return "Filhote";
    if (totalMonths < 84) return "Adulto"; // até 7 anos
    return "Sênior";
  }
  // cão ajusta pelo porte
  const adultoMin = porte === "grande" ? 18 : 12; // grandes amadurecem mais tarde
  const seniorMin = porte === "grande" ? 84 : 96; // grandes viram sênior antes
  if (totalMonths < adultoMin) return "Filhote";
  if (totalMonths < seniorMin) return "Adulto";
  return "Sênior";
}

const FACTS = {
  cao: {
    Filhote: [
      "Filhotes aprendem comandos básicos mais rápido até ~6 meses.",
      "A socialização precoce reduz medo e agressividade no futuro.",
      "Filhotes dormem até 18–20 h/dia para crescer e consolidar memórias.",
      "Dentição completa surge por volta de 6–7 meses.",
    ],
    Adulto: [
      "Cães adultos precisam de rotina de enriquecimento (brinquedos, farejamento).",
      "Exercícios regulares ajudam a prevenir ansiedade e sobrepeso.",
      "Farejar cansa tanto quanto caminhar — trate passeios como ‘tempo de cheiros’.",
      "Escovação semanal reduz queda de pelos e mantém pele saudável.",
    ],
    Sênior: [
      "Check-up semestral ajuda a detectar cedo problemas articulares ou renais.",
      "Tapetes antiderrapantes e rampas tornam a casa mais confortável.",
      "Rotina estável e passeios curtos mantêm mente e corpo ativos.",
      "Dietas específicas podem aliviar articulações e controlar peso.",
    ],
  },
  gato: {
    Filhote: [
      "Brincadeiras curtas várias vezes ao dia imitam caça e ensinam controle de mordida.",
      "Caixas de papel e túneis estimulam exploração segura.",
      "Introdução gradual à caixa de transporte reduz estresse no futuro.",
    ],
    Adulto: [
      "Gatos preferem bebedouros afastados do comedouro — motive a ingestão de água.",
      "Arranhadores altos ajudam a gastar energia e proteger móveis.",
      "Caça sintética (varinhas) 10–15 min/dia reduz tédio.",
    ],
    Sênior: [
      "Prefira bandejas de areia com bordo baixo para facilitar o acesso.",
      "Plataformas baixas e macias são mais confortáveis para articulações.",
      "Fontes de água incentivam hidratação e saúde renal.",
    ],
  },
} as const;

function pickFacts(especie: Especie, fase: "Filhote" | "Adulto" | "Sênior", seed: number, n = 3) {
  const arr = FACTS[especie][fase];
  // pseudo-sorteio determinístico: gira a lista pelo "seed"
  const k = seed % arr.length;
  const rolled = [...arr.slice(k), ...arr.slice(0, k)];
  return rolled.slice(0, Math.min(n, rolled.length));
}

function fmtYearsMonths(totalMonths: number) {
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const py = y > 0 ? `${y} ${y === 1 ? "ano" : "anos"}` : "";
  const pm = m > 0 ? `${m} ${m === 1 ? "mês" : "meses"}` : "";
  return [py, pm].filter(Boolean).join(" e ") || "0 mês";
}

export default function PetIdadeClient() {
  const [especie, setEspecie] = useState<Especie>("cao");
  const [porte, setPorte] = useState<Porte>("medio");
  const [anos, setAnos] = useState("3");
  const [meses, setMeses] = useState("0");

  const totalMonths = useMemo(
    () => toMonths(Number(anos.replace(",", ".")), Number(meses.replace(",", "."))),
    [anos, meses]
  );

  const idadeHumana = useMemo(
    () => humanAge(especie, totalMonths, porte),
    [especie, totalMonths, porte]
  );

  const fase = useMemo<"Filhote" | "Adulto" | "Sênior">(
    () => faseDaVida(especie, totalMonths, porte),
    [especie, totalMonths, porte]
  );

  const curiosidades = useMemo(
    () => pickFacts(especie, fase, totalMonths),
    [especie, fase, totalMonths]
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <PawPrint className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Idade do Pet (Cão e Gato)</h1>
          <p className="text-slate-500">
            Descubra a idade equivalente em humanos, a fase da vida e dicas úteis.
          </p>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <PawPrint className="h-4 w-4 text-indigo-600" />
              Espécie
            </span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5"
              value={especie}
              onChange={(e) => setEspecie(e.target.value as Especie)}
            >
              <option value="cao">Cão</option>
              <option value="gato">Gato</option>
            </select>
          </label>

          {especie === "cao" && (
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Ruler className="h-4 w-4 text-indigo-600" />
                Porte
              </span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5"
                value={porte}
                onChange={(e) => setPorte(e.target.value as Porte)}
              >
                <option value="pequeno">Pequeno</option>
                <option value="medio">Médio</option>
                <option value="grande">Grande</option>
              </select>
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Anos</span>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={anos}
              onChange={(e) => setAnos(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Meses</span>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            As equivalências são aproximadas (baseadas em curvas comuns de maturação). Porte
            influencia bastante nos cães — raças grandes envelhecem mais rápido.
          </p>
        </div>
      </section>

      {/* Resultados */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card
          title="Idade do pet"
          icon={
            especie === "gato" ? (
              <Fish className="h-5 w-5 text-indigo-600" />
            ) : (
              <Bone className="h-5 w-5 text-indigo-600" />
            )
          }
        >
          <div className="text-2xl font-semibold text-slate-900">{fmtYearsMonths(totalMonths)}</div>
          <p className="mt-1 text-sm text-slate-600">
            {especie === "gato" ? "Gato" : "Cão"} • {fase}
          </p>
        </Card>

        <Card
          title="Idade humana (equivalente)"
          icon={<HeartPulse className="h-5 w-5 text-indigo-600" />}
        >
          <div className="text-2xl font-semibold text-slate-900">
            {idadeHumana.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} anos
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Estimativa baseada em curvas por espécie e porte.
          </p>
        </Card>

        <Card title="Saúde & Vacinas" icon={<Syringe className="h-5 w-5 text-indigo-600" />}>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {fase === "Filhote" && (
              <li>Vacinação básica deve estar em dia — consulte o calendário local.</li>
            )}
            {fase === "Adulto" && (
              <li>Vermifugação e antipulgas regulares previnem problemas comuns.</li>
            )}
            {fase === "Sênior" && (
              <li>Check-up semestral e controle de peso ajudam na qualidade de vida.</li>
            )}
            <li>Água fresca e ambiente enriquecido todos os dias.</li>
          </ul>
        </Card>
      </section>

      {/* Curiosidades */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Curiosidades para o seu pet
        </div>
        <ul className="grid gap-2 md:grid-cols-3">
          {curiosidades.map((c, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-sm text-slate-600">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
