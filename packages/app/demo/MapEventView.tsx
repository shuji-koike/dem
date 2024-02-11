import React from "react"

import { KillEventView } from "./KillEventView"
import { NadeEventView } from "./NadeEventView"
import { useMatch } from "../hooks/useMatch"

export const MapEventView: React.FC = React.memo(function MapEventView() {
  const match = useMatch((state) => state.match)
  const round = useMatch((state) => state.round)
  const changeTick = useMatch((state) => state.changeTick)
  function filter(e: KillEvent | NadeEvent) {
    return e.Round === round?.Round
  }
  return (
    <g opacity={round ? 0.4 : 0.8}>
      {match?.KillEvents?.filter(filter).map((e, i) => (
        <KillEventView key={i} event={e} onClick={changeTick} />
      ))}
      {match?.NadeEvents?.filter(filter).map((e, i) => (
        <NadeEventView key={i} event={e} onClick={changeTick} />
      ))}
    </g>
  )
})
