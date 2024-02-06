import { css } from "@emotion/react"
import {
  faExplosion,
  faSkull,
  faStopwatch,
  faSyncAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

import { teamColor } from "."
import { RoundEndReason } from "../enum"
import { useMatch } from "../hooks/useMatch"

export const DemoNav: React.FC = () => {
  const match = useMatch((state) => state.match)
  return (
    <>
      {match?.Rounds?.map((round) => (
        <$DemoNavItem key={round.Tick} round={round}>
          {roundEndReasonToIcon(round)}
        </$DemoNavItem>
      ))}
      {!match?.Ended && (
        <>
          <$DemoNavItem>
            <FontAwesomeIcon icon={faSyncAlt} size="xs" color="#444" spin />
          </$DemoNavItem>
          {[...Array(Math.max(0, 20 - (match?.Rounds?.length ?? 0)))].map(
            (_, i) => (
              <$DemoNavItem key={i}>
                <FontAwesomeIcon icon={faSyncAlt} size="2xs" color="#333" />
              </$DemoNavItem>
            ),
          )}
        </>
      )}
    </>
  )
}

const DemoNavItem: React.FC<{
  round?: Round
  children?: React.ReactNode
}> = ({ round, children }) => {
  const setRound = useMatch((state) => state.setRound)
  const active = useMatch((state) => round?.Round === state.round?.Round)
  const color = round && teamColor(round.Winner)
  return (
    <div
      css={css`
        ${style}
        --size: 24px;
        --color: ${color};
        cursor: ${round ? "pointer" : "default"};
      `}
      className={active ? "active" : ""}
      onClick={() => round && setRound(round)}
    >
      {children || (round ? round.Round + 1 : null)}
    </div>
  )
}
const $DemoNavItem = React.memo(DemoNavItem)

function roundEndReasonToIcon(round: Round) {
  switch (round.Reason) {
    case RoundEndReason.RoundEndReasonCTWin:
    case RoundEndReason.RoundEndReasonTerroristsWin:
      return <FontAwesomeIcon icon={faSkull} />
    case RoundEndReason.RoundEndReasonBombDefused:
      return <FontAwesomeIcon icon={faTools} />
    case RoundEndReason.RoundEndReasonTargetBombed:
      return <FontAwesomeIcon icon={faExplosion} />
    case RoundEndReason.RoundEndReasonTargetSaved:
      return <FontAwesomeIcon icon={faStopwatch} />
  }
  return null
}

const style = css`
  display: inline-block;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  border-radius: calc(var(--size) / 2);
  text-align: center;
  font-family: monospace;
  color: var(--color);
  font-size: 14px;
  font-weight: bold;
  filter: brightness(80%);
  &:hover,
  &.active {
    color: #fff;
    background-color: var(--color);
  }
  &:hover {
    filter: brightness(120%);
  }
`
