import React from "react"
import { isChrome } from "react-device-detect"
import { openDemo, pickDir } from "../store/io"
import { Match } from "./Match"

export const Sandbox: React.VFC = () => {
  const [match, setMatch] = React.useState<Match | null>(null)
  const [output, setOutput] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>([])
  return match ? (
    <Match match={match} />
  ) : (
    <main>
      <h1>CSGO Demo Viewer</h1>
      {isChrome || (
        <p>
          <strong style={{ color: "red" }}>
            Only Google Chrome is supported!
          </strong>
        </p>
      )}
      <p>Click the button below and select a DEM file.</p>
      <button onClick={() => openDemo("/static/sample.json").then(setMatch)}>
        Open a sample File
      </button>
      <button onClick={() => pickDir().then(setFiles)}>Open a Directory</button>
      <input
        type="file"
        accept=".dem,.json"
        disabled={output.length > 0}
        onChange={e =>
          openDemo(e.currentTarget.files?.[0] ?? null, setOutput).then(setMatch)
        }
      />
      {output.length > 0 && (
        <pre>
          Wait patiently. It may take up to few minutes.
          {output.join("\n")}
        </pre>
      )}
      {files.length > 0 && (
        <ul>
          {files.map(file => (
            <li
              key={file.name}
              onClick={() => openDemo(file, setOutput).then(setMatch)}
              style={{ cursor: "pointer" }}>
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export const SampleMatch: React.VFC = () => <Match path="/static/sample.json" />
