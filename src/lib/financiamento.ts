export type Parcela = {
  mes: number;
  parcela: number;
  juros: number;
  amortizacao: number;
  saldo: number;
};

export function priceSchedule(
  principal: number,
  i: number, // taxa ao mês (ex.: 0.015)
  n: number
): Parcela[] {
  if (n <= 0) throw new Error("n deve ser > 0");
  if (i < 0) throw new Error("taxa não pode ser negativa");

  const parcelaFixa = i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n));
  let saldo = principal;
  const out: Parcela[] = [];

  for (let mes = 1; mes <= n; mes++) {
    const juros = saldo * i;
    const amortizacao = parcelaFixa - juros;
    saldo = saldo - amortizacao;
    out.push({
      mes,
      parcela: parcelaFixa,
      juros,
      amortizacao,
      saldo: Math.max(0, saldo),
    });
  }
  return out;
}

export function sacSchedule(
  principal: number,
  i: number, // taxa ao mês
  n: number
): Parcela[] {
  if (n <= 0) throw new Error("n deve ser > 0");
  if (i < 0) throw new Error("taxa não pode ser negativa");

  const amortizacaoConst = principal / n;
  let saldo = principal;
  const out: Parcela[] = [];

  for (let mes = 1; mes <= n; mes++) {
    const juros = saldo * i;
    const parcela = amortizacaoConst + juros;
    saldo = saldo - amortizacaoConst;
    out.push({
      mes,
      parcela,
      juros,
      amortizacao: amortizacaoConst,
      saldo: Math.max(0, saldo),
    });
  }
  return out;
}
