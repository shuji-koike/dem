import { css } from "@emotion/react"
import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"
import { useLocation } from "react-router"

import { BrowserAlert } from "../components/BrowserAlert"
import { FilePicker } from "../demo/DemoFilePicker"
import { MatchView } from "../demo/MatchView"
import { openDemo } from "../demo/io"
import { useDropFile } from "../hooks/useDropFile"
import { useFiles } from "../hooks/useFiles"
import { useMatch } from "../hooks/useMatch"

export const Home: React.FC = () => {
  const location = useLocation()
  const { match, setMatch } = useMatch()
  const { file, setFiles, setOutput } = useFiles()
  useDropFile(setFiles)
  React.useEffect(() => {
    if (!file || match) return
    logEvent(getAnalytics(), "openDemo", { name: file.name })
    void openDemo(file, setOutput, setMatch).then(setMatch)
  }, [file])
  React.useEffect(() => {
    if (!file && match) setMatch(undefined)
  }, [location.pathname])
  return match?.Rounds?.length ? (
    <MatchView />
  ) : (
    <article css={style}>
      <BrowserAlert />
      <FilePicker />
    </article>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
