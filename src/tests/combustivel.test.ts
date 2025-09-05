import { describe, it, expect } from "vitest";
import { bestFuel } from "@/lib/combustivel";

describe("combustivel — etanol x gasolina", () => {
  it("escolhe etanol quando razão <= 0.70", () => {
    expect(bestFuel(3.5, 5.0)).toBe("etanol"); // 0.70
    expect(bestFuel(3.4, 5.0)).toBe("etanol"); // 0.68
  });

  it("escolhe gasolina quando razão > 0.70", () => {
    expect(bestFuel(3.6, 5.0)).toBe("gasolina"); // 0.72
  });

  it("valida preços positivos", () => {
    expect(() => bestFuel(0, 5)).toThrow();
    expect(() => bestFuel(3, 0)).toThrow();
  });
});
