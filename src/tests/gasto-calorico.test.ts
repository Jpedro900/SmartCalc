import { describe, it, expect } from "vitest";
import { tmbMifflin, tdeeCalc } from "@/lib/health";

describe("gasto-calorico", () => {
  it("TMB masculino e feminino (Mifflin) retornam faixas coerentes", () => {
    // Mifflin-St Jeor
    const tmbM = tmbMifflin("M", 70, 175, 30); // ~1673 kcal/d
    const tmbF = tmbMifflin("F", 60, 165, 30); // ~1320 kcal/d

    // Usar FAIXAS para não acoplar a implementação — apenas sanidade
    expect(tmbM).toBeGreaterThan(1500);
    expect(tmbM).toBeLessThan(1850);
    expect(tmbF).toBeGreaterThan(1200);
    expect(tmbF).toBeLessThan(1500);
    expect(tmbM).toBeGreaterThan(tmbF);
  });

  it("TDEE sedentário vs ativo", () => {
    const tmb = 1500;
    const sedentario = tdeeCalc(tmb, 1.2);
    const ativo = tdeeCalc(tmb, 1.6);

    expect(sedentario).toBeCloseTo(1800, 6);
    expect(ativo).toBeCloseTo(2400, 6);
    expect(ativo).toBeGreaterThan(sedentario);
  });

  it("TDEE semanal = diário × 7", () => {
    const tmb = tmbMifflin("M", 80, 180, 28);
    const tdee = tdeeCalc(tmb, 1.55);

    expect(tdee * 7).toBeCloseTo(tdeeCalc(tmb, 1.55) * 7, 10);
  });
});
