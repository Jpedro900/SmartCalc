// src/app/calculators/unidades/page.tsx
import UnidadesClient from "./UnidadesClient";

export const metadata = {
  title: "Conversor de Unidades — SmartCalc",
  description:
    "Converta aceleração, área, torque, carga elétrica, energia, força, comprimento, iluminância, massa, fluxos, densidade, potência, pressão, temperatura, tempo, velocidade, viscosidade e volume.",
};

export default function Page() {
  return <UnidadesClient />;
}
