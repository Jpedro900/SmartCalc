import { describe, it, expect } from "vitest";
import { calcAge, zodiac, chineseZodiac } from "@/lib/idade";

describe("idade", () => {
  it("calcAge: diferenças de ano/mês/dia coerentes", () => {
    const birth = new Date(2000, 4, 15); // 15/05/2000
    const today = new Date(2025, 8, 5); // 05/09/2025
    const a = calcAge(birth, today);
    expect(a.anos).toBe(25);
    expect(a.meses).toBe(3);
    expect(a.dias).toBe(21);
  });

  it("zodiac: datas limítrofes", () => {
    expect(zodiac(new Date(2025, 2, 21))).toBe("Áries"); // 21/03
    expect(zodiac(new Date(2025, 11, 22))).toBe("Capricórnio"); // 22/12
    expect(zodiac(new Date(2025, 0, 19))).toBe("Capricórnio"); // 19/01
    expect(zodiac(new Date(2025, 0, 20))).toBe("Aquário"); // 20/01
  });

  it("chineseZodiac: ciclo de 12 anos", () => {
    expect(chineseZodiac(2008)).toBe("Rato");
    expect(chineseZodiac(2009)).toBe("Boi");
    expect(chineseZodiac(2020)).toBe("Rato");
  });
});
