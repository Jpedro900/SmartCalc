import { describe, it, expect } from "vitest";
import { increase, discount, percentageOf, pctChange } from "@/lib/percentage";

describe("percentage", () => {
  it("increase/discount", () => {
    expect(increase(100, 0.1)).toBeCloseTo(110, 6);
    expect(discount(100, 0.1)).toBeCloseTo(90, 6);
  });
  it("percentageOf retorna fração", () => {
    expect(percentageOf(2, 10)).toBeCloseTo(0.2, 6);
  });
  it("pctChange", () => {
    expect(pctChange(100, 120)).toBeCloseTo(0.2, 6);
    expect(pctChange(100, 80)).toBeCloseTo(-0.2, 6);
  });
  it("erros de divisão por zero", () => {
    expect(() => percentageOf(1, 0)).toThrow();
    expect(() => pctChange(0, 10)).toThrow();
  });
});
