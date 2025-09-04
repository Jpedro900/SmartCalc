import FeriadosClient from "./FeriadosClient";

export const metadata = {
  title: "Feriados no Brasil — SmartCalc",
  description:
    "Calendário de feriados nacionais no Brasil com contagem regressiva para os próximos e destaque para os mais populares.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <FeriadosClient />
    </main>
  );
}
