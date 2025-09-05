export function calcAge(birth: Date, today: Date = new Date()) {
  let anos = today.getFullYear() - birth.getFullYear();
  let meses = today.getMonth() - birth.getMonth();
  let dias = today.getDate() - birth.getDate();

  if (dias < 0) {
    // pega dias do mês anterior
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    dias += prevMonth.getDate();
    meses -= 1;
  }
  if (meses < 0) {
    meses += 12;
    anos -= 1;
  }
  return { anos, meses, dias };
}

const ZODIAC = [
  { name: "Aquário", start: [1, 20], end: [2, 18] },
  { name: "Peixes", start: [2, 19], end: [3, 20] },
  { name: "Áries", start: [3, 21], end: [4, 19] },
  { name: "Touro", start: [4, 20], end: [5, 20] },
  { name: "Gêmeos", start: [5, 21], end: [6, 20] },
  { name: "Câncer", start: [6, 21], end: [7, 22] },
  { name: "Leão", start: [7, 23], end: [8, 22] },
  { name: "Virgem", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Escorpião", start: [10, 23], end: [11, 21] },
  { name: "Sagitário", start: [11, 22], end: [12, 21] },
  { name: "Capricórnio", start: [12, 22], end: [1, 19] },
];

export function zodiac(d: Date): string {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  for (const z of ZODIAC) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm <= em) {
      // dentro do mesmo ano
      if ((m > sm || (m === sm && day >= sd)) && (m < em || (m === em && day <= ed))) {
        return z.name;
      }
    } else {
      // intervalo cruza o ano (Capricórnio)
      if (m > sm || (m === sm && day >= sd) || m < em || (m === em && day <= ed)) {
        return z.name;
      }
    }
  }
  return "Desconhecido";
}

const CHINESE = [
  "Rato",
  "Boi",
  "Tigre",
  "Coelho",
  "Dragão",
  "Serpente",
  "Cavalo",
  "Cabra",
  "Macaco",
  "Galo",
  "Cão",
  "Porco",
];

export function chineseZodiac(year: number): string {
  // 2008 foi ano do Rato, ajusta o offset conforme preferência
  const idx = (year - 2008) % 12;
  const norm = (idx + 12) % 12;
  return CHINESE[norm];
}
