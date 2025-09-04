export const metadata = {
  title: "Juros Compostos — SmartCalc",
  description:
    "Simulador de juros compostos com aportes/retiradas mensais, gráfico e tabela mês a mês.",
};

import JurosClient from "./JurosClient";

export default function Page() {
  return <JurosClient />;
}
