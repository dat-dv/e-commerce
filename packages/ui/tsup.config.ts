import { defineConfig } from "tsup";

const external = [
  "@hookform/resolvers",
  "@marsidev/react-turnstile",
  "clsx",
  "embla-carousel",
  "embla-carousel-react",
  "framer-motion",
  "leaflet",
  "lucide-react",
  "react",
  "react-aria",
  "react-aria-components",
  "react-dom",
  "react-easy-crop",
  "react-hook-form",
  "sonner",
  "tailwind-merge",
  "virtua",
  "zod",
];

export default defineConfig({
  entry: ["src/index.ts", "src/tokens/index.ts", "src/utils/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: false,
  target: "es2022",
  external,
});
