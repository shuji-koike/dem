import React from "react"

import { DemoPlayer } from "./DemoPlayer"

export const MatchView: React.VFC<{ match?: Match | null }> = ({ match }) => {
  const [tick, setTick] = React.useState<number | undefined>(0)
  if (!match) return <></>
  return (
    <>
      <DemoPlayer match={match} tick={tick} setTick={setTick} />
    </>
  )
}
