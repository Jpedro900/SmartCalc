export const metadata = {
  title: "Conversor de Moedas — SmartCalc",
  description:
    "Conversor de moedas com cotações reais, modo comercial e turístico, atalho para moedas populares e inversão rápida.",
};

import MoedasClient from "./MoedasClient";

export default function Page() {
  return <MoedasClient />;
}
