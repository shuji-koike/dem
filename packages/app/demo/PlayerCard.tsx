import { css } from "@emotion/react"
import { Avatar, Box, ProgressBar, Text, Truncate } from "@primer/components"
import React from "react"

import { teamColor, icon, armorIcon } from "."
import { SteamUser } from "../hooks"

export const PlayerCard: React.VFC<{
  player: Player
  steamUser?: SteamUser
}> = ({ player, steamUser }) => {
  return (
    <Box display="flex" gridGap={1}>
      <a href={steamUser?.profileurl} target="_blank" rel="noopener noreferrer">
        {steamUser && <Avatar size={40} square src={steamUser.avatar} />}
      </a>
      <Box flexGrow={1}>
        <Box display="flex" gridGap={2}>
          <Box minWidth={30} textAlign="right">
            <Text fontWeight="bold" color="gray">
              {player.Hp}
            </Text>
          </Box>
          <Box flexGrow={1}>
            <Truncate title={player.Name}>
              <Text color={teamColor(player.Team)} fontWeight="bold">
                {player.Name}
              </Text>
            </Truncate>
          </Box>
          <Text fontWeight="bold" textAlign="right" color="#131">
            ${player.Money}
          </Text>
        </Box>
        <ProgressBar progress={player.Hp} barSize="small" />
        <Box display="flex" gridGap={2} marginTop={1} minHeight="20px">
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
