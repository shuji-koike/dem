import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"
import { useLocation, useNavigate } from "react-router"

import { AppContext } from "../app"
import { BrowserAlert } from "../components/BrowserAlert"
import { DemoFilePicker } from "../demo/DemoFilePicker"
import { MatchView } from "../demo/MatchView"
import { isValidFile, openDemo, storagePutPublicMatch } from "../demo/io"
import { useDrragAndDropFile } from "../hooks/useDrragAndDropFile"

export const Home: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { match, setMatch } = React.useContext(AppContext)
  useDrragAndDropFile(async (files) => {
    if (isValidFile(files[0]))
      setMatch(await openDemo(files[0], console.debug, setMatch))
  })
  React.useEffect(() => {
    if (match) logEvent(getAnalytics(), "view_item")
  }, [match])
  React.useEffect(() => {
    if (match) setMatch(undefined)
  }, [location.pathname])
  return match ? (
    <MatchView match={match} />
  ) : (
    <article>
      <p>Drag and drop a ".dem" file into this window.</p>
      <p>Or click the button below and select a ".dem" file.</p>
      <DemoFilePicker
        setMatch={setMatch}
        onLoad={async (match, name) => {
          const path = /\.dem$/i.test(name)
            ? await storagePutPublicMatch(match, name)
            : name
          console.info(path)
          // navigate(`/dem/${path}/`, { state: { match } })
        }}
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
