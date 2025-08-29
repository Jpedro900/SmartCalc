import Link from "next/link";

export function CardLink({ href, title, desc, badge, icon }: {
  href: string; title: string; desc: string; badge?: string; icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-700">
            {icon ?? "∑"}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {badge && (
          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
      <div className="mt-3 text-sm font-medium text-blue-700 opacity-80 group-hover:opacity-100">
        Abrir →
      </div>
    </Link>
  );
}
