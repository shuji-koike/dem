import { build } from "esbuild"

// eslint-disable-next-line @typescript-eslint/no-floating-promises
build({
  platform: "node",
  target: "node20",
  entryPoints: ["src/index.ts"],
  format: "esm",
  bundle: true,
  minify: false,
  sourcemap: "inline",
  outfile: "dist/index.js",
  packages: "external",
})
