import PetIdadeClient from "./PetIdadeClient";

export const metadata = {
  title: "Idade do pet (cão/gato) — SmartCalc",
  description: "Converta a idade do seu pet para anos humanos, considerando porte.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <PetIdadeClient />
    </main>
  );
}
