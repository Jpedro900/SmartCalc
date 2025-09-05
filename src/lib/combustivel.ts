export type FuelChoice = "etanol" | "gasolina";

/**
 * Regra clássica brasileira: se (etanol/gasolina) <= 0.70, compensa etanol.
 */
export function bestFuel(precoEtanol: number, precoGasolina: number): FuelChoice {
  if (precoEtanol <= 0 || precoGasolina <= 0) {
    throw new Error("preços devem ser positivos");
  }
  const ratio = precoEtanol / precoGasolina;
  return ratio <= 0.7 ? "etanol" : "gasolina";
}
