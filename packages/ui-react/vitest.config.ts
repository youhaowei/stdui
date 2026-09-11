import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    // Exposes the global afterEach that @testing-library/react hooks its
    // automatic DOM cleanup into, so renders don't leak between tests.
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
