import { Box } from "@mui/material"
import React from "react"

import { $PlayerCard } from "./PlayerCard"
import { useSteamUsers } from "../hooks"
import { useMatch } from "../hooks/useMatch"

export const PlayerList: React.FC<{ team: Team }> = ({ team }) => {
  const frame = useMatch((state) => state.frame)
  const steamUsers = useSteamUsers(frame?.Players.map((e) => e.ID).sort())
  return (
    <Box display="flex" flexDirection="column" gap={1} minWidth={220}>
      {frame?.Players.filter((e) => e.Team === team).map((e) => (
        <div key={e.ID}>
          <$PlayerCard player={e} steamUser={steamUsers[e.ID]} />
        </div>
      ))}
    </Box>
  )
}
