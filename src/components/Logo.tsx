"use client";

import Image from "next/image";

export default function Logo({
  withWordmark = true,
  size = 40,
}: {
  withWordmark?: boolean;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="SmartCalc Logo"
        width={size}
        height={size}
        priority
        className="h-auto w-auto"
      />
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          Smart<span className="text-indigo-600">Calc</span>
        </span>
      )}
    </div>
  );
}
