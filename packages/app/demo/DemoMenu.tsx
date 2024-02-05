import { css } from "@emotion/react"
import { Box, Tab, Tabs } from "@mui/material"
import React from "react"

import { findPlayer, icon } from "."
import { Filter } from "./DemoPlayer"
import { $PlayerCard } from "./PlayerCard"
import { PlayerLabel } from "./PlayerLabel"
import { useSteamUsers } from "../hooks"
import { useMatch } from "../hooks/useMatch"

export const DemoMenu: React.FC<{
  filter: Filter
  setFilter: (e: Filter) => void
}> = ({ filter, setFilter }) => {
  const { match, round, frame, setTick } = useMatch()
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
  if (!round && !frame) return null
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
      <Box display="flex" flexDirection="column" gap={1}>
        {frame?.Players.filter((e) => e.Team === 3 && filter.players?.(e)).map(
          (e) => (
            <div key={e.ID}>
              <$PlayerCard player={e} steamUser={steamUsers[e.ID]} />
            </div>
          ),
        )}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        {frame?.Players.filter((e) => e.Team === 2 && filter.players?.(e)).map(
          (e) => (
            <div key={e.ID}>
              <$PlayerCard player={e} steamUser={steamUsers[e.ID]} />
            </div>
          ),
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        flexGrow={1}
        alignItems="flex-end"
        paddingY={1}
      >
        {match?.KillEvents.filter((e) => filter.kills?.(e)).map((e, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="baseline"
            gap={1}
            onClick={() => setTick?.(e.Tick)}
            sx={{ cursor: "pointer" }}
            fontSize={12}
            flexWrap="wrap"
          >
            {e.AttackerBlind && <img src={icon("blinded")} height={14} />}
            <PlayerLabel player={findPlayer(match, e.Killer)} />
            <img height={10} src={icon(e.Weapon)} />
            <Box display="flex" gap={1 / 4}>
              {e.NoScope && <img src={icon("noscope")} height={14} />}
              {e.ThroughSmoke && <img src={icon("smoke")} height={14} />}
              {!!e.Penetrated && <img src={icon("wallbang")} height={14} />}
              {e.IsHeadshot && <img src={icon("headshot")} height={14} />}
            </Box>
            <PlayerLabel player={findPlayer(match, e.Victim)} />
          </Box>
        ))}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        flexGrow={1}
        alignItems="flex-end"
        paddingY={1}
      >
        {match?.NadeEvents.filter((e) => filter.nades?.(e)).map((e, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="baseline"
            justifyContent="end"
            gap={1 / 2}
            onClick={() => setTick?.(e.Tick)}
            fontSize={12}
            sx={{ cursor: "pointer" }}
          >
            <img height={16} src={icon(e.Weapon)} />
            <PlayerLabel player={findPlayer(match, e.Thrower)} />
          </Box>
        ))}
      </Box>
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
