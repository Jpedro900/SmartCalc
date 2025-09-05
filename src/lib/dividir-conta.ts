export type Share = {
  pessoa: number;
  valor: number;
};

/**
 * Divide o valor total entre `pessoas`, aplicando gorjeta (%) e desconto (R$).
 * Retorna as cotas com duas casas decimais.
 */
export function splitTotal(
  total: number,
  pessoas: number,
  gorjetaPct: number = 0,
  desconto: number = 0
): Share[] {
  if (pessoas <= 0) throw new Error("pessoas deve ser > 0");
  const base = Math.max(0, total - Math.max(0, desconto));
  const comGorjeta = base * (1 + Math.max(0, gorjetaPct));
  const cota = comGorjeta / pessoas;

  // Arredonda para centavos, preservando soma total (último recebe ajuste)
  const shares: Share[] = [];
  let acumulado = 0;
  for (let i = 0; i < pessoas; i++) {
    const valor = Math.round(cota * 100) / 100;
    acumulado += valor;
    shares.push({ pessoa: i + 1, valor });
  }
  // Ajuste de centavos devido a arredondamento
  const alvo = Math.round(comGorjeta * 100) / 100;
  const diff = Math.round((alvo - acumulado) * 100) / 100;
  if (Math.abs(diff) >= 0.01) {
    shares[shares.length - 1].valor =
      Math.round((shares[shares.length - 1].valor + diff) * 100) / 100;
  }
  return shares;
}
