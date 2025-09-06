"use client";

import { useEffect, useMemo, useRef } from "react";
import Script from "next/script";

type AdSenseProps = {
  publisherId?: string;
  slotId?: string;
  maxWidth?: number; // largura máxima do contêiner
  height?: number; // altura fixa do contêiner
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSense({
  publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID!,
  slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID!,
  maxWidth = 728,
  height = 90,
}: AdSenseProps) {
  const isProd = process.env.NODE_ENV === "production";
  const pushedRef = useRef(false);

  const envOk = useMemo(
    () => typeof publisherId === "string" && publisherId.startsWith("pub-") && !!slotId,
    [publisherId, slotId]
  );

  useEffect(() => {
    if (!envOk) return;
    const id = window.setTimeout(() => {
      if (pushedRef.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch {}
    }, 150);
    return () => clearTimeout(id);
  }, [envOk]);

  const showDevPlaceholder = !isProd;

  return (
    <div className="flex w-full justify-center">
      <div style={{ display: "block", width: "100%", maxWidth, height, position: "relative" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={envOk ? `ca-${publisherId}` : undefined}
          data-ad-slot={envOk ? slotId : undefined}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(!isProd ? { "data-adtest": "on" } : {})}
        />
        {showDevPlaceholder && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "1px dashed #94a3b8",
              background:
                "repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9 10px,#e2e8f0 10px,#e2e8f0 20px)",
              color: "#0f172a",
              fontSize: 13,
              fontWeight: 600,
              textAlign: "center",
              padding: 8,
            }}
          >
            AdSense (teste)
            <br />
            {envOk ? "IDs OK • data-adtest=on" : "IDs inválidos/ausentes"}
          </div>
        )}
      </div>

      {envOk && (
        <Script
          id="adsbygoogle-loader"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`}
          crossOrigin="anonymous"
          onLoad={() => {
            if (!pushedRef.current) {
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                pushedRef.current = true;
              } catch {}
            }
          }}
        />
      )}
    </div>
  );
}
