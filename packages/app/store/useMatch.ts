import { create } from "zustand"

import { findFrame, findRound } from "../demo"

export const useMatch = create<{
  match?: Match | null
  round?: Round | null
  frame?: Frame | null
  tick?: number
  setMatch: React.Dispatch<Match | null | undefined>
  setRound: React.Dispatch<Round | null | undefined>
  setFrame: React.Dispatch<Frame | null | undefined>
  setTick: React.Dispatch<number | undefined>
  changeTick: React.Dispatch<{ Tick: number | undefined }>
  currentRound: number
  currentFrame: number
}>((set) => ({
  currentRound: 0,
  currentFrame: 0,
  setMatch: (match) =>
    set(({ round, frame }) => ({
      match,
      round: match && !round ? match?.Rounds?.at(0) : round,
      frame: match && !frame ? match?.Rounds?.at(0)?.Frames.at(0) : frame,
    })),
  setRound: (round) =>
    set(() => ({
      round,
      frame: round?.Frames[0],
      currentRound: round?.Round ?? 0,
      currentFrame: 0,
    })),
  setFrame: (frame) =>
    set(({ round }) => ({
      frame,
      currentFrame: frame ? round?.Frames.indexOf(frame) ?? 0 : 0,
    })),
  changeTick: ({ Tick: tick }) =>
    set(({ match }) => ({
      tick,
      round: findRound(match, tick),
      frame: findFrame(match, tick),
    })),
  setTick: (tick) => set(() => ({ tick })),
}))
