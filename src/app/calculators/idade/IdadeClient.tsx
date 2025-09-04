"use client";

import { useMemo, useState } from "react";
import { Calendar, Cake, Hourglass, Clock, HeartPulse, Rocket, Info } from "lucide-react";

type AgeBreakdown = {
  years: number;
  months: number;
  days: number;
};

const PT_WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

function fmt(n: number, maxFrac: number = 0) {
  return n.toLocaleString("pt-BR", {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: maxFrac,
  });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("pt-BR");
}
function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

// signo ocidental
function westernZodiac(d: Date) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if ((m === 3 && day >= 21) || (m === 4 && day <= 20)) return "Áries";
  if ((m === 4 && day >= 21) || (m === 5 && day <= 20)) return "Touro";
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "Gêmeos";
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "Câncer";
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "Leão";
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "Virgem";
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "Libra";
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "Escorpião";
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "Sagitário";
  if ((m === 12 && day >= 22) || (m === 1 && day <= 20)) return "Capricórnio";
  if ((m === 1 && day >= 21) || (m === 2 && day <= 18)) return "Aquário";
  return "Peixes";
}

// ocidental — curiosidades curtas
const WESTERN_FACTS: Record<string, string> = {
  Áries: "Elemento: Fogo 🔥 • Palavra-chave: iniciativa. Costuma liderar e começar projetos.",
  Touro: "Elemento: Terra 🌱 • Palavra-chave: estabilidade. Valoriza segurança e constância.",
  Gêmeos: "Elemento: Ar 💨 • Palavra-chave: comunicação. Aprende e se adapta rápido.",
  Câncer: "Elemento: Água 💧 • Palavra-chave: cuidado. Forte memória e intuição.",
  Leão: "Elemento: Fogo 🔥 • Palavra-chave: expressão. Criatividade e confiança em alta.",
  Virgem: "Elemento: Terra 🌱 • Palavra-chave: análise. Detalhista, prático e organizado.",
  Libra: "Elemento: Ar 💨 • Palavra-chave: equilíbrio. Media conflitos e ama harmonia.",
  Escorpião: "Elemento: Água 💧 • Palavra-chave: intensidade. Olhar investigativo e transformador.",
  Sagitário:
    "Elemento: Fogo 🔥 • Palavra-chave: expansão. Busca sentido, viagens e ideias grandes.",
  Capricórnio:
    "Elemento: Terra 🌱 • Palavra-chave: disciplina. Paciência e ambição de longo prazo.",
  Aquário: "Elemento: Ar 💨 • Palavra-chave: originalidade. Inovação e visão coletiva.",
  Peixes: "Elemento: Água 💧 • Palavra-chave: empatia. Imaginação e sensibilidade elevadas.",
};

// signo chinês
const CHINESE = [
  "Rato",
  "Boi",
  "Tigre",
  "Coelho",
  "Dragão",
  "Serpente",
  "Cavalo",
  "Carneiro",
  "Macaco",
  "Galo",
  "Cão",
  "Porco",
];
function chineseZodiac(year: number) {
  const idx = (year - 1900) % 12;
  return CHINESE[(idx + 12) % 12];
}

// chinês — curiosidades curtas
const CHINESE_FACTS: Record<string, string> = {
  Rato: "Astuto e versátil. Aproveita oportunidades e aprende depressa.",
  Boi: "Constante e trabalhador. Progresso firme, sem atalhos.",
  Tigre: "Corajoso e competitivo. Enfrenta desafios de frente.",
  Coelho: "Diplomático e gentil. Valoriza paz e elegância.",
  Dragão: "Magnético e confiante. Carisma para liderar.",
  Serpente: "Observadora e sábia. Prefere estratégias discretas.",
  Cavalo: "Enérgico e livre. Precisa de movimento e aventura.",
  Carneiro: "Criativo e solidário. Sensível à estética e ao grupo.",
  Macaco: "Curioso e inventivo. Adora desafios mentais.",
  Galo: "Detalhista e pontual. Preza organização e clareza.",
  Cão: "Leal e protetor. Forte senso de justiça.",
  Porco: "Generoso e sociável. Busca conforto e bons momentos.",
};

