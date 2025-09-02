"use client";
import { useMemo, useState } from "react";

export default function IdadePage() {
  const [date, setDate] = useState("");

  const res = useMemo(() => {
    if (!date) return null;
    const birth = new Date(date + "T00:00:00");
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonth;
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }
    return { years, months, days };
  }, [date]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Calculadora de Idade</h1>
      <div className="mt-4">
        <label htmlFor="d" className="block text-sm font-medium">Data de nascimento</label>
        <input id="d" type="date" className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm text-zinc-600">Resultado</div>
        <div className="mt-1 text-3xl font-semibold">
          {res ? `${res.years}a ${res.months}m ${res.days}d` : "--"}
        </div>
      </div>
    </main>
  );
}
