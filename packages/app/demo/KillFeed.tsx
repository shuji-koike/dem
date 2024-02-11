import { Box } from "@mui/material"
import React from "react"

import { findPlayer, icon } from "."
import { PlayerLabel } from "./PlayerLabel"
import { useMatch } from "../hooks/useMatch"

export const KillFeed: React.FC = () => {
  const match = useMatch((state) => state.match)
  const round = useMatch((state) => state.round)
  const setTick = useMatch((state) => state.setTick)
  function filter(e: KillEvent) {
    return !round || e.Round === round?.Round
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      flexGrow={1}
      alignItems="flex-end"
      paddingY={1}
    >
      {match?.KillEvents.filter(filter).map((e, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="baseline"
          gap={1}
          fontSize={12}
          flexWrap="wrap"
          sx={{ cursor: "pointer" }}
          onClick={() => setTick?.(e.Tick)}
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
  )
}
