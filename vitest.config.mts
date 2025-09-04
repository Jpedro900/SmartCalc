// vitest.config.mts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    globals: true,
    reporters: "default",
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
    },
  },
  // alias para suportar "@/..." nos testes
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
