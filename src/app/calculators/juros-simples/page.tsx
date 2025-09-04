import JurosSimplesClient from "./JurosSimplesClient";

export const metadata = {
  title: "Juros Simples — SmartCalc",
  description:
    "Calcule juros simples: montante, juros totais e gráfico da evolução no tempo.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JurosSimplesClient />
    </main>
  );
}
