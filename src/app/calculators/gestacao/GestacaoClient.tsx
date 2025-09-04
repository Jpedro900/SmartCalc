"use client";

import { useMemo, useState } from "react";
import { Baby, Calendar, Info } from "lucide-react";

type Out = {
  semanas: number;
  diasRest: number;
  dpp: Date;
  trimestre: 1 | 2 | 3;
  hoje: Date;
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function diffInDays(a: Date, b: Date) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
function fmtDateBR(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function GestacaoClient() {
  const [dum, setDum] = useState<string>(""); // Data da Última Menstruação
  const [cycleStr, setCycleStr] = useState<string>("28"); // duração do ciclo (dias), padrão 28

  const out = useMemo<Out | null>(() => {
    if (!dum) return null;
    const dumDate = new Date(dum + "T00:00:00");
    if (isNaN(dumDate.getTime())) return null;

    // ajuste por duração do ciclo (método de Naegele ajustado)
    // ciclos > 28: ovulação mais tarde → some (cycle-28) dias à DUM para estimar concepção
    const cycle = Number(cycleStr);
    const adj = isFinite(cycle) ? Math.round(cycle - 28) : 0;

    const hoje = startOfDay(new Date());
    const dumAdj = addDays(dumDate, adj);

    // idade gestacional = dias desde DUM ajustada
    const dias = diffInDays(hoje, dumAdj);
    if (dias < 0) return null; // DUM futura → inválido

    const semanas = Math.floor(dias / 7);
    const diasRest = dias % 7;

    // DPP = DUM + 280 dias (40 semanas), também com ajuste
    const dpp = addDays(dumAdj, 280);

    let trimestre: 1 | 2 | 3 = 1;
    if (semanas >= 13 && semanas < 28) trimestre = 2;
    if (semanas >= 28) trimestre = 3;

    return { semanas, diasRest, dpp, trimestre, hoje };
  }, [dum, cycleStr]);

  const semanasFmt = out ? `${out.semanas} sem ${out.diasRest} d` : "—";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Baby className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Idade Gestacional & DPP</h1>
          <p className="text-slate-500">
            Cálculo pela DUM (data da última menstruação), com ajuste da duração do ciclo.
          </p>
        </div>
      </div>

      {/* inputs */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Calendar className="h-4 w-4" /> DUM — Data da última menstruação
            </div>
            <input
              id="dum"
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5"
              value={dum}
              onChange={(e) => setDum(e.target.value)}
              aria-label="Data da última menstruação"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Duração do ciclo (dias)</div>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5"
              value={cycleStr}
              onChange={(e) => setCycleStr(e.target.value)}
              placeholder="28"
              aria-label="Duração do ciclo em dias"
            />
          </label>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            A DPP (data provável do parto) é estimada como <strong>DUM + 280 dias</strong>. O ajuste
            do ciclo considera ovulação mais cedo/tarde em ciclos <em>&lt; 28</em> ou{" "}
            <em>&gt; 28</em> dias. Este cálculo é apenas informativo e não substitui acompanhamento
            médico.
          </p>
        </div>
      </section>

      {/* resultado */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Idade gestacional" value={semanasFmt} />
        <Card title="Trimestre" value={out ? `${out.trimestre}º` : "—"} />
        <Card title="DPP (estimada)" value={out ? fmtDateBR(out.dpp) : "—"} />

        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-600">Hoje</div>
          <div className="mt-1 text-lg font-semibold">{out ? fmtDateBR(out.hoje) : "—"}</div>
        </div>
      </section>
    </div>
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
