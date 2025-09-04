"use client";

import { useMemo } from "react";
import { CalendarDays, Star } from "lucide-react";
import { feriadosBR, daysDiff } from "@/lib/feriados";

function fmtBR(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
