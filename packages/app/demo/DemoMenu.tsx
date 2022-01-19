import { css } from "@emotion/react"
import { Box, Tab, Tabs } from "@mui/material"
import React from "react"

import { findPlayer, icon } from "."
import { useSteamUsers } from "../hooks"
import { Filter } from "./DemoPlayer"
import { PlayerCard } from "./PlayerCard"
import { PlayerLabel } from "./PlayerLabel"

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
        setFilter({ players: () => true })
        break
      case 2:
        setFilter({ kills: (e) => !round || e.Round === round?.Round })
        break
      case 3:
        setFilter({ nades: (e) => !round || e.Round === round?.Round })
        break
    }
  }, [tab, round])
  return (
    <div css={style} onWheelCapture={(e) => e.stopPropagation()}>
      <nav>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={(_, tab) => setTab(tab)}
        >
          <Tab value={1} label="Players" />
          <Tab value={2} label="Kills" />
          <Tab value={3} label="Nades" />
        </Tabs>
      </nav>
      {filter.players &&
        frame?.Players.filter(filter.players).map((e) => (
          <PlayerCard key={e.ID} player={e} steamUser={steamUsers[e.ID]} />
        ))}
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
  backdrop-filter: blur(1px);
  > nav {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  > ${PlayerCard} {
    margin: 8px 0;
  }
  > * {
    filter: drop-shadow(0 0 4px rgba(18, 18, 18, 0.5));
  }
`
