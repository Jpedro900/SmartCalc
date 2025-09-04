"use client";

import { useMemo } from "react";
import { CalendarDays, Star } from "lucide-react";

/** Páscoa (Calendário Gregoriano) */
function easterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function fmtBR(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function daysDiff(from: Date, to: Date) {
  const A = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const B = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((B.getTime() - A.getTime()) / (1000 * 60 * 60 * 24));
}

type Fer = { date: Date; name: string; popular?: boolean };

function feriadosBR(year: number): Fer[] {
  const pascoa = easterDate(year);
  const carnaval = addDays(pascoa, -47); // terça
  const sextaSanta = addDays(pascoa, -2);
  const corpus = addDays(pascoa, 60);

  // fixos
  const list: Fer[] = [
    {
      date: new Date(year, 0, 1),
      name: "Confraternização Universal",
      popular: true,
    },
    { date: carnaval, name: "Carnaval (terça-feira)", popular: true },
    { date: sextaSanta, name: "Sexta-feira Santa", popular: true },
    { date: pascoa, name: "Páscoa", popular: true },
    { date: new Date(year, 3, 21), name: "Tiradentes" },
    { date: new Date(year, 4, 1), name: "Dia do Trabalhador", popular: true },
    { date: corpus, name: "Corpus Christi", popular: true },
    {
      date: new Date(year, 8, 7),
      name: "Independência do Brasil",
      popular: true,
    },
    {
      date: new Date(year, 9, 12),
      name: "Nossa Senhora Aparecida",
      popular: true,
    },
    { date: new Date(year, 10, 2), name: "Finados" },
    {
      date: new Date(year, 10, 15),
      name: "Proclamação da República",
      popular: true,
    },
    { date: new Date(year, 11, 25), name: "Natal", popular: true },
  ];
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function FeriadosClient() {
  const proximos = useMemo(() => {
    const hoje = new Date();
    const y = hoje.getFullYear();
    const all = [...feriadosBR(y), ...feriadosBR(y + 1)];
    return all
      .map((f) => ({ ...f, days: daysDiff(hoje, f.date) }))
      .filter((f) => f.days >= 0)
      .slice(0, 8);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <CalendarDays className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Feriados no Brasil</h1>
          <p className="text-slate-500">Veja os próximos feriados e quanto tempo falta.</p>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ul className="divide-y divide-slate-200">
          {proximos.map((f, idx) => (
            <li key={idx} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-slate-900">{f.name}</div>
                <div className="text-sm text-slate-600">{fmtBR(f.date)}</div>
              </div>
              <div className="flex items-center gap-2">
                {f.popular && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                    <Star className="h-3.5 w-3.5" /> Popular
                  </span>
                )}
                <span className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-sm">
                  faltam <span className="font-semibold">{f.days}</span> dias
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
