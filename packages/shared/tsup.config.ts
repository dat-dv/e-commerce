import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: true,
  clean: !options.watch,
}));
