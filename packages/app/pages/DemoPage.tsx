import React from "react"
import { useParams } from "react-router-dom"

import sample from "../../../static/sample.dem.json?url"
import { AppState } from "../app"
import { MatchView } from "../demo/MatchView"
import { openDemo } from "../demo/io"
import { useLocationState } from "../hooks/useLocationState"
import { useMatch } from "../store/useMatch"

export const DemoPage: React.FC<{ path?: string }> = ({ path }) => {
  const state = useLocationState<AppState>()
  const { "*": paramPath } = useParams<"*">()
  const { setMatch } = useMatch()
  React.useEffect(() => {
    if (!state.match)
      void Promise.resolve(paramPath === "sample" ? sample : path || paramPath)
        .then(openDemo)
        .then(setMatch)
  }, [path, paramPath])
  return <MatchView />
}
