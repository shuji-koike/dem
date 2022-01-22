import React from "react"

import { openDemo, isValidFile } from "./io"

export const DemoFilePicker: React.VFC<{
  setMatch?: (match: Match | null) => void
  onLoad?: (match: Match, name: string) => void
}> = ({ setMatch, onLoad }) => {
  const [output, setOutput] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>()
  React.useEffect(() => {
    const file = files && files[0]
    if (!file) return
    if (!isValidFile(file)) return console.error("invalid file")
    openDemo(file, setOutput, setMatch).then((match) => {
      setMatch?.(match)
      if (match) onLoad?.(match, file.name)
    })
  }, [files])
  return (
    <>
      <input
        type="file"
        accept=".dem,.json,.gz"
        disabled={!!files?.length}
        onChange={(e) => setFiles([...(e.currentTarget.files || [])])}
      />
      {output.length > 0 && (
        <pre>
          <p>Converting DEM file `{files?.[0]?.name}`</p>
          {output}
        </pre>
      )}
    </>
  )
}
