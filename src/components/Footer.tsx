import Link from "next/link";
import { TOOLS } from "@/config/tools";
import Logo from "./Logo";

export function Footer() {
  const groups = Array.from(
    TOOLS.reduce((map, t) => {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push(t);
      return map;
    }, new Map<string, typeof TOOLS>())
  );

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* bloco da marca */}
          <div>
            <div className="flex items-center gap-2">
              <Logo size={50} />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Calculadoras simples, rápidas e confiáveis.
            </p>
            <div className="mt-3 text-sm">
              <Link href="/calculators" className="text-blue-700 hover:underline">
                Ver todas as calculadoras →
              </Link>
            </div>
          </div>

          {/* blocos por categoria */}
          {groups.map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-sm font-semibold text-slate-900">{cat}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {items.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="text-slate-600 hover:text-slate-900">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          © {new Date().getFullYear()} SmartCalc — Feito com Next.js + Tailwind.
        </div>
      </div>
    </footer>
  );
}
