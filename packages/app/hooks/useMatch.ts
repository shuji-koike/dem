import { create } from "zustand"

import { findFrame, findRound } from "../demo"
import { isArchiveFile, isValidFile, openDemo, rarList } from "../demo/io"

export type MatchState = {
  file?: File
  files?: File[]
  output: string[]
  setOutput: React.Dispatch<string>
  setFiles: React.Dispatch<File[] | FileList | null | undefined>
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

export const useMatch = create<MatchState>((set, get) => ({
  currentRound: 0,
  currentFrame: 0,
  output: [],
  setOutput: (log) => set(({ output }) => ({ output: output.concat(log) })),
  setFiles: (files) =>
    set(({ setFiles, setMatch }) => {
      if (files === null) files = undefined
      if (files instanceof FileList) files = [...(files || [])]
      const head = files?.at(0)
      if (isValidFile(head)) {
        void openDemo(head, get().setOutput, setMatch).then(setMatch)
        return { files, file: head }
      } else if (isArchiveFile(head)) {
        void rarList(head).then(setFiles)
        return { files, file: head }
      }
      return { files }
    }),
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
  setTick: (tick) =>
    set(({ match }) => ({
      tick,
      round: findRound(match, tick),
      frame: findFrame(match, tick),
    })),
  changeTick: ({ Tick }) => get().setTick(Tick),
}))

export function createMatchState(): Partial<MatchState> {
  return {
    currentRound: 0,
    currentFrame: 0,
  }
}
