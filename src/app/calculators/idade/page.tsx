import IdadeClient from "./IdadeClient";

export const metadata = {
  title: "Idade — SmartCalc",
  description:
    "Calcule a sua idade exata em anos, meses e dias, e descubra curiosidades como próximos aniversários, semanas vividas, signos e idade em outros planetas.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <IdadeClient />
    </main>
  );
}
