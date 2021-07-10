import { Avatar } from "@material-ui/core"
import {
  Box,
  Flex,
  FlexProps,
  ProgressBar,
  Text,
  Truncate,
} from "@primer/components"
import React from "react"
import styled from "styled-components"

import { teamColor, icon, armorIcon } from "."
import { SteamUser } from "../store/steam"

const PlayerCardBase: React.VFC<
  FlexProps & {
    player: Player
    steamUser?: SteamUser
  }
> = ({ player, steamUser, ...props }) => {
  return (
    <Flex {...props} alignItems="center" style={{ gap: 8 }}>
      <a href={steamUser?.profileurl} rel="noopener noreferrer">
        <Avatar src={steamUser?.avatar} />
      </a>
      <Box flexGrow={1}>
        <Flex style={{ gap: 8 }}>
          <Text fontWeight="bold">{player.Hp}</Text>
          <Box flexGrow={1}>
            <Text color={teamColor(player.Team)} fontWeight="bold">
              <Truncate title="">{player.Name}</Truncate>
            </Text>
          </Box>
          <Text fontWeight="bold" textAlign="right" color="#131">
            ${player.Money}
          </Text>
        </Flex>
        <ProgressBar progress={player.Hp} barSize="small" />
        <Flex flexWrap="wrap" style={{ gap: 8 }}>
          <img src={armorIcon(player)} />
          {player.Weapons?.filter((e) => e !== 405).map((e, i) => (
            <img
              key={i}
              style={{ height: 20, opacity: player.Weapon === e ? 1 : 0.5 }}
              src={icon(e)}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}

export const PlayerCard = styled(PlayerCardBase)``
