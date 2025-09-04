import GorduraClient from "./GorduraClient";

export const metadata = {
  title: "% Gordura corporal (US Navy) — SmartCalc",
  description: "Estime o percentual de gordura corporal por circunferências (método US Navy).",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <GorduraClient />
    </main>
  );
}
