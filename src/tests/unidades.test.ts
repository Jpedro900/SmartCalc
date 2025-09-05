import { describe, it, expect } from "vitest";
import { convert } from "@/lib/unidades";

const table = {
  length: { m: 1, cm: 0.01, km: 1000 },
  mass: { kg: 1, g: 0.001 },
};

describe("unidades (genérico)", () => {
  it("length: km -> m e cm -> m", () => {
    expect(convert(1, "km", "m", table)).toBeCloseTo(1000, 6);
    expect(convert(150, "cm", "m", table)).toBeCloseTo(1.5, 6);
  });
  it("mass: g -> kg", () => {
    expect(convert(2500, "g", "kg", table)).toBeCloseTo(2.5, 6);
  });
  it("falha para unidades incompatíveis", () => {
    expect(() => convert(1, "kg", "m", table)).toThrow();
  });
});
