export function bmi(kg: number, alturaCm: number): number {
  const m = alturaCm / 100;
  if (m <= 0) throw new Error("altura inválida");
  if (kg <= 0) throw new Error("peso inválido");
  return kg / (m * m);
}

export type BMIClass =
  | "Magreza"
  | "Normal"
  | "Sobrepeso"
  | "Obesidade I"
  | "Obesidade II"
  | "Obesidade III";

export function bmiClass(b: number): BMIClass {
  if (b < 18.5) return "Magreza";
  if (b < 25) return "Normal";
  if (b < 30) return "Sobrepeso";
  if (b < 35) return "Obesidade I";
  if (b < 40) return "Obesidade II";
  return "Obesidade III";
}
