import React from "react"
import { useParams } from "react-router-dom"

import { Match } from "../demo/Match"
import { openDemo } from "../io"

export const DemoPage: React.VFC<{ path?: string }> = ({ path }) => {
  const { "*": paramPath } = useParams<"*">()
  const [match, setMatch] = React.useState<Match | null>(null)
  React.useEffect(() => {
    openDemo(path || paramPath).then(setMatch)
  }, [path])
  return <Match match={match} />
}
