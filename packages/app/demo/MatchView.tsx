import React from "react"

import { DemoPlayer } from "./DemoPlayer"
import { DemoTabView } from "./DemoTabView"

export const MatchView: React.VFC<{ match?: Match | null }> = ({ match }) => {
  const [tick, setTick] = React.useState<number | undefined>(0)
  const [tab, setTab] = React.useState<number | undefined>()
  if (!match) return <></>
  return Number.isInteger(tab) ? (
    <main>
      <DemoTabView match={match} setTick={setTick} tab={tab} setTab={setTab} />
    </main>
  ) : (
    <DemoPlayer match={match} tick={tick} setTick={setTick} />
  )
}
