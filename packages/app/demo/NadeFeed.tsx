import { Box } from "@mui/material"
import React from "react"

import { findPlayer, icon } from "."
import { PlayerLabel } from "./PlayerLabel"
import { useMatch } from "../hooks/useMatch"

export const NadeFeed: React.FC = () => {
  const match = useMatch((state) => state.match)
  const round = useMatch((state) => state.round)
  const setTick = useMatch((state) => state.setTick)
  function filter(e: NadeEvent) {
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
      {match?.NadeEvents.filter(filter).map((e, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="baseline"
          justifyContent="end"
          gap={1 / 2}
          fontSize={12}
          sx={{ cursor: "pointer" }}
          onClick={() => setTick?.(e.Tick)}
        >
          <img height={16} src={icon(e.Weapon)} />
          <PlayerLabel player={findPlayer(match, e.Thrower)} />
        </Box>
      ))}
    </Box>
  )
}
