import { css } from "@emotion/react"
import { Avatar, Box, LinearProgress, Typography } from "@mui/material"
import React from "react"

import { armorIcon, icon, teamColor, teamColorVariantMap } from "."
import { SteamUser } from "../hooks"

export const PlayerCard: React.FC<{
  player: Pick<Player, (typeof keys)[number]>
  steamUser?: SteamUser
}> = ({ player, steamUser }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <a href={steamUser?.profileurl} target="_blank">
        <Avatar variant="rounded" src={steamUser?.avatar} />
      </a>
      <Box flexGrow={1}>
        <Box
          display="flex"
          gap={1}
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Typography
            minWidth={30}
            fontWeight="bold"
            color="gray"
            textAlign="right"
            fontSize={12}
          >
            {player.Hp}
          </Typography>
          <Typography
            flexGrow={1}
            maxWidth={100}
            color={
              player.Hp < 1
                ? "gray"
                : player.Hp < 20
                  ? "error"
                  : teamColor(player.Team)
            }
            fontWeight="bold"
            fontSize={12}
            noWrap
          >
            {player.Name}
          </Typography>
          <Box flexGrow={1} />
          <Typography
            minWidth={40}
            fontWeight="bold"
            textAlign="right"
            color="#060"
            fontSize={10}
          >
            ${player.Money}
          </Typography>
        </Box>
        <LinearProgress
          css={{ height: 2 }}
          variant="determinate"
          color={
            player.Hp < 1
              ? "primary"
              : player.Hp < 20
                ? "error"
                : teamColorVariantMap.get(player.Team)
          }
          value={player.Hp}
        />
        <Box display="flex" gap={3 / 4} marginTop={1 / 2} minHeight="16px">
          <img src={armorIcon(player.State)} />
          {player.Weapons?.filter((e) => e !== 405).map((e, i) => (
            <img
              key={i}
              src={icon(e)}
              css={css`
                height: 12px;
                opacity: ${player.Weapon === e ? 1 : 0.5};
              `}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export const $PlayerCard = React.memo(
  PlayerCard,
  (
    prev: Readonly<React.ComponentProps<typeof PlayerCard>>,
    next: Readonly<React.ComponentProps<typeof PlayerCard>>,
  ) => {
    if (prev.steamUser?.avatar !== next.steamUser?.avatar) return false
    return keys.reduce(
      (acc, key) =>
        acc &&
        (Array.isArray(prev.player[key])
          ? prev.player[key]?.join()
          : prev.player[key]) ===
          (Array.isArray(next.player[key])
            ? next.player[key]?.join()
            : next.player[key]),
      true,
    )
  },
)

const keys = [
  "Hp",
  "Money",
  "Name",
  "State",
  "Team",
  "Weapon",
  "Weapons",
] as const satisfies (keyof Player)[]
