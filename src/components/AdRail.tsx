"use client";

import AdSense from "./AdSense";

/** Coluna de anúncios para desktop (stickies) */
export default function AdRail() {
  return (
    <aside className="hidden lg:block sticky top-20 space-y-4">
      {/* 160x600 ou 300x600 funcionam bem em rail */}
      <AdSense maxWidth={160} height={600} />
      <AdSense maxWidth={160} height={600} />
    </aside>
  );
}
