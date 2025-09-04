import NumericosClient from "./NumericosClient";

export const metadata = {
  title: "Sistemas numéricos — SmartCalc",
  description:
    "Converta entre decimal, binário, hexadecimal e octal. Validação de entrada e sincronização imediata.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <NumericosClient />
    </main>
  );
}
