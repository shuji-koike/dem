import { css } from "@emotion/react"
import { Box } from "@mui/material"
import React from "react"

import { Team, getRoundScore, teamColor } from "."
import { useMatch } from "../hooks/useMatch"

export const DemoScore: React.FC = () => {
  const match = useMatch((state) => state.match)
  const Round = useMatch((state) => state.round?.Round)
  const map = getRoundScore(match, Round)
  if (!map) return null
  return (
    <Box css={style}>
      <Box color={teamColor(Team.CounterTerrorists)}>
        {map.get(Team.CounterTerrorists) ?? 0}
      </Box>
      <span color="gray">-</span>
      <Box color={teamColor(Team.Terrorists)}>
        {map.get(Team.Terrorists) ?? 0}
      </Box>
    </Box>
  )
}

const style = css`
  margin: 0 auto;
  display: flex;
  font-size: 24px;
  font-weight: 900;
  gap: 8px;
`
