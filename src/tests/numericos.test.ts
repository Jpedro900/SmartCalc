import { describe, it, expect } from "vitest";
import { toBin, toHex, fromBase } from "@/lib/numericos";

describe("numericos", () => {
  it("toBin / toHex", () => {
    expect(toBin(10)).toBe("1010");
    expect(toHex(255)).toBe("FF");
  });
  it("fromBase geral", () => {
    expect(fromBase("1010", 2)).toBe(10);
    expect(fromBase("FF", 16)).toBe(255);
    expect(fromBase("z", 36)).toBe(35);
  });
  it("valida entradas", () => {
    expect(() => toBin(-1)).toThrow();
    expect(() => toHex(1.2)).toThrow();
    expect(() => fromBase("2", 2)).toThrow();
    expect(() => fromBase("10", 1)).toThrow();
  });
});
