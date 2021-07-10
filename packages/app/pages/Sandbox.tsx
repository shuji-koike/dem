import { Alert } from "@material-ui/lab"
import React from "react"
import { isChrome } from "react-device-detect"
import { useHistory } from "react-router"

import { Match } from "../demo/Match"
import { openDemo, pickDir, fileTypeFilter } from "../io"

export const Sandbox: React.VFC = () => {
  const [match, setMatch] = React.useState<Match | null>(null)
  const [output, setOutput] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>([])
  const history = useHistory()
  return match ? (
    <Match match={match} />
  ) : (
    <main>
      <h1>CSGO Demo Viewer</h1>
      {isChrome || (
        <Alert color="warning">Only Google Chrome is supported!</Alert>
      )}
      <p>Click the button below and select a DEM file.</p>
      <button onClick={() => history.push("/sample")}>
        Open a sample File
      </button>
      <button onClick={() => pickDir().then(setFiles)}>Open a Directory</button>
      <input
        type="file"
        accept=".dem,.json"
        disabled={output.length > 0}
        onChange={(e) =>
          openDemo(e.currentTarget.files?.[0], setOutput).then(setMatch)
        }
      />
      {output.length > 0 && (
        <pre>
          <p>Wait patiently. May take up to few minutes.</p>
          {output.join("\n")}
        </pre>
      )}
      {files.length > 0 && output.length < 1 && (
        <ul>
          {files.filter(fileTypeFilter).map((file) => (
            <li
              key={file.name}
              style={{ cursor: "pointer" }}
              onClick={() => openDemo(file, setOutput).then(setMatch)}
            >
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
