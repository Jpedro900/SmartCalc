import { describe, it, expect } from "vitest";
import { tmbMifflin, tdeeFromTmb, bodyFatUSNavy } from "@/lib/health";

describe("health formulas", () => {
  it("TMB (Mifflin) masculino e feminino", () => {
    // M: 80kg, 180cm, 30y
    const tmbM = tmbMifflin("M", 80, 180, 30);
    // F: 60kg, 165cm, 30y
    const tmbF = tmbMifflin("F", 60, 165, 30);
    expect(Math.round(tmbM)).toBe(1780); // aproximação
    expect(Math.round(tmbF)).toBe(1371); // aproximação
  });

  it("TDEE = TMB × fator", () => {
    const tdee = tdeeFromTmb(1700, 1.55);
    expect(Math.round(tdee)).toBe(2635);
  });

  it("% Gordura US Navy", () => {
    // M: altura 175, pescoço 38, cintura 85
    const bfM = bodyFatUSNavy("M", 175, 38, 85);
    expect(bfM).toBeGreaterThan(5);
    expect(bfM).toBeLessThan(30);

    // F: altura 165, pescoço 32, cintura 75, quadril 95
    const bfF = bodyFatUSNavy("F", 165, 32, 75, 95);
    expect(bfF).toBeGreaterThan(15);
    expect(bfF).toBeLessThan(40);
  });
});
