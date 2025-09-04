// src/lib/feriados.ts
export function easterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Março, 4=Abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}
export function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
export function daysDiff(from: Date, to: Date) {
  const A = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const B = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((B.getTime() - A.getTime()) / (1000 * 60 * 60 * 24));
}

export type Fer = { date: Date; name: string; popular?: boolean };

export function feriadosBR(year: number): Fer[] {
  const pascoa = easterDate(year);
  const carnaval = addDays(pascoa, -47);
  const sextaSanta = addDays(pascoa, -2);
  const corpus = addDays(pascoa, 60);

  const list: Fer[] = [
    { date: new Date(year, 0, 1), name: "Confraternização Universal", popular: true },
    { date: carnaval, name: "Carnaval (terça-feira)", popular: true },
    { date: sextaSanta, name: "Sexta-feira Santa", popular: true },
    { date: pascoa, name: "Páscoa", popular: true },
    { date: new Date(year, 3, 21), name: "Tiradentes" },
    { date: new Date(year, 4, 1), name: "Dia do Trabalhador", popular: true },
    { date: corpus, name: "Corpus Christi", popular: true },
    { date: new Date(year, 8, 7), name: "Independência do Brasil", popular: true },
    { date: new Date(year, 9, 12), name: "Nossa Senhora Aparecida", popular: true },
    { date: new Date(year, 10, 2), name: "Finados" },
    { date: new Date(year, 10, 15), name: "Proclamação da República", popular: true },
    { date: new Date(year, 11, 25), name: "Natal", popular: true },
  ];
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}
