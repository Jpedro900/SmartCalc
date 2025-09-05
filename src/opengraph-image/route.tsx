/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export async function GET() {
  const title = "SmartCalc";
  const subtitle = "Hub de calculadoras e conversores";
  const brand = { primary: "#4f46e5", slate: "#0f172a" };

  return new ImageResponse(
    (
      <div
        style={{
          // Layout permitido: flex
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "stretch",

          // Box
          width: "100%",
          height: "100%",
          padding: 48,
          background: "#ffffff",
          color: brand.slate,
          // Sombra/raio não afetam muito aqui, mas são suportados
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Se tiver /public/icon-192.png, ótimo; senão, comente o <img> */}
          <img
            src={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/icon-192.png`}
            width={64}
            height={64}
            alt=""
            style={{ borderRadius: 16 }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{title}</div>
            <div style={{ fontSize: 24, opacity: 0.9 }}>{subtitle}</div>
          </div>
        </div>

        {/* Middle — badges usando flex e boxes simples */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 12,
          }}
        >
          {["Financeiro", "Matemática", "Utilidades", "Saúde & bem-estar"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 14px",
                borderRadius: 999,
                background: "#eef2ff",
                color: brand.primary,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxWidth: 800,
            }}
          >
            <div style={{ fontSize: 28, lineHeight: 1.2 }}>
              Juros, financiamento, moedas, IMC, idade, áreas & volumes, e muito mais — tudo no
              padrão pt-BR.
            </div>
            <div style={{ fontSize: 20, opacity: 0.8 }}>
              Next.js + TypeScript + Tailwind + Recharts
            </div>
          </div>

          {/* Marca */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              borderRadius: 12,
              background: brand.primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            smartcalc.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
