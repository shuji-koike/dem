import { css } from "@emotion/react"
import { Alert } from "@mui/material"
import React from "react"

import { useFiles } from "../hooks/useFiles"

export const DemoFilePicker: React.FC = () => {
  const { files, setFiles } = useFiles()
  return (
    <div css={styles}>
      <input
        type="file"
        accept=".dem,.rar,.json,.gz"
        disabled={!!files?.length}
        onChange={(e) => setFiles(e.currentTarget.files)}
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
    </div>
  )
}

const styles = css`
  label > input + span {
    cursor: pointer;
  }
`
