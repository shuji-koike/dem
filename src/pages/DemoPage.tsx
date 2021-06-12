import React from "react"
import { useParams } from "react-router-dom"
import { Match } from "../demo/Match"
import { openDemo, storageFetch } from "../store/io"

export const DemoPage: React.VFC<{ path?: string }> = ({ path }) => {
  const params = useParams<{ 0: string }>()
  const [match, setMatch] = React.useState<Match | null>(null)
  React.useEffect(() => {
    if (path) openDemo(path).then(setMatch)
    else if (params[0]) storageFetch(params[0]).then(setMatch)
  }, [])
  return <Match match={match} />
}