function diffYMD(from: Date, to: Date): AgeBreakdown {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    const prevMonthDays = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonthDays;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

function nextBirthday(from: Date, birth: Date) {
  const year = from.getFullYear();
  let next = new Date(year, birth.getMonth(), birth.getDate());
  if (birth.getMonth() === 1 && birth.getDate() === 29 && !isLeapYear(year)) {
    next = new Date(year, 1, 28);
  }
  if (next < new Date(from.getFullYear(), from.getMonth(), from.getDate())) {
    const y = year + 1;
    next = new Date(y, birth.getMonth(), birth.getDate());
    if (birth.getMonth() === 1 && birth.getDate() === 29 && !isLeapYear(y)) {
      next = new Date(y, 1, 28);
    }
  }
  return next;
}

// idade “em planetas”
const ORBITS = {
  Mercúrio: 0.2408467,
  Vênus: 0.61519726,
  Marte: 1.8808158,
  Júpiter: 11.862615,
  Saturno: 29.447498,
  Urano: 84.016846,
  Netuno: 164.79132,
} as const;

// badge “!” com tooltip acessível
function InfoBadge({ label, tip }: { label: string; tip: string }) {
  return (
    <span className="relative ml-2 inline-block align-middle group">
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-extrabold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={`Curiosidade sobre ${label}`}
      >
        !
      </button>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 z-10 hidden w-64 -translate-x-1/2 translate-y-1.5 rounded-md border border-slate-200 bg-white p-2 text-xs leading-relaxed text-slate-700 shadow-lg group-hover:block group-focus-within:block"
      >
        {tip}
      </div>
    </span>
  );
}

export default function IdadeClient() {
  const [date, setDate] = useState<string>("");

  const calc = useMemo(() => {
    if (!date) return null;

    const birth = new Date(`${date}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;

    const now = new Date();

    const ymd = diffYMD(birth, now);

    const ms = now.getTime() - birth.getTime();
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    const nb = nextBirthday(now, birth);
    const untilMs =
      new Date(nb.getFullYear(), nb.getMonth(), nb.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const untilDays = Math.max(0, Math.round(untilMs / (1000 * 60 * 60 * 24)));
    const weekdayBirth = PT_WEEKDAYS[birth.getDay()];
    const weekdayNext = PT_WEEKDAYS[nb.getDay()];

    let leapCount = 0;
    for (let y = birth.getFullYear(); y <= now.getFullYear(); y++) {
      if (isLeapYear(y)) leapCount++;
    }

    const heartBeatsEst = Math.round(minutes * 70);
    const breathsEst = Math.round(hours * 12 * 60);

    const earthYears = ms / (1000 * 60 * 60 * 24 * 365.25);
    const planets = Object.entries(ORBITS).map(([planet, p]) => ({
      planet,
      years: earthYears / p,
    }));

    return {
      birth,
      ymd,
      days,
      hours,
      minutes,
      seconds,
      weeks,
      leapCount,
      nb,
      untilDays,
      weekdayBirth,
      weekdayNext,
      western: westernZodiac(birth),
      chinese: chineseZodiac(birth.getFullYear()),
      heartBeatsEst,
      breathsEst,
      planets,
    };
  }, [date]);

  // textos de tooltip
  const westernTip = calc ? (WESTERN_FACTS[calc.western] ?? "") : "";
  const chineseTip = calc ? (CHINESE_FACTS[calc.chinese] ?? "") : "";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Calendar className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Calculadora de Idade</h1>
          <p className="text-slate-500">Anos, meses e dias — com curiosidades.</p>
        </div>
      </div>

      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="dob" className="block text-sm font-medium text-slate-700">
          Data de nascimento
        </label>
        <input
          id="dob"
          type="date"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p className="mt-2 text-xs text-slate-500">
          Dica: você pode digitar a data ou usar o seletor do navegador.
        </p>
      </div>

      {/* Resultado resumido */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Idade</span>
            <Hourglass className="h-5 w-5 text-indigo-600" aria-hidden />
          </div>
          <div className="text-3xl font-semibold text-slate-900">
            {calc
              ? `${calc.ymd.years} anos, ${calc.ymd.months} meses, ${calc.ymd.days} dias`
              : "--"}
          </div>
          {calc && (
            <div className="mt-2 text-sm text-slate-500">
              Nasc.: <strong className="font-medium text-slate-700">{fmtDate(calc.birth)}</strong> (
              {calc.weekdayBirth})
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Próximo aniversário</span>
            <Cake className="h-5 w-5 text-indigo-600" aria-hidden />
          </div>
          <div className="text-3xl font-semibold text-slate-900">
            {calc ? `${fmt(calc.untilDays)} ${calc.untilDays === 1 ? "dia" : "dias"}` : "--"}
          </div>
          {calc && (
            <div className="mt-2 text-sm text-slate-500">
              {fmtDate(calc.nb)} ({calc.weekdayNext})
            </div>
          )}
        </div>
      </section>

      {/* Tabela principal */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 divide-y divide-slate-200 text-sm md:grid-cols-2 md:divide-x md:divide-y-0">
          <Row
            label="Dias vividos"
            value={calc ? `${fmt(calc.days)} dias` : "—"}
            icon={<Clock className="h-4 w-4" />}
          />
          <Row
            label="Horas vividas"
            value={calc ? `${fmt(calc.hours)} horas` : "—"}
            icon={<Clock className="h-4 w-4" />}
          />
          <Row
            label="Minutos vividos"
            value={calc ? `${fmt(calc.minutes)} minutos` : "—"}
            icon={<Clock className="h-4 w-4" />}
          />
          <Row
            label="Segundos vividos"
            value={calc ? `${fmt(calc.seconds)} segundos` : "—"}
            icon={<Clock className="h-4 w-4" />}
          />
          <Row
            label="Semanas vividas"
            value={calc ? `${fmt(calc.weeks)} semanas` : "—"}
            icon={<Clock className="h-4 w-4" />}
          />
          <Row
            label="Anos bissextos vividos"
            value={calc ? `${fmt(calc.leapCount)} anos` : "—"}
            icon={<Info className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Curiosidades */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-slate-700">Curiosidades</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Signos</span>
              <Info className="h-5 w-5 text-indigo-600" aria-hidden />
            </div>
            <ul className="list-inside list-disc text-sm text-slate-600">
              <li className="flex items-center">
                Ocidental (Sol):{" "}
                <span className="ml-1 font-medium text-slate-800">{calc ? calc.western : "—"}</span>
                {calc && westernTip && (
                  <InfoBadge label={`signo ocidental ${calc.western}`} tip={westernTip} />
                )}
              </li>
              <li className="mt-1 flex items-center">
                Chinês (ano):{" "}
                <span className="ml-1 font-medium text-slate-800">{calc ? calc.chinese : "—"}</span>
                {calc && chineseTip && (
                  <InfoBadge label={`signo chinês ${calc.chinese}`} tip={chineseTip} />
                )}
              </li>
              <li className="mt-1">Você nasceu numa {calc ? calc.weekdayBirth : "—"}.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Corpo em números (estimativas)
              </span>
              <HeartPulse className="h-5 w-5 text-indigo-600" aria-hidden />
            </div>
            <ul className="list-inside list-disc text-sm text-slate-600">
              <li>
                Batimentos cardíacos:{" "}
                <span className="font-medium text-slate-800">
                  {calc ? fmt(calc.heartBeatsEst) : "—"}
                </span>{" "}
                (~70 bpm)
              </li>
              <li>
                Respirações:{" "}
                <span className="font-medium text-slate-800">
                  {calc ? fmt(calc.breathsEst) : "—"}
                </span>{" "}
                (~12 por min)
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Idade em outros planetas</span>
            <Rocket className="h-5 w-5 text-indigo-600" aria-hidden />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            {calc ? (
              calc.planets.map((p) => (
                <div
                  key={p.planet}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="text-slate-500">{p.planet}</div>
                  <div className="text-lg font-semibold text-slate-900">{fmt(p.years, 2)} anos</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-slate-500">—</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-slate-600">{label}</span>
      </div>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
