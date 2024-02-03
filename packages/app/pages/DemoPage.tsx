import React from "react"
import { useParams } from "react-router-dom"

import sample from "../../../static/sample.dem.json?url"
import { MatchView } from "../demo/MatchView"
import { openDemo } from "../demo/io"
import { useMatch } from "../hooks/useMatch"

export const DemoPage: React.FC<{ path?: string }> = ({ path }) => {
  const { "*": paramPath } = useParams<"*">()
  const { match, setMatch } = useMatch()
  React.useEffect(() => {
    if (!match)
      void Promise.resolve(paramPath === "sample" ? sample : path || paramPath)
        .then(openDemo)
        .then(setMatch)
  }, [path, paramPath])
  return <MatchView />
}
