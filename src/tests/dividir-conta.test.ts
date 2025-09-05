import { describe, it, expect } from "vitest";
import { splitTotal } from "@/lib/dividir-conta";

describe("dividir-conta", () => {
  it("divide igualmente sem gorjeta/desconto", () => {
    const out = splitTotal(100, 4);
    const soma = out.reduce((a, s) => a + s.valor, 0);
    expect(out).toHaveLength(4);
    expect(out[0].valor).toBeCloseTo(25, 2);
    expect(soma).toBeCloseTo(100, 2);
  });

  it("aplica gorjeta e preserva soma", () => {
    const out = splitTotal(200, 3, 0.1); // 10%
    const soma = out.reduce((a, s) => a + s.valor, 0);
    expect(soma).toBeCloseTo(220, 2);
  });

  it("aplica desconto e preserva soma", () => {
    const out = splitTotal(150, 3, 0, 30); // -30 => 120
    const soma = out.reduce((a, s) => a + s.valor, 0);
    expect(soma).toBeCloseTo(120, 2);
  });
});
