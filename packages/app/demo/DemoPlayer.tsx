import { css } from "@emotion/react"
import React from "react"

import { Team } from "."
import { DemoNav } from "./DemoNav"
import { DemoScore } from "./DemoScore"
import { DemoSlider } from "./DemoSlider"
import { FrameView, TrailView } from "./FrameView"
import { MapEventView } from "./MapEventView"
import { MapView } from "./MapView"
import { PlayerList } from "./PlayerList"
import { HeaderSlot } from "../components/layout"
import { useMatch } from "../hooks/useMatch"

export const DemoPlayer: React.FC = () => {
  const { match, round, frame, currentFrame, setRound, setFrame, setTick } =
    useMatch()
  const [state, setState] = React.useState({ paused: true })
  const ref = React.createRef<HTMLFormElement>()
  React.useEffect(() => ref.current?.focus(), [ref.current])
  React.useEffect(() => {
    return cancelAnimationFrame.bind(
      null,
      requestAnimationFrame(function render() {
        if (!paused) setFrame(currentFrame + 1)
      }),
    )
  }, [currentFrame, paused])
  React.useEffect(() => {
    document.body.style.overscrollBehavior = "none"
    return () => void (document.body.style.overscrollBehavior = "auto")
  }, [])
  function onKeyUp(e: React.KeyboardEvent) {
    const dict: { [key: string]: () => void } = {
      ArrowUp: () => setRound((round?.Round ?? 0) - 1),
      ArrowDown: () => setRound((round?.Round ?? 0) + 1),
      ArrowLeft: () => setFrame(currentFrame - 1),
      ArrowRight: () => setFrame(currentFrame + 1),
      Escape: () => setTick?.(undefined),
      p: () => console.info(match),
      q: () => setTick?.(undefined),
      r: () => console.info(round),
      x: () => console.info(frame),
      " ": () => setState({ ...state, paused: !state.paused }),
    }
    const keyRound = Number(e.key) - 1 + (e.key ? 0 : 10) + (e.ctrlKey ? 10 : 0)
    if (Number.isInteger(parseInt(e.key))) setRound(keyRound)
    else {
      dict[e.key]?.()
      e.preventDefault()
    }
  }
  function onWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaX) < 10) {
      if (e.deltaY < 0) setFrame(currentFrame + 1)
      if (e.deltaY > 0) setFrame(currentFrame - 1)
      e.stopPropagation()
    }
  }
  if (!match) return null
  return (
    <form
      ref={ref}
      tabIndex={0}
      onKeyUp={onKeyUp}
      onWheel={onWheel}
      onSubmit={(e) => e.preventDefault()}
      css={style}
    >
      <div css={backdrop} />
      <HeaderSlot>
        <DemoNav />
      </HeaderSlot>
      <article>
        <MapView>
          <TrailView />
          <FrameView />
          <MapEventView />
        </MapView>
      </article>
      <aside>
        <PlayerList team={Team.CounterTerrorists} />
      </aside>
      <aside>
        <PlayerList team={Team.Terrorists} />
      </aside>
      <DemoScore />
      <footer>
        {round && frame && <DemoSlider />}
        <pre>
          index:{currentFrame}, frame:{frame?.Frame}, tick:{frame?.Tick}
        </pre>
      </footer>
    </form>
  )
}

const style = css`
  display: flex;
  flex-wrap: wrap;
  outline: none;
  color: #fff;
  > article {
    position: fixed;
    inset: 0;
    margin: auto;
    width: 100vh;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vw;
  }
  > aside {
    position: fixed;
    padding: 8px;
    width: 240px;
  }
  > aside + aside {
    right: 0;
  }
  // FIXME
  > aside + aside > * > * > * {
    flex-direction: row-reverse;
  }
  > aside > * {
    backdrop-filter: blur(1px);
    filter: drop-shadow(0 0 4px rgba(18, 18, 18, 0.5));
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
