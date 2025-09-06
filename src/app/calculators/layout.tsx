"use client";

import type { ReactNode } from "react";
import AdRail from "@/components/AdRail";
import AdBottomBar from "@/components/AdBottomBar";

export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)_200px]">
        {/* rail esquerdo */}
        <div className="order-2 lg:order-1">
          <AdRail />
        </div>

        {/* conteúdo */}
        <div className="order-1 lg:order-2">{children}</div>

        {/* rail direito */}
        <div className="order-3">
          <AdRail />
        </div>
      </div>

      {/* barra inferior apenas mobile/tablet */}
      <AdBottomBar />
    </main>
  );
}
