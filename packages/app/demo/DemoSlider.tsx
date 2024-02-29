import styled from "@emotion/styled"
import {
  faExplosion,
  faTimes,
  faTools,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Slider, Typography, useTheme } from "@mui/material"
import { uniqBy } from "lodash"
import React from "react"

import {
  BombState,
  findIndex,
  frameToColor,
  frameToTime,
  labelFormat,
  teamColor,
} from "."
import { useMatch } from "../hooks/useMatch"

export const DemoSlider: React.FC = () => {
  const { match, round, frame, setFrame, toggle } = useMatch()
  const theme = useTheme()
  const toTime = (frame: Frame) =>
    (match && round && frameToTime(match, round, frame)) ?? 0
  function makeMarks(match: Match, round: Round) {
    return [
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
          label: <Icon color={teamColor(2)} icon={faExplosion} />,
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
    ]
  }
  const marks = React.useMemo(
    () => (match && round && frame ? makeMarks(match, round) : []),
    [match, round],
  )
  return (
    <Slider
      value={frame ? round?.Frames.indexOf(frame) : 0}
      max={round ? round.Frames.length - 1 : 0}
      onChange={(_, value) => {
        toggle(true)
        if (typeof value === "number") setFrame(round?.Frames[value])
      }}
      marks={uniqBy(marks, "value")}
      valueLabelDisplay="auto"
      valueLabelFormat={(e) =>
        match && round ? labelFormat(match, round, round.Frames[e]) : ""
      }
      size="small"
    />
  )
}

const Icon = styled(FontAwesomeIcon)`
  position: relative;
  top: -26px;
`
