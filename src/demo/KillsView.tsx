import React from "react"
import { KillEventView } from "./KillEventView"
import { MapView } from "./MapView"

export const KillsView: React.VFC<{
  match: Match
  setTick?: (tick: number) => void
}> = ({ match, setTick }) => {
  const [selected, setSelected] = React.useState<KillEvent | null>(null)
  return (
    <section>
      <MapView match={match}>
        {match.KillEvents?.map((e, i) => (
          <KillEventView
            key={i}
            event={e}
            selected={e == selected}
            onClick={e => setTick?.(e.Tick)}
          />
        ))}
      </MapView>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Tick</th>
            <th>Killer</th>
            <th>Victim</th>
            <th>Assister</th>
            <th>Weapon</th>
            <th>Team</th>
            <th>IsHeadshot</th>
            <th>Penetrated</th>
          </tr>
        </thead>
        <tbody>
          {match.KillEvents?.map((e, i) => (
            <tr
              key={i}
              onMouseOver={() => setSelected(e)}
              onMouseLeave={() => setSelected(null)}>
              <td>{e.Round + 1}</td>
              <td onClick={() => setTick?.(e.Tick)}>{e.Tick}</td>
              <td>{e.Killer}</td>
              <td>{e.Victim}</td>
              <td>{e.Assister}</td>
              <td>{e.Weapon}</td>
              <td>{e.Team}</td>
              <td>{e.IsHeadshot.toString()}</td>
              <td>{e.Penetrated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
