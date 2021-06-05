import { Story, Meta } from "@storybook/react"
import React from "react"
import { PlayerCard } from "./PlayerCard"

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "demo/PlayerCard",
  component: PlayerCard,
} as Meta

const Template: Story<React.ComponentProps<typeof PlayerCard>> = args => {
  return <PlayerCard {...args} />
}

const player = {
  ID: 12345,
  Name: "Player Name",
  Hp: 100,
  Flashed: 1,
  Money: 800,
  Team: 1,
  State: 0,
  Weapon: 2,
  Weapons: [2],
  ...{ X: 0, Y: 0, Yaw: 0 },
}

export const Primary = Template.bind({})
Primary.args = { player }
