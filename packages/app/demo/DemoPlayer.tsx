import { css } from "@emotion/react"
import React from "react"

import { findRound, findFrame } from "."
import { DemoMenu } from "./DemoMenu"
import { DemoNav } from "./DemoNav"
import { DemoSlider } from "./DemoSlider"
import { FrameView, TrailView } from "./FrameView"
import { MapEventView } from "./MapEventView"
import { MapView } from "./MapView"
import { HeaderSlot } from "../components/layout"

export const DemoPlayer: React.FC<{
  match: Match
  tick?: number
  setTick?: (tick: number | undefined) => void
}> = ({ match, tick, setTick }) => {
  const [state, setState] = React.useState({ paused: true, wheel: true })
  const [round, setRound] = React.useState(findRound(match, tick))
  const [frame, setFrame] = React.useState(findFrame(match, tick))
  const [filter, setFilter] = React.useState<Filter>({})
  const ref = React.createRef<HTMLFormElement>()
  const currentRound = round?.Round || 0
  const currentFrame = frame ? round?.Frames.indexOf(frame) || 0 : 0
  React.useEffect(() => {
    if (frame && !round?.Frames.includes(frame)) setFrame(round?.Frames[0])
  }, [round])
  React.useEffect(() => ref.current?.focus(), [ref.current])
  React.useEffect(() => {
    return clearTimeout.bind(
      window,
      setTimeout(
        () => !state.paused && setCurrentFrame(currentFrame + 1),
        1000 / 8,
      ),
    )
  }, [])
  React.useEffect(() => {
    document.body.style.overscrollBehavior = "none"
    return () => void (document.body.style.overscrollBehavior = "auto")
  }, [])
  function setCurrentFrame(n: number) {
    const frame = round?.Frames[n]
    if (frame) setFrame(frame)
  }
  function setCurrentRound(n: number) {
    const round = match.Rounds?.find((e) => e.Round === n)
    if (round) {
      setFrame(round.Frames[0])
      setRound(round)
    }
  }
  const changeTick = React.useCallback(
    function changeTick({ Tick }: { Tick: number | undefined }) {
      setRound(findRound(match, Tick))
      setFrame(findFrame(match, Tick))
      setTick?.(Tick)
    },
    [match, setTick],
  )
  function onKeyDown(e: React.KeyboardEvent) {
    const dict: { [key: string]: () => void } = {
      ArrowUp: () => setCurrentRound(currentRound - 1),
      ArrowDown: () => setCurrentRound(currentRound + 1),
      ArrowLeft: () => setCurrentFrame(currentFrame - 1),
      ArrowRight: () => setCurrentFrame(currentFrame + 1),
      Escape: () => setTick?.(undefined),
      q: () => setTick?.(undefined),
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
  return (
    <form
      ref={ref}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onSubmit={(e) => e.preventDefault()}
      css={style}
    >
      <div css={backdrop} />
      <HeaderSlot>
        <DemoNav match={match} round={round} onChange={setRound} />
      </HeaderSlot>
      <article>
        <MapView match={match}>
          <TrailView round={round} />
          <FrameView frame={frame} />
          <MapEventView
            match={match}
            round={round}
            filter={filter}
            changeTick={changeTick}
          />
        </MapView>
      </article>
      <aside>
        <DemoMenu
          match={match}
          round={round}
          frame={frame}
          setTick={(Tick) => changeTick({ Tick })}
          filter={filter}
          setFilter={setFilter}
        />
      </aside>
      <footer>
        {round && frame && (
          <DemoSlider
            match={match}
            round={round}
            frame={frame}
            setFrame={setFrame}
          />
        )}
        <pre>
          index:{currentFrame}, frame:{frame?.Frame}, tick:{frame?.Tick}
        </pre>
      </footer>
    </form>
  )
}

export interface Filter {
  players?: (e: Player) => boolean
  kills?: (e: KillEvent) => boolean
  nades?: (e: NadeEvent) => boolean
}

const style = css`
  display: flex;
  flex-wrap: wrap;
  outline: none;
  color: #fff;
  > article {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vh;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vw;
    @media (max-height: 700px) {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  > aside {
    position: fixed;
    top: 72px;
    right: 0px;
    width: 300px;
    padding: 0 8px;
    max-height: calc(100vh - 200px); // FIXME
    overflow-y: auto;
    @media (max-height: 700px) {
      width: 100%;
      > * > nav {
        display: none;
      }
      > * {
        flex-direction: row;
        justify-content: space-between;
      }
      > * > * {
        width: 200px;
      }
    }
  }
  > footer {
    position: fixed;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 8px 32px;
    width: 100%;
  }
  > footer > pre {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 0;
    font-size: 12px;
    color: #222;
  }
`

const backdrop = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`
