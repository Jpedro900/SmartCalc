import { describe, it, expect } from "vitest";
import { ruleOfThree } from "@/lib/regra3";

describe("regra-de-3", () => {
  it("calcula proporcionalidade direta", () => {
    // 2/4 = 3/x  => x = (4 * 3) / 2 = 6
    expect(ruleOfThree(2, 4, 3)).toBeCloseTo(6, 6);
  });

  it("retorna 0 quando b = 0 (proporção direta)", () => {
    // a/b = c/x  -> com b=0 => x = (0 * c)/a = 0
    expect(ruleOfThree(2, 0, 3)).toBe(0);
  });

  it("lança erro se a = 0 (divisão por zero)", () => {
    expect(() => ruleOfThree(0, 4, 3)).toThrow();
  });
});
