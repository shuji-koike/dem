import React from "react"
import { Filter } from "./DemoPlayer" // eslint-disable-line no-unused-vars
import { PlayerCard } from "./PlayerCard"

export const DemoMenu: React.FC<{
  round?: Round
  frame?: Frame
  steam: any
  filter: Filter
  setFilter: (e: Filter) => void
}> = function ({ round, frame, steam, filter, setFilter }) {
  const [tab, setTab] = React.useState(0)
  const [all, setAll] = React.useState(false)
  React.useEffect(() => {
    switch (tab) {
      case 0:
        setFilter({ players: () => true })
        break
      case 1:
        setFilter({ kills: e => all || !round || e.Round === round.Round })
        break
      case 2:
        setFilter({ nades: e => all || !round || e.Round === round.Round })
        break
    }
  }, [tab, round, all])
  return (
    <>
      <nav>
        <span onClick={() => setTab(0)}>Players</span>
        <span onClick={() => setTab(1)}>Kills</span>
        <span onClick={() => setTab(2)}>Nades</span>
        <input
          type="checkbox"
          checked={all}
          onChange={e => setAll(e.target.checked)}
        />
      </nav>
      {filter.players &&
        frame?.Players.filter(filter.players).map(e => (
          <PlayerCard key={e.ID} player={e} steam={steam[e.ID]} />
        ))}
    </>
  )
}
