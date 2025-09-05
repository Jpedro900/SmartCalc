import { describe, it, expect } from "vitest";
import { compoundFV, simpleFV } from "@/lib/juros";

describe("juros — compostos e simples", () => {
  it("compoundFV calcula montante corretamente", () => {
    // 1000 a 2% por 12 meses => 1000 * 1.02^12 ≈ 1268.24
    const fv = compoundFV(1000, 0.02, 12);
    expect(fv).toBeCloseTo(1268.24, 2);
  });

  it("simpleFV calcula montante linearmente", () => {
    // 1000 a 2% por 12 meses => 1000 * (1 + 0.24) = 1240
    const fv = simpleFV(1000, 0.02, 12);
    expect(fv).toBeCloseTo(1240, 6);
  });

  it("lança erro para meses negativos", () => {
    expect(() => compoundFV(1000, 0.02, -1)).toThrow();
    expect(() => simpleFV(1000, 0.02, -1)).toThrow();
  });
});
