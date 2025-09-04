"use client";

import { useMemo, useState } from "react";
import { Fuel, Info, Gauge, Car, Wallet, TrendingDown } from "lucide-react";

/* ================= helpers ================= */

function numBR(s: string): number {
  if (typeof s !== "string") return NaN;
  const cleaned = s.replace(/\s/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    return Number(cleaned.replace(",", "."));
  }
  return Number(cleaned);
}
function fmtMoneyBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtBR(n: number, max = 2): string {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: max });
}

type DecisionMethod = "ratio70" | "costPerKm";
type Result = {
  method: DecisionMethod;
  recommend: "etanol" | "gasolina";
  ratio: number; // etanol/gasolina (preço)
  costKmE?: number; // R$/km
  costKmG?: number; // R$/km
  savePerKm?: number; // R$/km
  savePerTank?: number; // R$/tanque
  savePerMonth?: number; // R$/mês
};

export default function CombustivelClient() {
  // preços
  const [pGasStr, setPGasStr] = useState("5,99");
  const [pEtaStr, setPEtaStr] = useState("4,19");

  // consumo (km/L) - opcionais
  const [kmLGasStr, setKmLGasStr] = useState("");
  const [kmLEtaStr, setKmLEtaStr] = useState("");

  // parâmetros de economia
  const [tankStr, setTankStr] = useState("50"); // L
  const [kmMonthStr, setKmMonthStr] = useState("1000"); // km/mês

  const parsed = useMemo(() => {
    const pG = numBR(pGasStr);
    const pE = numBR(pEtaStr);
    const kmG = numBR(kmLGasStr);
    const kmE = numBR(kmLEtaStr);
    const tank = numBR(tankStr);
    const kmMonth = numBR(kmMonthStr);

    return { pG, pE, kmG, kmE, tank, kmMonth };
  }, [pGasStr, pEtaStr, kmLGasStr, kmLEtaStr, tankStr, kmMonthStr]);

  const result = useMemo<Result | null>(() => {
    const { pG, pE, kmG, kmE, tank, kmMonth } = parsed;
    if (!(isFinite(pG) && pG > 0 && isFinite(pE) && pE > 0)) return null;

    const ratio = pE / pG; // preço relativo do etanol
    // Se consumos válidos, decidir por custo por km
    if (isFinite(kmG) && kmG > 0 && isFinite(kmE) && kmE > 0) {
      const costKmG = pG / kmG;
      const costKmE = pE / kmE;
      const recommend = costKmE <= costKmG ? "etanol" : "gasolina";

      // economia por km
      const savePerKm = Math.abs(costKmG - costKmE);
      // por tanque (aprox: tanque cheio → litros * custo por L, convertido pra km)
      // melhor é converter por km → supondo que um tanque gera kmTank = tank*kmL do combustível recomendado
      const kmPorTanque = recommend === "etanol" ? tank * kmE : tank * kmG;
      const custoTanqueRecomendado =
        recommend === "etanol" ? kmPorTanque * costKmE : kmPorTanque * costKmG;
      const custoTanqueAlternativo =
        recommend === "etanol" ? kmPorTanque * costKmG : kmPorTanque * costKmE;
      const savePerTank = Math.max(0, custoTanqueAlternativo - custoTanqueRecomendado);

      const savePerMonth = isFinite(kmMonth) && kmMonth > 0 ? kmMonth * savePerKm : undefined;

      return {
        method: "costPerKm",
        recommend,
        ratio,
        costKmE,
        costKmG,
        savePerKm,
        savePerTank,
        savePerMonth,
      };
    }

    // Sem consumo: usar regra dos 70%
    const recommend = ratio <= 0.7 ? "etanol" : "gasolina";
    return { method: "ratio70", recommend, ratio };
  }, [parsed]);

  const recomendacao = useMemo(() => {
    if (!result) return null;
    const isE = result.recommend === "etanol";
    const title = isE ? "Abasteça com Etanol" : "Abasteça com Gasolina";
    const tone = isE
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : "text-indigo-700 bg-indigo-50 border-indigo-200";
    return { isE, title, tone };
  }, [result]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Fuel className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Etanol × Gasolina</h1>
          <p className="text-slate-500">
            Compare preços e consumo para escolher o combustível mais econômico.
          </p>
        </div>
      </div>

      {/* inputs */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Preço da Gasolina (R$/L)" icon={<Wallet className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              placeholder="Ex.: 5,99"
              value={pGasStr}
              onChange={(e) => setPGasStr(e.target.value)}
            />
          </Field>

          <Field label="Preço do Etanol (R$/L)" icon={<Wallet className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              placeholder="Ex.: 4,19"
              value={pEtaStr}
              onChange={(e) => setPEtaStr(e.target.value)}
            />
          </Field>

          <div className="md:col-span-2 lg:col-span-3">
            <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Gauge className="h-4 w-4" /> Consumo (opcional)
            </div>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Consumo na Gasolina (km/L)</span>
                <input
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  placeholder="Ex.: 12"
                  value={kmLGasStr}
                  onChange={(e) => setKmLGasStr(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Consumo no Etanol (km/L)</span>
                <input
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
                  placeholder="Ex.: 8"
                  value={kmLEtaStr}
                  onChange={(e) => setKmLEtaStr(e.target.value)}
                />
              </label>
            </div>
          </div>

          <Field label="Tamanho do tanque (L)" icon={<Car className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              placeholder="Ex.: 50"
              value={tankStr}
              onChange={(e) => setTankStr(e.target.value)}
            />
          </Field>

          <Field label="Quilometragem por mês (km)" icon={<Car className="h-4 w-4" />}>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring"
              placeholder="Ex.: 1000"
              value={kmMonthStr}
              onChange={(e) => setKmMonthStr(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Sem os consumos, utilizamos a <strong>regra dos 70%</strong>: etanol compensa quando
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
              preço do etanol / preço da gasolina ≤ 0,70
            </code>
            . Com os consumos informados, a decisão considera o <strong>custo por km</strong>.
          </p>
        </div>
      </section>

      {/* resultado */}
      <section className="grid gap-4 md:grid-cols-3">
        <div
          className={`rounded-xl border p-4 shadow-sm md:col-span-3 ${
            recomendacao ? recomendacao.tone : "border-slate-200 bg-white"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="text-sm text-slate-600">Recomendação</div>
          <div className="mt-1 text-2xl font-semibold">{result ? recomendacao!.title : "—"}</div>
          <div className="mt-1 text-sm">
            {result ? (
              result.method === "ratio70" ? (
                <>
                  Relação de preços (Etanol/Gasolina):{" "}
                  <strong>{fmtBR(result.ratio * 100, 1)}%</strong>
                </>
              ) : (
                <>
                  Custo por km — Etanol: <strong>{fmtMoneyBRL(result.costKmE!)}</strong> • Gasolina:{" "}
                  <strong>{fmtMoneyBRL(result.costKmG!)}</strong>
                </>
              )
            ) : (
              "Informe os preços para calcular."
            )}
          </div>
        </div>

        <Card
          title="Economia por tanque"
          value={result && result.savePerTank != null ? fmtMoneyBRL(result.savePerTank) : "—"}
          icon={<TrendingDown className="h-5 w-5 text-indigo-600" aria-hidden />}
        />
        <Card
          title="Economia por mês"
          value={result && result.savePerMonth != null ? fmtMoneyBRL(result.savePerMonth) : "—"}
          icon={<Wallet className="h-5 w-5 text-indigo-600" aria-hidden />}
        />
        <Card
          title="Preço relativo (E/G)"
          value={result ? `${fmtBR(result.ratio * 100, 1)}%` : "—"}
          icon={<Fuel className="h-5 w-5 text-indigo-600" aria-hidden />}
        />
      </section>
    </div>
  );
}

/* ================ small UI pieces ================ */

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </label>
  );
}

function Card({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-slate-600">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
