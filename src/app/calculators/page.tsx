import { CardLink } from "@/components/CardLink";
import { TOOLS } from "@/config/tools";

export const metadata = {
  title: "Todas as calculadoras — SmartCalc",
  description: "Lista completa de ferramentas do SmartCalc.",
};

export default function AllCalculatorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Todas as calculadoras</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => <CardLink key={t.href} {...t} />)}
      </div>
    </main>
  );
}
