import GestacaoClient from "./GestacaoClient";

export const metadata = {
  title: "Idade Gestacional & DPP — SmartCalc",
  description:
    "Calcule a idade gestacional em semanas e dias e a data provável do parto (DPP) a partir da DUM, com ajuste de ciclo.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <GestacaoClient />
    </main>
  );
}
