import { describe, it, expect } from "vitest";
import { easterDate, feriadosBR, addDays } from "@/lib/feriados";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

describe("feriados BR", () => {
  it("easterDate known dates", () => {
    // datas conhecidas (fonte pública, p.ex. 2024-03-31)
    expect(ymd(easterDate(2024))).toBe("2024-03-31");
    expect(ymd(easterDate(2025))).toBe("2025-04-20");
    expect(ymd(easterDate(2026))).toBe("2026-04-05");
  });

  it("carnaval 47 dias antes da Páscoa", () => {
    const y = 2025;
    const pascoa = easterDate(y);
    const carnaval = addDays(pascoa, -47);
    // carnaval 2025: 04/03/2025 (terça)
    expect(ymd(carnaval)).toBe("2025-03-04");
  });

  it("lista ordenada e inclui Natal", () => {
    const list = feriadosBR(2024);
    expect(list[0].date.getFullYear()).toBe(2024);
    const dates = list.map((f) => f.date.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
    const natal = list.find((f) => f.name.includes("Natal"));
    expect(natal).toBeTruthy();
    expect(ymd(natal!.date)).toBe("2024-12-25");
  });
});
