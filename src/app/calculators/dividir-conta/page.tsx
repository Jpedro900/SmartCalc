import DividirContaClient from "./DividirContaClient";

export const metadata = {
  title: "Dividir Conta / Gorjeta — SmartCalc",
  description:
    "Calcule o valor por pessoa com gorjeta opcional. Arredonde para cima/baixo e veja o detalhamento.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <DividirContaClient />
    </main>
  );
}
