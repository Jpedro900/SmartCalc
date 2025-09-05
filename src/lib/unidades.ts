export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  table: Record<string, Record<string, number>>
): number {
  for (const dim of Object.keys(table)) {
    const dimTable = table[dim];
    const fFrom = dimTable[fromUnit];
    const fTo = dimTable[toUnit];
    if (fFrom != null && fTo != null) {
      const baseValue = value * fFrom;
      return baseValue / fTo;
    }
  }
  throw new Error(`Unidades incompatíveis ou ausentes: ${fromUnit} -> ${toUnit}`);
}
