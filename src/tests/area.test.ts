import { describe, it, expect } from "vitest";
import { polygonArea } from "@/lib/area";

describe("polygonArea (shoelace)", () => {
  it("triângulo 3-4-5 (base 3, altura 4) => área 6", () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 4 },
    ];
    expect(polygonArea(pts)).toBeCloseTo(6, 6);
  });
  it("quadrado 2x2 => 4", () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    expect(polygonArea(pts)).toBeCloseTo(4, 6);
  });
  it("ordem inversa mantém área", () => {
    const A = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 0, y: 1 },
    ];
    const B = [...A].reverse();
    expect(polygonArea(A)).toBeCloseTo(polygonArea(B), 12);
  });
});
