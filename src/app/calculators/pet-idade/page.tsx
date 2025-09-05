import PetIdadeClient from "./PetIdadeClient";

export const metadata = {
  title: "Idade do Pet — Cão e Gato",
  description:
    "Descubra a idade humana do seu pet com base na espécie e no porte, além de fase da vida, curiosidades e dicas rápidas.",
};

export default function Page() {
  return <PetIdadeClient />;
}
