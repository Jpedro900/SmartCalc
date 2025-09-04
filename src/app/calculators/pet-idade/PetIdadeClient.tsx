"use client";

import { useMemo, useState } from "react";
import { Dog, Cat, Info } from "lucide-react";

type Especie = "cao" | "gato";
type Porte = "pequeno" | "medio" | "grande" | "gigante";

/** Modelos simples, comuns em veterinária popular (aproximação). */
function idadeHumanaCao(anos: number, porte: Porte) {
  if (anos <= 0) return 0;
  let h = 0;
  if (anos >= 1) h += 15;
  if (anos >= 2) h += 9;
  const resto = Math.max(0, anos - 2);
  const mult = porte === "pequeno" || porte === "medio" ? 5 : porte === "grande" ? 6 : 7;
  h += resto * mult;
  return h;
}
function idadeHumanaGato(anos: number) {
  if (anos <= 0) return 0;
  let h = 0;
  if (anos >= 1) h += 15;
  if (anos >= 2) h += 9;
  const resto = Math.max(0, anos - 2);
  h += resto * 4;
  return h;
}

export default function PetIdadeClient() {
  const [especie, setEspecie] = useState<Especie>("cao");
  const [porte, setPorte] = useState<Porte>("medio");
  const [anosStr, setAnosStr] = useState("5");
  const [mesesStr, setMesesStr] = useState("0");

  const out = useMemo(() => {
    const anos = Number(anosStr);
    const meses = Number(mesesStr);
    if (![anos, meses].every((v) => isFinite(v) && v >= 0)) return null;
    const totalAnos = anos + meses / 12;

    const humana =
      especie === "cao" ? idadeHumanaCao(totalAnos, porte) : idadeHumanaGato(totalAnos);
    return { totalAnos, humana };
  }, [especie, porte, anosStr, mesesStr]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          {especie === "cao" ? (
            <Dog className="h-5 w-5 text-indigo-600" />
          ) : (
            <Cat className="h-5 w-5 text-indigo-600" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold">Idade do pet (cão/gato)</h1>
          <p className="text-slate-500">Converta idade do pet para “anos humanos”.</p>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block md:col-span-3">
            <div className="text-sm font-medium text-slate-700">Espécie</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  especie === "cao"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setEspecie("cao")}
              >
                Cão
              </button>
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  especie === "gato"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setEspecie("gato")}
              >
                Gato
              </button>
            </div>
          </label>

          {especie === "cao" && (
            <label className="block md:col-span-3">
              <div className="text-sm font-medium text-slate-700">Porte do cão</div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {(["pequeno", "medio", "grande", "gigante"] as Porte[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      porte === p
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                    onClick={() => setPorte(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </label>
          )}

          <Field label="Anos">
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="numeric"
              value={anosStr}
              onChange={(e) => setAnosStr(e.target.value)}
            />
          </Field>
          <Field label="Meses">
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
              inputMode="numeric"
              value={mesesStr}
              onChange={(e) => setMesesStr(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Modelo aproximado usado por clínicas e abrigos. Para precisão clínica, fatores como
            saúde e raça influenciam.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="Idade do pet (anos)">{out ? out.totalAnos.toFixed(2) : "—"}</Card>
        <Card title="Equivalente humano">{out ? `${out.humana.toFixed(0)} anos` : "—"}</Card>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {children}
    </label>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 text-sm text-slate-600">{title}</div>
      <div className="text-2xl font-semibold text-slate-900">{children}</div>
    </div>
  );
}
