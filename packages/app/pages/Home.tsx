import { Alert } from "@mui/lab"
import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"
import { isChrome } from "react-device-detect"
import { useLocation, useNavigate } from "react-router"

import { AppContext } from "../app"
import { DemoFilePicker } from "../demo/DemoFilePicker"
import { MatchView } from "../demo/MatchView"
import { storagePutPublicMatch } from "../demo/io"

export const Home: React.VFC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { match, setMatch } = React.useContext(AppContext)
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
      {isChrome || (
        <Alert color="warning">Only Google Chrome is supported!</Alert>
      )}
      <p>Click the button below and select a DEM file.</p>
      <DemoFilePicker
        setMatch={setMatch}
        onLoad={async (match, name) => {
          const path = /\.dem$/i.test(name)
            ? await storagePutPublicMatch(match, name)
            : name
          navigate(`/dem/${path}`, { state: { match } })
        }}
      />
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
