import axios from "axios"
import React from "react"
import { useLocation } from "react-router-dom"

import { HeaderSlot } from "../components/layout"

interface Data {
  href: string
  title: string
}

export const MatchList: React.VFC = () => {
  const [state, setState] = React.useState<Data[]>([])
  const { pathname } = useLocation()
  const url = "/www.hltv.org" + pathname
  React.useEffect(() => {
    axios.get(url).then(({ data }) => setState(data))
  }, [url])
  return (
    <main>
      <HeaderSlot>
        <h1>Matches</h1>
      </HeaderSlot>
      <ul>
        {state.map((e) => (
          <li key={e.href}>{e.title}</li>
        ))}
      </ul>
    </main>
  )
}
