import { create } from "zustand"

import { findFrame, findRound } from "../demo"

export type MatchState = {
  match?: Match | null
  round?: Round | null
  frame?: Frame | null
  tick?: number
  currentRound: number
  currentFrame: number
  setMatch: React.Dispatch<Match | null | undefined>
  setRound: React.Dispatch<Round | null | undefined>
  setFrame: React.Dispatch<Frame | null | undefined>
  setTick: React.Dispatch<number | undefined>
  changeTick: React.Dispatch<{ Tick: number | undefined }>
}

export const useMatch = create<MatchState>((set) => ({
  currentRound: 0,
  currentFrame: 0,
  setMatch: (match) =>
    set(({ currentRound, currentFrame }) =>
      match
        ? {
            match,
            round: match.Rounds?.at(currentRound),
            frame: match.Rounds?.at(currentRound)?.Frames.at(currentFrame),
          }
        : createMatchState(),
    ),
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

export function createMatchState(): Partial<MatchState> {
  return {
    currentRound: 0,
    currentFrame: 0,
  }
}
