import React from "react"

import { setpos, velocity } from "."
import { MapView } from "./MapView"
import { NadeEventView } from "./NadeEventView"

export const NadesView: React.FC<{
  match: Match
  setTick?: (tick: number) => void
}> = ({ match, setTick }) => {
  const [selected, setSelected] = React.useState<NadeEvent | null>(null)
  return (
    <section>
      <MapView>
        {match.NadeEvents?.map((e, i) => (
          <NadeEventView
            key={i}
            event={e}
            selected={e === selected}
            onClick={(e) => setTick?.(e.Tick)}
          />
        ))}
      </MapView>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Tick</th>
            <th>ID</th>
            <th>Weapon</th>
            <th>Thrower</th>
            <th>Team</th>
            <th>Velocity</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {match.NadeEvents?.map((e, i) => (
            <tr
              key={i}
              onMouseOver={() => setSelected(e)}
              onMouseLeave={() => setSelected(null)}
            >
              <td>{e.Round + 1}</td>
              <td onClick={() => setTick?.(e.Tick)}>{e.Tick}</td>
              <td>{e.ID}</td>
              <td>{e.Weapon}</td>
              <td>{e.Thrower}</td>
              <td>{e.Team}</td>
              <td>{velocity(e.Velocity)}</td>
              <td>
                <button
                  onClick={() => navigator.clipboard.writeText(setpos(e))}
                >
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
