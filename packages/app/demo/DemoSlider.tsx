import styled from "@emotion/styled"
import { faBomb, faTimes, faTools } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Slider, Theme, Typography, useTheme } from "@mui/material"
import { uniqBy } from "lodash"
import React from "react"

import { BombState, teamColor, bombColor } from "."

export const DemoSlider: React.VFC<{
  match: Match
  round: Round
  frame: Frame
  setFrame: (e: Frame | undefined) => void
}> = ({ match, round, frame, setFrame }) => {
  const theme = useTheme()
  const toTime = frameToTime.bind(null, match, round)
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
        (frame, _, arr, time = toTime(frame)) =>
          !(time % 5) &&
          frame ===
            arr.find(
              (e) => toTime(e) === time && e.Bomb.State === frame.Bomb.State
            )
      ).map((e) => ({
        value: round.Frames.indexOf(e),
        label: (
          <MarkerLabel color={frameToColor.call(theme, e)}>
            {labelFormat(match, round, e)}
          </MarkerLabel>
        ),
      })),
      ...match.KillEvents.filter((e) => e.Round === round.Round).map((e) => ({
        value: findIndex(round.Frames, (f) => f.Tick >= e.Tick),
        label: <Icon color={teamColor(e.Team)} icon={faTimes} />,
      })),
    ],
    [match, round]
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

function findIndex(frames: Frame[], fn: (f: Frame) => boolean) {
  const index = frames.findIndex(fn)
  return index === -1 ? frames.length - 1 : index
}

function tickToSecond(match: Match, round: Round, tick: number) {
  return ((tick || 0) - (round.Frames[0]?.Tick ?? NaN)) / match.TickRate
}

function frameToTime(match: Match, round: Round, frame: Frame): number {
  const planted =
    frame.Bomb.State & BombState.Planted
      ? round.Frames.find((e) => e.Bomb.State & BombState.Planted)
      : null
  const time = planted
    ? round.BombTime - Math.floor((frame.Tick - planted.Tick) / match.TickRate)
    : round.TimeLimit - tickToSecond(match, round, frame.Tick)
  return Math.max(0, time)
}

function frameToColor(this: Theme, frame: Frame): string {
  if (frame.Bomb.State & BombState.Planted) return this.palette.warning.main
  return this.palette.grey[600]
}

function labelFormat(match: Match, round: Round, frame: Frame | undefined) {
  if (!frame) return
  const time = frameToTime(match, round, frame)
  if (Number.isNaN(time)) return
  return new Date(time * 1000).toISOString().slice(14, 19)
}

const MarkerLabel = styled(Typography)`
  font-size: 14px !important;
  font-family: monospace;
  letter-spacing: -1px;
`

const Icon = styled(FontAwesomeIcon)`
  position: relative;
  top: -27px;
`
