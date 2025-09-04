import { ReactNode } from "react";

export type Tool = { href: string; title: string; desc: string; category: string; badge?: string; icon?: ReactNode };

const IconHeart = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7-4.35-9.33-8.24C.45 9.14 2.32 6 5.5 6A5.5 5.5 0 0 1 12 9.5 5.5 5.5 0 0 1 18.5 6c3.18 0 5.05 3.14 2.83 6.76C19 16.65 12 21 12 21Z"/>
  </svg>
);
const IconMath = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M5 11h14v2H5v-2Zm0-6h14v2H5V5Zm0 12h14v2H5v-2Z"/>
  </svg>
);
const IconMoney = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M3 6h18v12H3V6Zm2 2v8h14V8H5Zm4 2h6v2H9v-2Zm0 3h6v2H9v-2Z"/>
  </svg>
);
const IconTools = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M21 2l-1.5 1.5a3 3 0 0 0-4.243 0l-.707.707 4.243 4.243.707-.707a3 3 0 0 0 0-4.243L21 2ZM2 22l7.071-1.414-8.657-8.657L.343 20.586 2 22Zm9.9-14.485L3.515 15.9l4.243 4.243L16.142 11.76 11.9 7.515Z"/>
  </svg>
);

export const TOOLS: Tool[] = [
  { href: "/calculators/imc",        title: "IMC",               desc: "Índice de Massa Corporal.",               category: "Saúde",      icon: IconHeart },
  { href: "/calculators/percentage", title: "Porcentagem",       desc: "Desconto, aumento e variação.",           category: "Matemática",  icon: IconMath },
  { href: "/calculators/juros",      title: "Juros Compostos",   desc: "Montante, taxa e aporte.",                category: "Financeiro",  icon: IconMoney, badge: "Novo" },
  { href: "/calculators/regra-de-3", title: "Regra de 3",        desc: "Proporção direta e inversa.",             category: "Matemática",  icon: IconMath,  badge: "Novo" },
  { href: "/calculators/moedas",     title: "Conversor de Moedas",desc: "Valor × cotação (manual).",              category: "Financeiro",  icon: IconMoney },
  { href: "/calculators/financiamento", title: "Financiamento",   desc: "Tabela Price e SAC.",                      category: "Financeiro",  icon: IconMoney },
  { href: "/calculators/combustivel", title: "Etanol × Gasolina",desc: "Compare preços e consumo para economizar.", category: "Financeiro", icon: IconMoney, badge: "Novo" },
  { href: "/calculators/unidades",   title: "Conversor de Unidades",desc: "Tempo, peso e distância.",             category: "Utilidades",  icon: IconTools },
  { href: "/calculators/area-volume",title: "Área & Volume",     desc: "Figuras básicas e sólidos.",              category: "Utilidades",  icon: IconTools },
  { href: "/calculators/idade",      title: "Idade",             desc: "Anos, meses e dias.",                     category: "Utilidades",  icon: IconTools },
];

export const CATEGORIES = ["Todas", ...Array.from(new Set(TOOLS.map(t => t.category)))];
