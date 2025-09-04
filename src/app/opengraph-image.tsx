/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          fontFamily: "Inter, system-ui, Arial",
          color: "#0f172a",
        }}
      >
        <div style={{ margin: 64, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* “chip” com o cérebro */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg,#6366f1 0%,#4338ca 100%)",
                display: "grid",
                placeItems: "center",
              }}
            >
              {/* sinal de igual como “cérebro/calculadora” minimal */}
              <div style={{ width: 28, height: 3, background: "#fff", borderRadius: 2, marginBottom: 4 }} />
              <div style={{ width: 28, height: 3, background: "#fff", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 48, fontWeight: 700 }}>
              Smart<span style={{ color: "#4f46e5" }}>Calc</span>
            </div>
          </div>

          <div style={{ fontSize: 28, color: "#334155", maxWidth: 900 }}>
            Hub de calculadoras e conversores — IMC, porcentagem, juros, regra de 3, moedas, unidades e mais.
          </div>

          <div style={{ marginTop: 8, display: "flex", gap: 12, color: "#475569", fontSize: 22 }}>
            <span>⚡ Rápido</span>
            <span>•</span>
            <span>🎯 Simples</span>
            <span>•</span>
            <span>✅ Acessível</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
