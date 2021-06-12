import React from "react"
import { DemoPlayer } from "./DemoPlayer"
import { DemoTabView } from "./DemoTabView"

export const Match: React.VFC<{ match: Match | null }> = ({ match }) => {
  const [tick, setTick] = React.useState<number | undefined>(0)
  const [tab, setTab] = React.useState(0)
  if (!match) return <></>
  return Number.isInteger(tick) ? (
    <DemoPlayer match={match} tick={tick} setTick={setTick} />
  ) : (
    <main>
      <DemoTabView match={match} setTick={setTick} tab={tab} setTab={setTab} />
    </main>
  )
}
