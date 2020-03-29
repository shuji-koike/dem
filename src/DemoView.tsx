import axios from "axios"
import React from "react"
import { useParams, useLocation } from "react-router-dom"
import { DemoPlayer } from "./demo/DemoPlayer"

export const DemoView: React.FC = function() {
  const path = useParams<{ 0: string }>()[0]
  const { search } = useLocation()
  const [match, setMatch] = React.useState<Match | null>(null)
  React.useEffect(() => {
    axios.get(`/api/files/${path}${search}`).then(({ data }) => setMatch(data))
  }, [path])
  if (!match) return <span>loading</span>
  return <DemoPlayer match={match} />
}
