import React from "react"
import { DemoPlayer } from "../demo/DemoPlayer"
import { DemoTabView } from "../demo/DemoTabView"
import { openDemo } from "../store/io"

export const Match: React.VFC<
  | { match: Match | null; path?: undefined }
  | { match?: undefined; path: string }
> = ({ path, ...props }) => {
  const [match, setMatch] = React.useState(props.match)
  const [tick, setTick] = React.useState<number | undefined>(0)
  React.useEffect(() => void (path && openDemo(path).then(setMatch)), [path])
  if (!match) return <></>
  return Number.isInteger(tick) ? (
    <DemoPlayer match={match} tick={tick} setTick={setTick} />
  ) : (
    <DemoTabView match={match} setTick={setTick} />
  )
}
