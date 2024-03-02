import { createStore, useStore } from "zustand"

import { findFrame, findRound } from "../demo"
import { isArchiveFile, isValidFile, openDemo } from "../demo/io"

export type MatchState = {
  file?: File
  files?: File[]
  output: string[]
  setOutput: React.Dispatch<string>
  setFiles: React.Dispatch<File[] | FileList | null | undefined>
  matchs: Match[]
  match?: Match | null
  round?: Round | null
  frame?: Frame | null
  paused: boolean
  currentFrame: number
  setMatch: React.Dispatch<Match | null | undefined>
  setRound: React.Dispatch<Round | number | null | undefined>
  setFrame: React.Dispatch<Frame | number | null | undefined>
  setTick: React.Dispatch<number | undefined>
  selectMatch: React.Dispatch<Match>
  changeTick: React.Dispatch<{ Tick: number | undefined }>
  toggle(value?: boolean): void
}

export function useMatch(): MatchState
export function useMatch<T>(selector: (state: MatchState) => T): T
export function useMatch<T>(selector?: (state: MatchState) => T) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useStore(matchStore, selector!)
}

export const matchStore = createStore<MatchState>((set, get) => ({
  paused: true,
  currentFrame: 0,
  output: [],
  matchs: [],
  setOutput: (log) => set(({ output }) => ({ output: output.concat(log) })),
  setFiles: (files) =>
    set(() => {
      if (files === null) files = undefined
      if (files instanceof FileList) files = [...(files || [])]
      const head = files?.at(0)
      if (isValidFile(head) || isArchiveFile(head)) {
        void openDemo(head, get().setOutput, get().setMatch).then((match) =>
          get().setMatch(match),
        )
        return { files, file: head }
      }
      return { files }
    }),
  setMatch: (match) =>
    set(() => {
      if (!match) return { match }
      else if (!get().match || match.UUID === get().match?.UUID)
        get().selectMatch(match)
      return {
        matchs: [match, ...get().matchs.filter((e) => e.UUID !== match.UUID)],
      }
    }),
  selectMatch: (match) => {
    const round = get().round
    const frame = get().frame
    set({
      match,
      round: round ? findRound(match, round.Tick) : match.Rounds?.at(0),
      frame: frame
        ? findFrame(match, frame.Tick)
        : match.Rounds?.at(0)?.Frames?.at(0),
    })
  },
  setRound: (round) =>
    typeof round === "number"
      ? get().setRound(
          get().match?.Rounds?.at(Math.max(0, round)) ?? get().round,
        )
      : set(() => ({
          round,
          frame: round?.Frames[0],
          currentFrame: 0,
        })),
  setFrame: (frame) =>
    typeof frame === "number"
      ? get().setFrame(
          get().round?.Frames.at(Math.max(0, frame)) ?? get().frame,
        )
      : set(({ round }) => ({
          frame,
          currentFrame: frame ? round?.Frames.indexOf(frame) ?? 0 : 0,
        })),
  setTick: (tick) =>
    set(({ match }) => ({
      round: findRound(match, tick),
      frame: findFrame(match, tick),
    })),
  changeTick: ({ Tick }) => get().setTick(Tick),
  toggle(value) {
    set({ paused: value ?? !get().paused })
  },
}))
