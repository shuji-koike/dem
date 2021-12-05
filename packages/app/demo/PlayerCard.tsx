import { css } from "@emotion/react"
import { Avatar, Box, LinearProgress, Typography } from "@mui/material"
import React from "react"

import { teamColor, icon, armorIcon, teamColorVariantMap } from "."
import { SteamUser } from "../hooks"

export const PlayerCard: React.VFC<{
  player: Player
  steamUser?: SteamUser
}> = ({ player, steamUser }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <a href={steamUser?.profileurl} target="_blank">
        <Avatar variant="rounded" src={steamUser?.avatar} />
      </a>
      <Box flexGrow={1}>
        <Box display="flex" gap={2}>
          <Box minWidth={30} textAlign="right">
            <Typography fontWeight="bold" color="gray">
              {player.Hp}
            </Typography>
          </Box>
          <Box flexGrow={1}>
            <Typography
              noWrap
              maxWidth={120}
              color={teamColor(player.Team)}
              fontWeight="bold"
            >
              {player.Name}
            </Typography>
          </Box>
          <Typography fontWeight="bold" textAlign="right" color="#131">
            ${player.Money}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          color={teamColorVariantMap.get(player.Team)}
          value={player.Hp}
          css={css`
            opacity: 0.75;
          `}
        />
        <Box display="flex" gap={1} marginTop={1} minHeight="20px">
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
}
