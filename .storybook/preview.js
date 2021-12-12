import { CssBaseline, ThemeProvider } from "@mui/material"
import { theme } from "../packages/app/theme.tsx"

import "../packages/app/index.css"

export const decorators = [
  (story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {story()}
    </ThemeProvider>
  ),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "dark",
    values: [
      { name: "light", value: "#eee" },
      { name: "dark", value: "#111" },
    ],
  },
}
