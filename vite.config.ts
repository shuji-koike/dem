/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
})
