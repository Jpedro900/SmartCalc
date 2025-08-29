"use client";
import { useId, useState } from "react";

type Tab = { id: string; label: string };

export function Tabs({
  tabs, onChange, initial = 0,
}: { tabs: Tab[]; onChange: (index: number) => void; initial?: number }) {
  const [active, setActive] = useState(initial);
  const tablistId = useId();

  return (
    <div>
      <div id={tablistId} role="tablist" aria-label="Categorias" className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            className={
              "rounded-full border px-3 py-1.5 text-sm transition " +
              (active === i
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white hover:bg-slate-50")
            }
            onClick={() => { setActive(i); onChange(i); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); onChange(i); }
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
