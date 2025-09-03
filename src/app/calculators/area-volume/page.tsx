import type { Metadata } from "next";
import AreaVolumeClient from "./AreaVolumeClient";

export const metadata: Metadata = {
  title: "Área e Volume — SmartCalc",
  description: "Calcule área e volume de várias figuras ou desenhe polígonos para medir.",
};

export default function Page() {
  return <AreaVolumeClient />;
}
