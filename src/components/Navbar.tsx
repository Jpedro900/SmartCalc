import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-blue-600 text-white text-xs font-bold">
            S
          </span>
          <span className="text-sm font-semibold">SmartCalc</span>
        </Link>
        <div className="hidden gap-4 text-sm md:flex">
          <Link className="hover:underline" href="/#categorias">
            Categorias
          </Link>
          <Link className="hover:underline" href="/calculators">
            Todas
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
            href="/calculators"
          >
            Explorar
          </Link>
          <Link
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            href="/#todas"
          >
            Começar
          </Link>
        </div>
      </div>
    </nav>
  );
}
