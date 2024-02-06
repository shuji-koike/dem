import React, { useMemo } from "react"

import { getScores } from "."
import { useMatch } from "../hooks/useMatch"

export const ScoreBoardView: React.FC = () => {
  const match = useMatch((state) => state.match)
  const scores = useMemo(() => match && getScores(match), [match])
  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Team</th>
            <th>Kill</th>
            <th>Assist</th>
            <th>Death</th>
            <th>K/D</th>
            <th>HS%</th>
          </tr>
        </thead>
        <tbody>
          {scores?.map((e) => (
            <tr key={e.ID}>
              <td>{e.ID}</td>
              <td>{e.Name}</td>
              <td>{e.Team}</td>
              <td>{e.kills}</td>
              <td>{e.assists}</td>
              <td>{e.deaths}</td>
              <td>{e.killDeath}</td>
              <td>{e.headshotPercentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
