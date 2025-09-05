/**
 * Conversões de idade de pets para equivalente humano.
 * Baseado em guias veterinários comuns (estimativas).
 */

export type PetType = "cao" | "gato";
export type PorteCao = "pequeno" | "medio" | "grande";

/**
 * Converte idade de pet em MESES para idade equivalente em humanos.
 */
export function petHumanAge(tipo: PetType, meses: number, porte?: PorteCao): number {
  const anos = meses / 12;

  if (tipo === "gato") {
    if (anos < 1) {
      return anos * 15; // filhote até 1 ano
    } else if (anos < 2) {
      return 15 + (anos - 1) * 9;
    } else {
      return 24 + (anos - 2) * 4;
    }
  }

  if (tipo === "cao") {
    if (!porte) throw new Error("Porte deve ser informado para cães");
    if (anos < 1) return anos * 15;

    switch (porte) {
      case "pequeno":
        return 15 + (anos - 1) * 4;
      case "medio":
        return 15 + (anos - 1) * 5;
      case "grande":
        return 15 + (anos - 1) * 6;
    }
  }

  throw new Error("Tipo de pet inválido");
}
