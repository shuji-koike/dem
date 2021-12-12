/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  esbuild: {
    jsxFactory: "jsx",
    jsxInject: 'import { jsx } from "@emotion/react"',
  },
})
