"use client";

import AdSense from "./AdSense";

/** Bloco inline para inserir dentro das calculadoras */
export default function AdInline() {
  return (
    <div className="my-6">
      <AdSense maxWidth={728} height={90} />
    </div>
  );
}
