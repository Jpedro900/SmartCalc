import FinanciamentoClient from "./FinanciamentoClient";

export const metadata = {
  title: "Financiamento — SmartCalc",
  description:
    "Calcule financiamento com sistemas Price e SAC: parcela, juros totais, total pago, tabela de amortização e gráfico de saldo.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <FinanciamentoClient />
    </main>
  );
}
