import React from "react"
import { useParams } from "react-router-dom"

import { AppContext } from "../app"
import { Match } from "../demo/Match"
import { openDemo } from "../io"

export const DemoPage: React.VFC<{ path?: string }> = ({ path }) => {
  const { "*": paramPath } = useParams<"*">()
  const { match, setMatch } = React.useContext(AppContext)
  React.useEffect(() => {
    openDemo(path || paramPath).then(setMatch)
  }, [path])
  return <Match match={match} />
}
