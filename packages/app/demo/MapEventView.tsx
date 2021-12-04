import React from "react"

import { Filter } from "./DemoPlayer"
import { KillEventView } from "./KillEventView"
import { NadeEventView } from "./NadeEventView"

export const MapEventView: React.VFC<{
  match: Match
  round?: Round
  filter: Filter
  changeTick?: (e: { Tick: number }) => void
}> = React.memo(function MapEventView({ match, round, filter, changeTick }) {
  return (
    <g opacity={round ? 0.4 : 0.8}>
      {filter.kills &&
        match.KillEvents?.filter(filter.kills).map((e, i) => (
          <KillEventView key={i} event={e} onClick={changeTick} />
        ))}
      {filter.nades &&
        match.NadeEvents?.filter(filter.nades).map((e, i) => (
          <NadeEventView key={i} event={e} onClick={changeTick} />
        ))}
    </g>
  )
})
