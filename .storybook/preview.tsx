import { DecoratorFn } from "@storybook/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { theme } from "../packages/app/theme"

import "../packages/app/index.css"

export const decorators: DecoratorFn[] = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  ),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "dark",
    values: [
      { name: "light", value: "#fff" },
      { name: "dark", value: theme.palette.background.default },
    ],
  },
}
