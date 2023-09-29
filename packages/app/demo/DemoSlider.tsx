import styled from "@emotion/styled"
import { faBomb, faTimes, faTools } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Slider, Typography, useTheme } from "@mui/material"
import { uniqBy } from "lodash"
import React from "react"

import {
  bombColor,
  BombState,
  findIndex,
  frameToColor,
  frameToTime,
  labelFormat,
  teamColor,
} from "."

export const DemoSlider: React.FC<{
  match: Match
  round: Round
  frame: Frame
  setFrame: (e: Frame | undefined) => void
}> = ({ match, round, frame, setFrame }) => {
  const theme = useTheme()
  const toTime = frameToTime.bind(undefined, match, round)
  const marks = React.useMemo(
    () => [
      ...round.Frames.filter((e) => e.Bomb.State & BombState.Defused)
        .slice(0, 1)
        .map((e) => ({
          value: round.Frames.indexOf(e),
          label: <Icon color={teamColor(3)} icon={faTools} />,
        })),
      ...round.Frames.filter((e) => e.Bomb.State & BombState.Exploded)
        .slice(0, 1)
        .map((e) => ({
          value: round.Frames.indexOf(e),
          label: <Icon color={bombColor(e.Bomb.State)} icon={faBomb} />,
        })),
      ...round.Frames.filter(
        (e, _, arr, time = toTime(e)) =>
          !(~~time % 5) &&
          e ===
            arr.find(
              (f) => ~~toTime(f) === ~~time && e.Bomb.State === f.Bomb.State,
            ),
      ).map((e) => ({
        value: round.Frames.indexOf(e),
        label: (
          <Typography
            fontSize={14}
            fontFamily="monospace"
            color={frameToColor.call(theme, e)}
            letterSpacing={-1}
          >
            {labelFormat(match, round, e)}
          </Typography>
        ),
      })),
      ...match.KillEvents.filter((e) => e.Round === round.Round).map((e) => ({
        value: findIndex(round.Frames, (f) => f.Tick >= e.Tick),
        label: <Icon color={teamColor(e.Team)} icon={faTimes} />,
      })),
    ],
    [match, round],
  )
  return (
    <Slider
      value={round.Frames.indexOf(frame)}
      max={round.Frames.length - 1}
      onChange={(_, value) => {
        if (typeof value === "number") setFrame(round.Frames[value])
      }}
      marks={uniqBy(marks, "value")}
      valueLabelDisplay="auto"
      valueLabelFormat={(e) => labelFormat(match, round, round.Frames[e])}
    />
  )
}

const Icon = styled(FontAwesomeIcon)`
  position: relative;
  top: -27px;
`
