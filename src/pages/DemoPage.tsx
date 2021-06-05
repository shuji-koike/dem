import axios from "axios"
import React from "react"
import { useParams, useLocation } from "react-router-dom"
import { DemoPlayer } from "../demo/DemoPlayer"
import { DemoTabView } from "../demo/DemoTabView"

export const DemoPage: React.VFC = () => {
  const path = useParams<{ 0: string }>()[0]
  const { search, hash } = useLocation()
  const params = new URLSearchParams(hash.slice(1))
  const [match, setMatch] = React.useState<Match | null>(null)
  const [tab, setTab] = React.useState(parseInt(params.get("tab") ?? "0"))
  const [tick, setTick] = React.useState<number | undefined>(
    parseInt(params.get("tick") ?? "0")
  )
  React.useEffect(() => {
    axios.get(`/api/files/${path}${search}`).then(({ data }) => setMatch(data))
  }, [path])
  if (!match) return <span>loading</span>
  return Number.isInteger(tick) ? (
    <DemoPlayer match={match} tick={tick} setTick={setTick} />
  ) : (
    <main>
      <DemoTabView match={match} setTick={setTick} tab={tab} setTab={setTab} />
    </main>
  )
}
