import { describe, it, expect } from "vitest";
import { parseCoefs, polyEval, polyDeriv, realRoots } from "@/lib/polynomial";

describe("polynomial utils", () => {
  it("parseCoefs", () => {
    expect(parseCoefs("2, -3, 1")).toEqual([2, -3, 1]);
    expect(parseCoefs(" 0, 0, 1, -2 ")).toEqual([1, -2]); // remove zeros à esquerda
    expect(parseCoefs("a,b")).toBeNull();
  });

  it("polyEval / polyDeriv", () => {
    const coefs = [2, -3, 1]; // 2x^2 - 3x + 1
    expect(polyEval(coefs, 2)).toBeCloseTo(2 * 4 - 6 + 1, 10);
    expect(polyDeriv(coefs)).toEqual([4, -3]); // 4x - 3
  });

  it("realRoots quadrático", () => {
    // x^2 - 5x + 6 = 0 → 2, 3
    expect(realRoots([1, -5, 6])).toEqual([2, 3]);
  });

  it("realRoots cúbico", () => {
    // (x-3)(x-1)(x+2) = x^3 - 2x^2 - 5x + 6 → 3,1,-2
    const r = realRoots([1, -2, -5, 6]);
    expect(r[0]).toBeCloseTo(-2, 10);
    expect(r[1]).toBeCloseTo(1, 10);
    expect(r[2]).toBeCloseTo(3, 10);
  });

  it("realRoots quartico (bisseção)", () => {
    // (x-1)(x+2)(x-3)(x+4) = x^4 + 2x^3 − 13x^2 − 14x + 24
    const coefs = [1, 2, -13, -14, 24];
    const roots = realRoots(coefs);
    expect(roots.length).toBe(4);
    expect(roots[0]).toBeCloseTo(-4, 5);
    expect(roots[1]).toBeCloseTo(-2, 5);
    expect(roots[2]).toBeCloseTo(1, 5);
    expect(roots[3]).toBeCloseTo(3, 5);
  });
});
