import { create } from "zustand"

import { isArchiveFile, isValidFile, rarList } from "../demo/io"

export const useFiles = create<{
  file?: File
  files?: File[]
  output: string[]
  setOutput: React.Dispatch<string>
  setFiles: React.Dispatch<File[] | FileList | null | undefined>
}>((set) => ({
  output: [],
  setOutput: (log) => set(({ output }) => ({ output: output.concat(log) })),
  setFiles: (files) =>
    set(({ setFiles }) => {
      if (files === null) files = undefined
      if (files instanceof FileList) files = [...(files || [])]
      const head = files?.at(0)
      const file =
        (files?.filter(isValidFile).length ?? 0) === 1 ? head : undefined
      if (isArchiveFile(head)) void rarList(head).then(setFiles)
      return { files, file }
    }),
}))
