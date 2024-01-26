import React from "react"
import { useParams } from "react-router-dom"

import sample from "../../../static/sample.dem.json?url"
import { AppContext, AppState } from "../app"
import { MatchView } from "../demo/MatchView"
import { openDemo } from "../demo/io"
import { useLocationState } from "../hooks/useLocationState"

export const DemoPage: React.FC<{ path?: string }> = ({ path }) => {
  const state = useLocationState<AppState>()
  const { "*": paramPath } = useParams<"*">()
  const { match, setMatch } = React.useContext(AppContext)
  React.useEffect(() => {
    if (!state.match)
      void Promise.resolve(paramPath === "sample" ? sample : path || paramPath)
        .then(openDemo)
        .then(setMatch)
  }, [path, paramPath])
  return <MatchView match={state.match ?? match} />
}
