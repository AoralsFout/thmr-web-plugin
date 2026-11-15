import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    lib: {
      entry: "src/main.ts",
      name: "ThmrWebPlugin",
      fileName: "thmr",
      formats: ["umd"],
    },
  },
});
