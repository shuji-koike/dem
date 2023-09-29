import { css } from "@emotion/react"
import { Avatar, Box, LinearProgress, Typography } from "@mui/material"
import React from "react"

import { teamColor, icon, armorIcon, teamColorVariantMap } from "."
import { SteamUser } from "../hooks"

export const PlayerCard: React.FC<{
  player: Player
  steamUser?: SteamUser
}> = React.memo(function PlayerCard({ player, steamUser, ...props }) {
  return (
    <Box {...props} display="flex" alignItems="center" gap={1}>
      <a href={steamUser?.profileurl} target="_blank">
        <Avatar variant="rounded" src={steamUser?.avatar} />
      </a>
      <Box flexGrow={1}>
        <Box
          display="flex"
          gap={2}
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Typography
            minWidth={30}
            fontWeight="bold"
            color="gray"
            textAlign="right"
          >
            {player.Hp}
          </Typography>
          <Typography
            flexGrow={1}
            maxWidth={140}
            color={teamColor(player.Team)}
            fontWeight="bold"
            noWrap
          >
            {player.Name}
          </Typography>
          <Typography
            minWidth={40}
            fontWeight="bold"
            textAlign="right"
            color="#060"
            fontSize={16}
          >
            ${player.Money}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          color={teamColorVariantMap.get(player.Team)}
          value={player.Hp}
        />
        <Box display="flex" gap={1} marginTop="4px" minHeight="20px">
          <img src={armorIcon(player)} />
          {player.Weapons?.filter((e) => e !== 405).map((e, i) => (
            <img
              key={i}
              src={icon(e)}
              css={css`
                height: 20px;
                opacity: ${player.Weapon === e ? 1 : 0.5};
              `}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
})
