import { Box } from "@mui/material"
import { Story } from "@storybook/react"
import React from "react"

import { DemoNav } from "./DemoNav"

export default {
  component: DemoNav,
}

export const Loading: Story = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <DemoNav />
    </Box>
  )
}
