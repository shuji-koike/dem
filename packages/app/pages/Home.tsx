import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"
import { useLocation, useNavigate } from "react-router"

import { BrowserAlert } from "../components/BrowserAlert"
import { DemoFilePicker } from "../demo/DemoFilePicker"
import { MatchView } from "../demo/MatchView"
import { isValidFile, openDemo } from "../demo/io"
import { useDrragAndDropFile } from "../hooks/useDrragAndDropFile"
import { useMatch } from "../store/useMatch"

export const Home: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { match, setMatch } = useMatch()
  useDrragAndDropFile(async (files) => {
    if (isValidFile(files[0]))
      setMatch(await openDemo(files[0], console.debug, setMatch))
  })
  React.useEffect(() => {
    if (match) setMatch(undefined)
  }, [location.pathname])
  return match && match.Rounds?.length ? (
    <MatchView />
  ) : (
    <article>
      <p>Drag and drop a ".dem" file into this window.</p>
      <p>Or click the button below and select a ".dem" file.</p>
      <DemoFilePicker
        setMatch={setMatch}
        onLoad={() => logEvent(getAnalytics(), "DemoFilePicker:onLoad")}
      />
      <BrowserAlert />
      {import.meta.env.DEV && (
        <nav className="debug">
          <button onClick={() => navigate("/dem/sample")}>
            Open a sample File
          </button>
        </nav>
      )}
    </article>
  )
}
