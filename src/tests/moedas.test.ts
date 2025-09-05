import { describe, it, expect } from "vitest";
import { parseNum, format2, formatRate, convert, applyTourismRate } from "@/lib/moedas";

describe("moedas — helpers puros (sem rede)", () => {
  it("parseNum aceita vírgula decimal pt-BR", () => {
    expect(parseNum("1.234,56")).toBeCloseTo(1234.56, 2);
    expect(parseNum("  12,5 ")).toBeCloseTo(12.5, 1);
  });

  it("format2 formata com 2 casas", () => {
    expect(format2(1234.5)).toBe("1.234,50");
  });

  it("formatRate usa casas dinâmicas", () => {
    expect(formatRate(3.5)).toBe("3,50");
    expect(formatRate(0.1234)).toBe("0,1234");
    expect(formatRate(0.00012345)).toBe("0,00012345");
  });

  it("convert e applyTourismRate", () => {
    expect(convert(10, 5)).toBeCloseTo(50, 6);
    expect(applyTourismRate(5, 0.04)).toBeCloseTo(5.2, 6);
  });
});
