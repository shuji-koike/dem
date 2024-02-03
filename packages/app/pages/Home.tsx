import { Alert, Box } from "@mui/material"
import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"
import { useLocation, useNavigate } from "react-router"

import { BrowserAlert } from "../components/BrowserAlert"
import { DemoFilePicker } from "../demo/DemoFilePicker"
import { MatchView } from "../demo/MatchView"
import { openDemo } from "../demo/io"
import { useDropFile } from "../hooks/useDropFile"
import { useFiles } from "../hooks/useFiles"
import { useMatch } from "../hooks/useMatch"

export const Home: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { match, setMatch } = useMatch()
  const { file, setFiles, output, setOutput } = useFiles()
  useDropFile(setFiles)
  React.useEffect(() => {
    if (!file) return
    logEvent(getAnalytics(), "openDemo", { name: file.name })
    void openDemo(file, setOutput, setMatch).then(setMatch)
  }, [file])
  React.useEffect(() => {
    if (match) setMatch(undefined)
  }, [location.pathname])
  return match?.Rounds?.length ? (
    <MatchView />
  ) : (
    <article>
      <BrowserAlert />
      <Alert>
        <Box marginBottom={2}>
          Drag and drop a ".dem" file into this window.
          <br /> Or click the button below and select a ".dem" file.
        </Box>
        <DemoFilePicker />
      </Alert>
      {import.meta.env.DEV && (
        <nav className="debug">
          <button onClick={() => navigate("/dem/sample")}>
            Open a sample File
          </button>
        </nav>
      )}
      {output.length > 0 && (
        <pre css={{ fontSize: 12, color: "darkgreen" }}>
          <p>Parsing DEM file {file?.name}</p>
          {output.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </pre>
      )}
    </article>
  )
}
