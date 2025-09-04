import CombustivelClient from "./CombustivelClient";

export const metadata = {
  title: "Etanol × Gasolina — SmartCalc",
  description:
    "Compare preços e consumo (km/L) para decidir entre etanol e gasolina. Veja economia por tanque e por mês.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <CombustivelClient />
    </main>
  );
}
