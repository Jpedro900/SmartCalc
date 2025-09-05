import { describe, it, expect } from "vitest";
import { priceSchedule, sacSchedule } from "@/lib/financiamento";

describe("financiamento — Price e SAC", () => {
  it("Price: quantidade de parcelas e saldo final ~ 0", () => {
    const sched = priceSchedule(100000, 0.01, 24); // 1% a.m., 24 meses
    expect(sched.length).toBe(24);
    const last = sched.at(-1)!;
    expect(last.saldo).toBeLessThan(1e-6); // residual numérico
    // parcela aproximadamente constante
    const p1 = sched[0].parcela;
    const p12 = sched[11].parcela;
    const p24 = sched[23].parcela;
    expect(p1).toBeCloseTo(p12, 6);
    expect(p12).toBeCloseTo(p24, 6);
  });

  it("SAC: soma das amortizações = principal, parcelas decrescentes", () => {
    const P = 90000;
    const n = 36;
    const i = 0.012; // 1.2% a.m.
    const sched = sacSchedule(P, i, n);
    expect(sched.length).toBe(n);

    const somaAmort = sched.reduce((acc, p) => acc + p.amortizacao, 0);
    expect(somaAmort).toBeCloseTo(P, 6);

    const p1 = sched[0].parcela;
    const p2 = sched[1].parcela;
    const pn = sched.at(-1)!.parcela;
    expect(p1).toBeGreaterThan(p2);
    expect(p2).toBeGreaterThan(pn);
  });
});
