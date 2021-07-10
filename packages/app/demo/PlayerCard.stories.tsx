/* eslint-disable import/no-extraneous-dependencies */
import { number, select, text } from "@storybook/addon-knobs"
import { Story, Meta } from "@storybook/react"
import React from "react"

import { PlayerCard } from "./PlayerCard"
import players from "./__mock__/players.json"

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "demo/PlayerCard",
  component: PlayerCard,
} as Meta

const Template: Story<React.ComponentProps<typeof PlayerCard>> = (args) => (
  <PlayerCard
    {...args}
    player={{
      ID: 12345,
      Name: text("Name", "Player Name"),
      Hp: number("Hp", 100),
      Flashed: select("Flashed", [0, 1], 0),
      Money: number("Money", 800),
      Team: select("Team", [1, 2, 3], 2),
      State: 0,
      Weapon: select("Weapon", [8, 303, 405, 503, 504, 505, 506], 303),
      Weapons: [8, 303, 405, 503, 504, 505, 506],
      ...{ X: 0, Y: 0, Yaw: 0 },
    }}
  />
)

export const Primary = Template.bind({})

export const List: Story<React.ComponentProps<typeof PlayerCard>> = () => (
  <>
    {players.map((e) => (
      <PlayerCard key={e.ID} player={e} />
    ))}
  </>
)
