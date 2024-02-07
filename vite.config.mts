/* eslint-disable import/no-extraneous-dependencies */
import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

// https://vitejs.dev/config
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    process.env["CI"] &&
      sentryVitePlugin({
        org: "shujikoike",
        project: "dem",
      }),
    viteStaticCopy({
      targets: [
        {
          src: "packages/app/node_modules/libarchive.js/dist/libarchive.wasm",
          dest: "assets",
        },
      ],
    }),
  ],
  build: {
    sourcemap: !!process.env["CI"],
  },
})
