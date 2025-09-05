import { describe, it, expect } from "vitest";
import { bmi, bmiClass } from "@/lib/imc";

describe("IMC", () => {
  it("calcula IMC corretamente", () => {
    // 70 kg, 175 cm => 22.86
    const b = bmi(70, 175);
    expect(b).toBeCloseTo(22.86, 2);
  });

  it("classifica faixas corretamente", () => {
    expect(bmiClass(17)).toBe("Magreza");
    expect(bmiClass(22)).toBe("Normal");
    expect(bmiClass(27)).toBe("Sobrepeso");
    expect(bmiClass(33)).toBe("Obesidade I");
    expect(bmiClass(37)).toBe("Obesidade II");
    expect(bmiClass(45)).toBe("Obesidade III");
  });

  it("valida entradas", () => {
    expect(() => bmi(0, 170)).toThrow();
    expect(() => bmi(70, 0)).toThrow();
  });
});
