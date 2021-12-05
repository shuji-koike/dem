import { Story } from "@storybook/react"
import React from "react"

import { PlayerCard } from "./PlayerCard"
import players from "./__mock__/players.json"

export default {
  component: PlayerCard,
}

export const Primary = {
  args: {
    player: {
      ID: 12345,
      Name: "Player Name",
      Hp: 100,
      Flashed: 0,
      Money: 800,
      Team: 2,
      State: 0,
      Weapon: 303,
      Weapons: [8, 303, 405, 503, 504, 505, 506],
      ...{ X: 0, Y: 0, Yaw: 0 },
    },
  },
}

export const List: Story = () => (
  <>
    {players.map((e) => (
      <PlayerCard key={e.ID} player={e} />
    ))}
  </>
)
