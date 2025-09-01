export const metadata = {
  title: "IMC — SmartCalc",
  description: "Calcule seu IMC, veja a faixa e o peso ideal estimado.",
};

import IMCClient from "./IMCClient";

export default function Page() {
  return <IMCClient />;
}
