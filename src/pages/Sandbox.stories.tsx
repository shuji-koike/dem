import { Story, Meta } from "@storybook/react"
import React from "react"
import { Sandbox } from "./Sandbox"

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "Sandbox",
  component: Sandbox,
} as Meta

const Template: Story<React.ComponentProps<typeof Sandbox>> = args => {
  return <Sandbox {...args} />
}

export const Primary = Template.bind({})
Primary.args = {}
