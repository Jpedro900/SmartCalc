"use client";

import AdSense from "./AdSense";

/** Barra inferior para mobile/tablet; escondida em desktop */
export default function AdBottomBar() {
  return (
    <div className="lg:hidden mt-6">
      {/* 320x100/320x50/auto responsivo */}
      <AdSense maxWidth={728} height={90} />
    </div>
  );
}
