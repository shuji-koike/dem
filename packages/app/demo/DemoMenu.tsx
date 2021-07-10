import { Flex, Text } from "@primer/components"
import React from "react"
import styled from "styled-components"

import { findPlayer, icon, teamColor } from "."
import { useSteamUsers } from "../store/steam"
import { Filter } from "./DemoPlayer"
import { PlayerCard } from "./PlayerCard"

export const DemoMenu: React.VFC<{
  match: Match
  round?: Round
  frame?: Frame
  setTick?: (tick: number | undefined) => void
  filter: Filter
  setFilter: (e: Filter) => void
}> = ({ match, round, frame, setTick, filter, setFilter }) => {
  const steamUsers = useSteamUsers(frame?.Players.map((e) => e.ID))
  const [tab, setTab] = React.useState(1)
  React.useEffect(() => {
    switch (tab) {
      case 1:
        setFilter({
          players: () => true,
          kills: (e) => e.Round === round?.Round,
          nades: (e) => e.Round === round?.Round,
        })
        break
      case 2:
        setFilter({
          kills: (e) => !round || e.Round === round?.Round,
        })
        break
      case 3:
        setFilter({ nades: (e) => !round || e.Round === round?.Round })
        break
    }
  }, [tab, round])
  return (
    <div onWheelCapture={(e) => e.stopPropagation()}>
      <StyledNav>
        <button onClick={() => setTab(1)}>Players</button>
        <button onClick={() => setTab(2)}>Kills</button>
        <button onClick={() => setTab(3)}>Nades</button>
        <label>
          <input
            type="checkbox"
            defaultChecked={!round}
            disabled={!round}
            onClick={() => setTick?.(undefined)}
          />
          All
        </label>
      </StyledNav>
      {filter.players &&
        frame?.Players.filter(filter.players).map((e) => (
          <PlayerCard
            key={e.ID}
            player={e}
            steamUser={steamUsers[e.ID]}
            marginY={1}
          />
        ))}
      {filter.kills &&
        match.KillEvents.filter(filter.kills).map((e, i) => (
          <Flex
            key={i}
            onClick={() => setTick?.(e.Tick)}
            marginY={1}
            style={{ gap: 8 }}
          >
            <PlayerLabel player={findPlayer(match, e.Killer)} />
            <img height={16} src={icon(e.Weapon)} />
            {!!e.Penetrated && <span>(P)</span>}
            {e.IsHeadshot && <span>(H)</span>}
            <PlayerLabel player={findPlayer(match, e.Victim)} />
          </Flex>
        ))}
      {filter.nades &&
        match.NadeEvents.filter(filter.nades).map((e, i) => (
          <Flex
            key={i}
            onClick={() => setTick?.(e.Tick)}
            marginY={1}
            style={{ gap: 8 }}
          >
            <img height={16} src={icon(e.Weapon)} />
            <PlayerLabel player={findPlayer(match, e.Thrower)} />
          </Flex>
        ))}
    </div>
  )
}

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
`

const PlayerLabel: React.VFC<{
  player: Player | null
  onClick?: () => unknown
}> = ({ player, onClick }) => {
  if (!player) return <></>
  return (
    <Text onClick={onClick} fontWeight="bold" color={teamColor(player.Team)}>
      {player.Name}
    </Text>
  )
}
