import { faBomb, faTimes, faTools } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider, { Mark } from "@material-ui/core/Slider";
import { uniqBy } from "lodash";
import React from "react";
import styled from "styled-components";
import { BombState, TeamColor, bombColor } from ".";

export const DemoSlider: React.FC<{
  match: Match;
  round: Round;
  currentRound: number;
  currentFrame: number;
  setCurrentFrame: (i: number) => void;
}> = function({ match, round, currentRound, currentFrame, setCurrentFrame }) {
  const marks = React.useMemo(
    () => [
      ...round.Frames.reduce<Frame[]>(
        (a, b) =>
          tickToTime(a[a.length - 1]?.Tick) != tickToTime(b.Tick)
            ? a.concat(b)
            : a,
        []
      )
        .filter((_, i) => !(i % 10))
        .map<Mark>(e => ({
          value: round.Frames.indexOf(e),
          label: <MarkerLabel>{tickToTime(e.Tick)}</MarkerLabel>
        })),
      ...round.Frames.filter(e => e.Bomb.State === BombState.Planted)
        .slice(0, 1)
        .map(e => ({
          value: findIndex(round.Frames, f => f.Tick > e.Tick),
          label: (
            <Icon
              style={{ color: bombColor(e.Bomb.State) }}
              icon={faBomb}></Icon>
          )
        })),
      ...round.Frames.filter(e => e.Bomb.State === BombState.Defused)
        .slice(0, 1)
        .map(e => ({
          value: findIndex(round.Frames, f => f.Tick > e.Tick),
          label: <Icon style={{ color: TeamColor[3] }} icon={faTools}></Icon>
        })),
      ...round.Frames.filter(e => e.Bomb.State === BombState.Exploded)
        .slice(0, 1)
        .map(e => ({
          value: findIndex(round.Frames, f => f.Tick > e.Tick),
          label: (
            <Icon
              style={{ color: bombColor(e.Bomb.State) }}
              icon={faBomb}></Icon>
          )
        })),
      ...match.KillEvents.filter(e => e.Round == currentRound).map(e => ({
        value: findIndex(round.Frames, f => f.Tick > e.Tick),
        label: <Icon style={{ color: TeamColor[e.Team] }} icon={faTimes}></Icon>
      }))
    ],
    [currentRound]
  );
  function tickToSecond(tick: number) {
    return ((tick || 0) - round.Frames[0].Tick) / match.TickRate;
  }
  function tickToTime(tick: number) {
    return new Date(tickToSecond(tick) * 1000).toISOString().substr(14, 5);
  }
  return (
    <StyledSlider
      value={currentFrame}
      max={round.Frames.length - 1}
      onChange={(_, value) => setCurrentFrame(value as number)}
      marks={uniqBy(marks, "value")}
      valueLabelDisplay="on"
      valueLabelFormat={e => tickToTime(round.Frames[e].Tick)}
    />
  );
};

function findIndex(frames: Frame[], fn: (f: Frame) => boolean) {
  const index = frames.findIndex(fn);
  return index == -1 ? frames.length - 1 : index;
}

const StyledSlider = styled(Slider)``;

const MarkerLabel = styled.span`
  color: #666;
  font-size: 14px !important;
  letter-spacing: -1px;
`;

const Icon = styled(FontAwesomeIcon)`
  position: relative;
  top: -21px;
`;
