import React from "react"

import { AppContext } from "../app"
import { openDemo } from "./io"

export const FilePicker: React.VFC<{
  onLoad?: (match: Match, name: string) => void
}> = ({ onLoad }) => {
  const { setMatch } = React.useContext(AppContext)
  const [output, setOutput] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>()
  const [file, setFile] = React.useState<File>()
  React.useEffect(() => {
    if (files && files[0]) setFile(files[0])
  }, [files])
  React.useEffect(() => {
    if (file)
      openDemo(file, setOutput, setMatch).then((match) => {
        setMatch(match)
        if (match) onLoad?.(match, file.name)
      })
  }, [file])
  return (
    <>
      <input
        type="file"
        accept=".dem,.json,.gz"
        disabled={output.length > 0}
        onChange={(e) => setFiles([...(e.currentTarget.files || [])])}
      />
      {output.length > 0 && (
        <pre>
          <p>Converting DEM file `{files?.[0]?.name}`</p>
          {output.join("\n")}
        </pre>
      )}
    </>
  )
}
