import { Box } from "@mui/material"
import { StoryFn } from "@storybook/react"
import React from "react"

import { DemoNav } from "./DemoNav"

export default {
  component: DemoNav,
}

export const Loading: StoryFn = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <DemoNav />
    </Box>
  )
}
