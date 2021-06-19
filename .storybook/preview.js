import "../src/index.css"

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

export const decorators = [story => story()]
