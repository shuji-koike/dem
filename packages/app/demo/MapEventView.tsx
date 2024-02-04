import React from "react"

import { Filter } from "./DemoPlayer"
import { KillEventView } from "./KillEventView"
import { NadeEventView } from "./NadeEventView"
import { useMatch } from "../hooks/useMatch"

export const MapEventView: React.FC<{
  filter: Filter
}> = React.memo(function MapEventView({ filter }) {
  const match = useMatch((state) => state.match)
  const round = useMatch((state) => state.round)
  const changeTick = useMatch((state) => state.changeTick)
  return (
    <g opacity={round ? 0.4 : 0.8}>
      {filter.kills &&
        match?.KillEvents?.filter(filter.kills).map((e, i) => (
          <KillEventView key={i} event={e} onClick={changeTick} />
        ))}
      {filter.nades &&
        match?.NadeEvents?.filter(filter.nades).map((e, i) => (
          <NadeEventView key={i} event={e} onClick={changeTick} />
        ))}
    </g>
  )
})
