// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["", "/calculators", "/calculators/percentage", "/calculators/juros", "/calculators/regra-de-3", "/calculators/imc", "/calculators/moedas", "/calculators/idade", "/calculators/area-volume", "/calculators/unidades"];
  const now = new Date().toISOString();

  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.6,
  }));
}
