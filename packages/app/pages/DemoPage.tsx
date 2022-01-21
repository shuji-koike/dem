import React from "react"
import { useParams } from "react-router-dom"

import { AppContext } from "../app"
import { MatchView } from "../demo/MatchView"
import { openDemo } from "../demo/io"

export const DemoPage: React.VFC<{ path?: string }> = ({ path }) => {
  const { "*": paramPath } = useParams<"*">()
  const { match, setMatch } = React.useContext(AppContext)
  React.useEffect(() => {
    openDemo(path || paramPath).then(setMatch)
  }, [path])
  return <MatchView match={match} />
}
