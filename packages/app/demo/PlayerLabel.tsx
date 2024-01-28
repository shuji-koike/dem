import { Box, BoxProps } from "@mui/material"
import React from "react"

import { teamColor } from "."

export const PlayerLabel: React.FC<
  BoxProps & { player: Player | null | undefined }
> = ({ player, children, ...rest }) => {
  if (!player) return <></>
  return (
    <Box fontWeight="bold" color={teamColor(player.Team)} {...rest}>
      {player.Name}
      {children}
    </Box>
  )
}
