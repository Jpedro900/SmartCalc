import TdeeClient from "./GastoCaloricoClient";

export const metadata = {
  title: "TDEE — Gasto Calórico Diário — SmartCalc",
  description:
    "Calcule seu gasto calórico diário com base na TMB (Mifflin-St Jeor) e no nível de atividade.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <TdeeClient />
    </main>
  );
}
