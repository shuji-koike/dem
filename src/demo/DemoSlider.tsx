import { faBomb, faTimes, faTools } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Slider from "@material-ui/core/Slider"
import { uniqBy } from "lodash"
import React from "react"
import styled from "styled-components"
import { BombState, TeamColor, bombColor } from "."

export const DemoSlider: React.FC<{
  match: Match
  round: Round
  frame: Frame
  setCurrentFrame: (i: number) => void
}> = function ({ match, round, frame, setCurrentFrame }) {
  const marks = React.useMemo(
    () => [
      ...round.Frames.filter(e => e.Bomb.State & BombState.Planted)
        .slice(0, 1)
        .map(e => ({
          value: round.Frames.indexOf(e),
          label: (
            <Icon
              style={{ color: bombColor(e.Bomb.State) }}
              icon={faBomb}></Icon>
          ),
        })),
      ...round.Frames.filter(e => e.Bomb.State & BombState.Defused)
        .slice(0, 1)
        .map(e => ({
          value: round.Frames.indexOf(e),
          label: <Icon style={{ color: TeamColor[3] }} icon={faTools}></Icon>,
        })),
      ...round.Frames.filter(e => e.Bomb.State & BombState.Exploded)
        .slice(0, 1)
        .map(e => ({
          value: round.Frames.indexOf(e),
          label: (
            <Icon
              style={{ color: bombColor(e.Bomb.State) }}
              icon={faBomb}></Icon>
          ),
        })),
      ...round.Frames.filter(
        (e, i, arr) =>
          !(frameToTime(e) % 5) &&
          arr.find(f => frameToTime(f) === frameToTime(e)) === e
      ).map(e => ({
        value: round.Frames.indexOf(e),
        label: <MarkerLabel>{labelFormat(e)}</MarkerLabel>,
      })),
      ...match.KillEvents.filter(e => e.Round == round.Round).map(e => ({
        value: findIndex(round.Frames, f => f.Tick >= e.Tick),
        label: (
          <Icon style={{ color: TeamColor[e.Team] }} icon={faTimes}></Icon>
        ),
      })),
    ],
    [match, round]
  )
  function tickToSecond(tick: number) {
    return ((tick || 0) - round.Frames[0].Tick) / match.TickRate
  }
  function frameToTime(frame: Frame) {
    return frame.Bomb.State & BombState.Planted
      ? Math.floor(
          (frame.Tick -
            round.Frames.find(e => e.Bomb.State & BombState.Planted)?.Tick!) /
            match.TickRate
        )
      : round.TimeLimit - tickToSecond(frame.Tick)
  }
  function labelFormat(frame: Frame) {
    return frame.Bomb.State & BombState.Planted
      ? frameToTime(frame)
      : new Date(frameToTime(frame) * 1000).toISOString().substr(14, 5)
  }
  return (
    <Slider
      value={round.Frames.indexOf(frame)}
      max={round.Frames.length - 1}
      onChange={(_, value) => setCurrentFrame(value as number)}
      marks={uniqBy(marks, "value")}
      valueLabelDisplay="auto"
      valueLabelFormat={e => labelFormat(round.Frames[e])}
    />
  )
}

function findIndex(frames: Frame[], fn: (f: Frame) => boolean) {
  const index = frames.findIndex(fn)
  return index == -1 ? frames.length - 1 : index
}

const MarkerLabel = styled.span`
  color: #666;
  font-size: 14px !important;
  font-family: monospace;
  letter-spacing: -1px;
`
const Icon = styled(FontAwesomeIcon)`
  position: relative;
  top: -19px;
`
