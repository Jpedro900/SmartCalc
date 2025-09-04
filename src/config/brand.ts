// src/config/brand.ts
export const BRAND = {
  name: "SmartCalc",
  shortName: "SmartCalc",
  // Paleta principal
  color: {
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1", // indigo-500
      600: "#4f46e5", // indigo-600 (ações)
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    neutral: {
      50: "#f8fafc",   // slate-50
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1f2937",
      900: "#0f172a",
    },
    success: "#10b981",
    warning: "#f59e0b",
    danger:  "#ef4444",
  },
  radius: {
    sm: "0.5rem",     // rounded-lg
    md: "0.75rem",    // rounded-xl
    lg: "1rem",
  },
  shadow: {
    card: "0 1px 2px rgba(0,0,0,0.04), 0 1px 6px rgba(0,0,0,0.04)",
  },
};
