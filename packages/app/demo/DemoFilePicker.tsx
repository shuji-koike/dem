import { css } from "@emotion/react"
import { Alert } from "@mui/material"
import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"

import { isArchiveFile, isValidFile, openDemo, rarList } from "./io"
import { useMatch } from "../hooks/useMatch"

export const DemoFilePicker: React.FC = () => {
  const { setMatch } = useMatch()
  const [output, setOutput] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>()
  const mounted = React.useRef(true)
  React.useEffect(() => {
    const file = files?.at(0)
    if (!file) return
    if (isArchiveFile(file)) return void rarList(file).then(setFiles)
    if (files?.length === 1) {
      if (!isValidFile(file)) return console.error("invalid file")
      logEvent(getAnalytics(), "openDemo", { name: file.name })
      void openDemo(file, setOutput, setMatch).then(setMatch)
    }
    return () => void (mounted.current = false)
  }, [files])
  return (
    <div css={styles}>
      <input
        type="file"
        accept=".dem,.rar,.json,.gz"
        disabled={!!files?.length}
        onChange={(e) => setFiles([...(e.currentTarget.files || [])])}
      />
      {files && files?.length > 1 && (
        <>
          <Alert sx={{ maxWidth: 400 }}>Select a file to extract.</Alert>
          <ul>
            {files.map((e, i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" onChange={() => setFiles([e])} />
                  <span>{e.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      {output.length > 0 && (
        <pre css={{ fontSize: 12, color: "darkgreen" }}>
          <p>Parsing DEM file `{files?.at(0)?.name}`</p>
          {output.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </pre>
      )}
    </div>
  )
}

const styles = css`
  label > input + span {
    cursor: pointer;
  }
`
