import { css } from "@emotion/react"
import { Box } from "@mui/material"
import React from "react"

import { findPlayer, icon, teamColor } from "."
import { useSteamUsers } from "../hooks"
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
    <div css={style} onWheelCapture={(e) => e.stopPropagation()}>
      <nav>
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
      </nav>
      <hr />
      {filter.players &&
        frame?.Players.filter(filter.players).map((e) => (
          <PlayerCard key={e.ID} player={e} steamUser={steamUsers[e.ID]} />
        ))}
      <hr />
      {filter.kills &&
        match.KillEvents.filter(filter.kills).map((e, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="baseline"
            marginY={1}
            gap={2}
            onClick={() => setTick?.(e.Tick)}
          >
            <PlayerLabel player={findPlayer(match, e.Killer)} />
            <img height={16} src={icon(e.Weapon)} />
            {!!e.Penetrated && <span>(P)</span>}
            {e.IsHeadshot && <span>(H)</span>}
            <PlayerLabel player={findPlayer(match, e.Victim)} />
          </Box>
        ))}
      <hr />
      {filter.nades &&
        match.NadeEvents.filter(filter.nades).map((e, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="baseline"
            marginY={1}
            gap={2}
            onClick={() => setTick?.(e.Tick)}
          >
            <img height={16} src={icon(e.Weapon)} />
            <PlayerLabel player={findPlayer(match, e.Thrower)} />
          </Box>
        ))}
    </div>
  )
}

const style = css`
  > nav {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  img {
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 1));
  }
`

const PlayerLabel: React.VFC<{
  player: Player | null
  onClick?: () => unknown
}> = ({ player, onClick }) => {
  if (!player) return <></>
  return (
    <Box onClick={onClick} fontWeight="bold" color={teamColor(player.Team)}>
      {player.Name}
    </Box>
  )
}
