import { Alert } from "@mui/lab"
import { getAnalytics, logEvent } from "firebase/analytics"
import React from "react"
import { isChrome } from "react-device-detect"
import { useNavigate } from "react-router"

import { AppContext } from "../app"
import { FilePicker } from "../demo/FilePicker"
import { MatchView } from "../demo/MatchView"
import { storagePutPublicMatch } from "../demo/io"

export const Home: React.VFC = () => {
  const navigate = useNavigate()
  const { match } = React.useContext(AppContext)
  React.useEffect(() => {
    if (match) logEvent(getAnalytics(), "view_item")
  }, [match])
  return match ? (
    <MatchView match={match} />
  ) : (
    <article>
      {isChrome || (
        <Alert color="warning">Only Google Chrome is supported!</Alert>
      )}
      <p>Click the button below and select a DEM file.</p>
      <FilePicker onLoad={storagePutPublicMatch} />
      {import.meta.env.DEV && (
        <nav className="debug">
          <button onClick={() => navigate("/sample")}>
            Open a sample File
          </button>
        </nav>
      )}
    </article>
  )
}
