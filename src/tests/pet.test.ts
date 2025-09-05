import { describe, it, expect } from "vitest";
import { petHumanAge } from "@/lib/pet";

describe("pet-idade", () => {
  it("gato: primeiros anos acelerados", () => {
    const m6 = petHumanAge("gato", 6); // ~7.5 humano
    const y1 = petHumanAge("gato", 12); // ~15
    const y2 = petHumanAge("gato", 24); // ~24
    const y5 = petHumanAge("gato", 60); // ~36

    expect(m6).toBeGreaterThan(5);
    expect(y1).toBeCloseTo(15, 0);
    expect(y2).toBeCloseTo(24, 0);
    expect(y5).toBeGreaterThan(30);
  });

  it("cão pequeno vs grande: pequeno envelhece mais devagar", () => {
    const pequeno = petHumanAge("cao", 60, "pequeno"); // 5 anos
    const grande = petHumanAge("cao", 60, "grande");

    expect(pequeno).toBeLessThan(grande);
    expect(pequeno).toBeGreaterThan(25);
    expect(grande).toBeGreaterThan(pequeno);
  });

  it("lança erro se porte não for informado para cães", () => {
    expect(() => petHumanAge("cao", 24)).toThrow();
  });
});
