"use client";
import { useMemo, useState } from "react";
import { CardLink } from "@/components/CardLink";
import { Tabs } from "@/components/Tabs";
import { TOOLS, CATEGORIES } from "@/config/tools";

export default function HomePage() {
  const [catIndex, setCatIndex] = useState(0);
  const filtered = useMemo(() => {
    const cat = CATEGORIES[catIndex];
    return cat === "Todas" ? TOOLS : TOOLS.filter((t) => t.category === cat);
  }, [catIndex]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-10 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            SmartCalc — suas <span className="text-blue-700">calculadoras online</span>
          </h1>
          <p className="mt-3 text-slate-600">
            Ferramentas rápidas, precisas e amigáveis. IMC, porcentagem, juros, regra de 3 e mais.
          </p>
        </div>
      </section>

      {/* ABAS */}
      <section id="categorias" className="mt-8 flex justify-center">
        <Tabs tabs={CATEGORIES.map((c) => ({ id: c.toLowerCase(), label: c }))} onChange={setCatIndex} />
      </section>

      {/* GRID */}
      <section id="todas" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => <CardLink key={tool.href} {...tool} />)}
      </section>
    </main>
  );
}
