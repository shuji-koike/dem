import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { DemoNav } from "./DemoNav";
import { DemoSlider } from "./DemoSlider";
import { FrameView, TrailView } from "./FrameView";
import { MapView } from "./MapView";
import { PlayerCard } from "./PlayerCard";
import { fetchSteamData } from ".";

export const DemoPlayer: React.FC<{
  match: Match;
}> = function({ match }) {
  const history = useHistory();
  const [state, setState] = React.useState({ paused: true, wheel: false });
  const [currentFrame, setCurrentFrameUnsafe] = React.useState<number>(0);
  const [currentRound, setCurrentRoundUnsafe] = React.useState<number>(0);
  const round = match.Rounds?.[currentRound];
  const frame = round?.Frames?.[currentFrame];
  const [steam, setSteam] = React.useState<any>({});
  const ref = React.createRef<HTMLFormElement>();
  if (!round || !frame || !frame.Players) return null; //TODO
  React.useEffect(() => ref.current?.focus(), []);
  React.useEffect(() =>
    clearInterval.bind(
      window,
      setTimeout(
        () => !state.paused && setCurrentFrame(currentFrame + 1),
        1000 / 32
      )
    )
  );
  React.useEffect(() => {
    document.body.style.overscrollBehaviorY = "none";
    return () => void (document.body.style.overscrollBehaviorY = "auto");
  });
  let ids = frame.Players.map(e => e.ID).sort((a, b) => a - b);
  React.useEffect(() => {
    fetchSteamData(ids).then(e => setSteam({ ...steam, ...e }));
  }, [ids]);
  function onKeyDown(e: React.KeyboardEvent) {
    const dict: { [key: string]: () => void } = {
      ArrowUp: () => setCurrentRound(currentRound - 1),
      ArrowDown: () => setCurrentRound(currentRound + 1),
      ArrowLeft: () => setCurrentFrame(currentFrame - 1),
      ArrowRight: () => setCurrentFrame(currentFrame + 1),
      Escape: () => history.goBack(),
      q: () => history.goBack(),
      " ": () => setState({ ...state, paused: !state.paused })
    };
    dict[e.key]?.();
  }
  function onWheel(e: React.WheelEvent) {
    if (state.wheel && Math.abs(e.deltaX) < 10) {
      if (e.deltaY < 0) setCurrentFrame(currentFrame + 1);
      if (e.deltaY > 0) setCurrentFrame(currentFrame - 1);
      e.stopPropagation();
    }
  }
  function setCurrentFrame(n: number) {
    setCurrentFrameUnsafe(
      Math.min(Math.max(n, 0), (round?.Frames?.length || 1) - 1)
    );
  }
  function setCurrentRound(n: number) {
    setCurrentFrameUnsafe(0);
    setCurrentRoundUnsafe(
      Math.min(Math.max(n, 0), (match?.Rounds?.length || 1) - 1)
    );
  }
  return (
    <StyledForm ref={ref} tabIndex={0} onKeyDown={onKeyDown} onWheel={onWheel}>
      <header>
        <DemoNav
          match={match}
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
        />
      </header>
      <main>
        <MapView name={match.MapName} />
        <TrailView round={round} currentFrame={currentFrame} />
        <FrameView frame={frame} />
      </main>
      <aside>
        {frame.Players?.map(e => (
          <PlayerCard key={e.ID} player={e} steam={steam[e.ID]} />
        ))}
      </aside>
      <footer>
        <DemoSlider
          match={match}
          round={round}
          currentRound={currentRound}
          currentFrame={currentFrame}
          setCurrentFrame={setCurrentFrame}></DemoSlider>
        <pre>
          index:{currentFrame}, frame:{frame.Frame}, tick:{frame.Tick}
        </pre>
      </footer>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  position: relative;
  width: 100%;
  height: 100%;
  outline: none;
  color: #fff;
  font-size: 1rem;
  > main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vh;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vw;
  }
  > main > * {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  > main + aside {
    position: fixed;
    top: 32px;
    right: 0;
    width: 250px;
  }
  > header {
    position: fixed;
    top: 0;
    height: 32px;
    z-index: 1000;
  }
  > footer {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    padding: 16px 32px;
    width: 100%;
  }
  > footer > pre {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 0;
    font-size: 16px;
    color: #333;
  }
  table,
  td,
  th {
    border-spacing: 0;
  }
`;
