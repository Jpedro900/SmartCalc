import PolinomiosClient from "./PolinomiosClient";

export const metadata = {
  title: "Polinômios — SmartCalc",
  description: "Calcule f(x), derivada e raízes reais de polinômios.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <PolinomiosClient />
    </main>
  );
}
