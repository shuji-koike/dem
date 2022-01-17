import { Alert } from "@mui/lab"
import React, { useEffect } from "react"
import { isChrome } from "react-device-detect"
import { useNavigate } from "react-router"

import { HeaderSlot } from "../components/layout"
import { Match } from "../demo/Match"
import { useFileDrop } from "../hooks"
import { openDemo } from "../io"

export const Home: React.VFC = () => {
  const navigate = useNavigate()
  const [match, setMatch] = React.useState<Match | null>(null)
  const [output, setOutput] = React.useState<string[]>([])
  const [file, setFile] = React.useState<File>()
  useEffect(() => {
    if (file) openDemo(file, setOutput, setMatch).then(setMatch)
  }, [file])
  useFileDrop(setFile)
  return match ? (
    <Match match={match} />
  ) : (
    <main>
      <HeaderSlot>
        <h1>CSGO Demo Viewer</h1>
      </HeaderSlot>
      {isChrome || (
        <Alert color="warning">Only Google Chrome is supported!</Alert>
      )}
      {import.meta.env.DEV && (
        <button onClick={() => navigate("/sample")}>Open a sample File</button>
      )}
      <p>Click the button below and select a DEM file.</p>
      <input
        type="file"
        accept=".dem,.json,.gz"
        disabled={output.length > 0}
        onChange={(e) =>
          [...(e.currentTarget.files || [])].slice(0, 1).forEach(setFile)
        }
      />
      {output.length > 0 && (
        <pre>
          <p>Wait patiently. May take up to few minutes.</p>
          {output.join("\n")}
        </pre>
      )}
    </main>
  )
}
