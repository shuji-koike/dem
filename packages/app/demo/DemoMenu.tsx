import { css } from "@emotion/react"
import { Box, Tab, Tabs } from "@mui/material"
import React from "react"

import { findPlayer, icon } from "."
import { Filter } from "./DemoPlayer"
import { PlayerCard } from "./PlayerCard"
import { PlayerLabel } from "./PlayerLabel"
import { useSteamUsers } from "../hooks"

export const DemoMenu: React.FC<{
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
      <div>
        {frame?.Players.filter((e) => e.Team === 3 && filter.players?.(e)).map(
          (e) => (
            <PlayerCard
              key={e.ID}
              player={e}
              steamUser={steamUsers[e.ID]}
              css={css`
                margin: 8px 0;
              `}
            />
          ),
        )}
      </div>
      <div>
        {frame?.Players.filter((e) => e.Team === 2 && filter.players?.(e)).map(
          (e) => (
            <PlayerCard
              key={e.ID}
              player={e}
              steamUser={steamUsers[e.ID]}
              css={css`
                margin: 8px 0;
              `}
            />
          ),
        )}
      </div>
      <div>
        {match.KillEvents.filter((e) => filter.kills?.(e)).map((e, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="baseline"
            justifyContent="end"
            marginY={1}
            gap={2}
            onClick={() => setTick?.(e.Tick)}
          >
            <PlayerLabel player={findPlayer(match, e.Killer)} />
            <img height={16} src={icon(e.Weapon)} />
            {/* TODO: add icon */}
            {!!e.Penetrated && <span>(-x-)</span>}
            {e.IsHeadshot && <span>(HS)</span>}
            <PlayerLabel player={findPlayer(match, e.Victim)} />
          </Box>
        ))}
      </div>
      <div>
        {match.NadeEvents.filter((e) => filter.nades?.(e)).map((e, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="baseline"
            justifyContent="end"
            marginY={1}
            gap={2}
            onClick={() => setTick?.(e.Tick)}
          >
            <img height={16} src={icon(e.Weapon)} />
            <PlayerLabel player={findPlayer(match, e.Thrower)} />
          </Box>
        ))}
      </div>
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  > nav {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  > * > * {
    backdrop-filter: blur(1px);
    filter: drop-shadow(0 0 4px rgba(18, 18, 18, 0.5));
  }
  div:empty {
    display: none;
  }
`
