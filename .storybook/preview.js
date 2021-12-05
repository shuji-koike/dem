import { addDecorator } from "@storybook/react"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import "../packages/app/index.css"

addDecorator((story) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {story()}
    </ThemeProvider>
  )
})

const theme = createTheme({
  palette: {
    mode: "dark",
  },
})

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

export const decorators = [(story) => story()]
