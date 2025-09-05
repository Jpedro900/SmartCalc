"use client";

import { useMemo } from "react";
import { CalendarDays, Bell } from "lucide-react";

// Lista de feriados (poderia vir de API no futuro)
const HOLIDAYS = [
  { name: "Independência do Brasil", date: "2025-09-07" },
  { name: "Nossa Senhora Aparecida", date: "2025-10-12" },
  { name: "Finados", date: "2025-11-02" },
  { name: "Proclamação da República", date: "2025-11-15" },
  { name: "Natal", date: "2025-12-25" },
  { name: "Confraternização Universal", date: "2026-01-01" },
  { name: "Carnaval (terça-feira)", date: "2026-02-17" },
  { name: "Sexta-feira Santa", date: "2026-04-03" },
];

function diasRestantes(dateStr: string) {
  const hoje = new Date();
  const alvo = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((alvo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function FeriadosClient() {
  const futuros = useMemo(
    () =>
      HOLIDAYS.filter((h) => diasRestantes(h.date) >= 0).sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    []
  );

  const proximo = futuros[0];

  function lembrar(feriado: { name: string; date: string }) {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          const dia = new Date(feriado.date).toLocaleDateString("pt-BR");
          new Notification("📅 Lembrete de feriado", {
            body: `${feriado.name} será em ${dia}`,
          });
        }
      });
    } else {
      alert("Seu navegador não suporta notificações.");
    }
  }

  function marcarNoCalendario(feriado: { name: string; date: string }) {
    const start = feriado.date.replace(/-/g, "");
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      feriado.name
    )}&dates=${start}/${start}`;
    window.open(url, "_blank");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-indigo-600 shadow-sm">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Próximos feriados</h1>
          <p className="text-slate-500">Veja os próximos feriados e adicione lembretes.</p>
        </div>
      </header>

      {proximo && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-indigo-700">🎉 Próximo: {proximo.name}</h2>
          <p className="text-slate-600">
            {new Date(proximo.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => lembrar(proximo)}
              className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
            >
              <Bell className="h-4 w-4" /> Lembrar-me
            </button>
            <button
              onClick={() => marcarNoCalendario(proximo)}
              className="flex items-center gap-1 rounded border border-indigo-300 bg-white px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50"
            >
              <CalendarDays className="h-4 w-4" /> Marcar no calendário
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {futuros.map((f) => (
          <li
            key={f.date}
            className="flex items-center justify-between rounded-lg border bg-white px-4 py-2 shadow-sm"
          >
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-sm text-slate-500">
                {new Date(f.date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </div>
            </div>
            <span className="text-sm font-semibold text-indigo-600">
              faltam {diasRestantes(f.date)} dias
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
