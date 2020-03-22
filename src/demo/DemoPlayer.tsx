import React from "react"
import styled from "styled-components"
import { HeaderSlot } from "../Layout"
import { DemoNav } from "./DemoNav"
import { DemoSlider } from "./DemoSlider"
import { FrameView, TrailView } from "./FrameView"
import { MapView } from "./MapView"
import { PlayerCard } from "./PlayerCard"
import { fetchSteamData } from "."

export const DemoPlayer: React.FC<{
  match: Match
  tick?: number
  initFrame?: number
  initRound?: number
  onExit?: () => void
}> = function ({ match, tick, initFrame, initRound, onExit }) {
  initRound =
    tick &&
    match.Rounds?.findIndex(e => e.Frames[e.Frames.length - 1].Tick > tick)
  initFrame =
    tick && match.Rounds?.[initRound || 0]?.Frames.findIndex(e => e.Tick > tick)
  const [state, setState] = React.useState({ paused: true, wheel: false })
  const [currentFrame, _setFrame] = React.useState<number>(initFrame || 0)
  const [currentRound, _setRound] = React.useState<number>(initRound || 0)
  const round = match.Rounds?.[currentRound]
  const frame = round?.Frames?.[currentFrame]
  const [steam, setSteam] = React.useState<any>({})
  const ref = React.createRef<HTMLFormElement>()
  let ids = frame?.Players.map(e => e.ID).sort((a, b) => a - b)
  React.useEffect(() => {
    ids && fetchSteamData(ids).then(e => setSteam({ ...steam, ...e }))
  }, ids)
  React.useEffect(() => ref.current?.focus(), [ref.current])
  React.useEffect(() =>
    clearInterval.bind(
      window,
      setTimeout(
        () => !state.paused && setCurrentFrame(currentFrame + 1),
        1000 / 8
      )
    )
  )
  React.useEffect(() => {
    document.body.style.overscrollBehaviorY = "none"
    return () => void (document.body.style.overscrollBehaviorY = "auto")
  })
  function setCurrentFrame(n: number) {
    _setFrame(Math.min(Math.max(n, 0), (round?.Frames?.length || 1) - 1))
  }
  function setCurrentRound(n: number) {
    _setFrame(0)
    _setRound(Math.min(Math.max(n, 0), (match.Rounds?.length || 1) - 1))
  }
  function onKeyDown(e: React.KeyboardEvent) {
    const dict: { [key: string]: () => void } = {
      ArrowUp: () => setCurrentRound(currentRound - 1),
      ArrowDown: () => setCurrentRound(currentRound + 1),
      ArrowLeft: () => setCurrentFrame(currentFrame - 1),
      ArrowRight: () => setCurrentFrame(currentFrame + 1),
      Escape: () => onExit?.(),
      q: () => onExit?.(),
      x: () => console.info(frame),
      " ": () => setState({ ...state, paused: !state.paused }),
    }
    dict[e.key]?.()
  }
  function onWheel(e: React.WheelEvent) {
    if (state.wheel && Math.abs(e.deltaX) < 10) {
      if (e.deltaY < 0) setCurrentFrame(currentFrame + 1)
      if (e.deltaY > 0) setCurrentFrame(currentFrame - 1)
      e.stopPropagation()
    }
  }
  if (!round || !frame) return null //TODO
  return (
    <StyledForm ref={ref} tabIndex={0} onKeyDown={onKeyDown} onWheel={onWheel}>
      <HeaderSlot deps={[currentRound]}>
        <DemoNav
          match={match}
          round={round}
          onChange={e => setCurrentRound(match.Rounds?.indexOf(e)!)}
        />
      </HeaderSlot>
      <main>
        <MapView match={match}>
          <TrailView round={round} currentFrame={currentFrame} />
          <FrameView frame={frame} />
        </MapView>
      </main>
      <aside>
        {frame.Players.map(e => (
          <PlayerCard key={e.ID} player={e} steam={steam[e.ID]} />
        ))}
      </aside>
      <footer>
        <DemoSlider
          match={match}
          round={round}
          frame={frame}
          setCurrentFrame={setCurrentFrame}></DemoSlider>
        <pre>
          index:{currentFrame}, frame:{frame.Frame}, tick:{frame.Tick}
        </pre>
      </footer>
    </StyledForm>
  )
}

const StyledForm = styled.form`
  position: relative;
  outline: none;
  color: #fff;
  > main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vh;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vw;
  }
  > aside {
    position: fixed;
    top: 60px;
    right: 0;
    width: 250px;
  }
  > footer {
    position: fixed;
    left: 0;
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
`
