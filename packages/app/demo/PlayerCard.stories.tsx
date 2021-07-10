import { Story } from "@storybook/react"
import React from "react"
import styled from "styled-components"

import { PlayerCard } from "./PlayerCard"
import players from "./__mock__/players.json"

export default {
  title: "demo/PlayerCard",
  component: PlayerCard,
}

export const Primary: Story = () => (
  <Frame>
    <PlayerCard
      player={{
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
      }}
    />
  </Frame>
)

export const List: Story = () => (
  <Frame>
    {players.map((e) => (
      <PlayerCard key={e.ID} player={e} />
    ))}
  </Frame>
)

const Frame = styled.div`
  width: 300px;
`
