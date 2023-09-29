import { Box } from "@mui/material"
import React from "react"

import { teamColor } from "."

export const PlayerLabel: React.FC<{
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
