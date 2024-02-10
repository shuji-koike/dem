import React from "react"

import { Team, sumCache } from "."

export const RoundsView: React.FC<{
  match: Match
  setTick?: (tick: number) => void
}> = ({ match, setTick }) => {
  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Tick</th>
            <th>Winner</th>
            <th>Reason</th>
            <th>BombSite</th>
            <th>CT</th>
            <th>T</th>
          </tr>
        </thead>
        <tbody>
          {match.Rounds?.map((e, i) => (
            <tr key={i} onClick={() => setTick?.(e.Tick)}>
              <td>{e.Round + 1}</td>
              <td>{e.Tick}</td>
              <td>{e.Winner}</td>
              <td>{e.Reason}</td>
              <td>{e.BombSite || "-"}</td>
              <td>
                {e.Frames[0] && sumCache(e.Frames[0], Team.CounterTerrorists)}
              </td>
              <td>{e.Frames[0] && sumCache(e.Frames[0], Team.Terrorists)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
