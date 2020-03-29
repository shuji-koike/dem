import Paper from "@material-ui/core/Paper"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import axios from "axios"
import React from "react"
import { useParams, useLocation } from "react-router-dom"
import { getScores } from "./demo"
import { DemoPlayer } from "./demo/DemoPlayer"

export const DemoPage: React.FC = function() {
  const path = useParams<{ 0: string }>()[0]
  const { search } = useLocation()
  const [match, setMatch] = React.useState<Match | null>(null)
  const [tab, setTab] = React.useState(0)
  React.useEffect(() => {
    axios.get(`/api/files/${path}${search}`).then(({ data }) => setMatch(data))
  }, [path])
  if (!match) return <span>loading</span>

  return (
    <main>
      <Paper>
        <Tabs value={tab} onChange={(_, e) => setTab(e)}>
          <Tab label="Scores" />
          <Tab label="Rounds" />
          <Tab label="Kills" />
          <Tab label="Nades" />
          <Tab label="Playback" />
          <Tab label="Debug" />
        </Tabs>
        {
          [
            /* eslint-disable react/jsx-key */
            <ScoreBoard match={match} />,
            <RoundsView match={match} />,
            <KillsView match={match} />,
            <NadesView match={match} />,
            <DemoPlayer match={match} />,
            <DebugView match={match} />
            /* eslint-enable react/jsx-key */
          ][tab]
        }
      </Paper>
    </main>
  )
}

const ScoreBoard: React.FC<{ match: Match }> = ({ match }) => {
  const scores = getScores(match)
  return (
    <table>
      <tbody>
        {scores.map(e => (
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
  )
}

const RoundsView: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <section>
      {match.Rounds?.map((e, i) => (
        <pre key={`round-${i}`}>
          {JSON.stringify({
            ...e,
            Frames: undefined,
            length: e.Frames.length
          })}
        </pre>
      ))}
    </section>
  )
}

const KillsView: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <section>
      {match.KillEvents?.map((e, i) => (
        <pre key={`kill-${i}`}>{JSON.stringify(e)}</pre>
      ))}
    </section>
  )
}

const NadesView: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <section>
      {match.NadeEvents?.map((e, i) => (
        <p key={`nade-${i}`}>
          <img src={"/static/icons/" + e.Weapon + ".png"} />
          <span>{e.Thrower}</span>
        </p>
      ))}
    </section>
  )
}

const DebugView: React.FC<{ match: Match }> = ({ match }) => (
  <section>
    <pre>
      {JSON.stringify({
        ...match,
        Rounds: undefined,
        KillEvents: undefined,
        NadeEvents: undefined
      })}
    </pre>
    {match.Rounds?.map((e, i) => (
      <pre key={`round-${i}`}>
        {JSON.stringify({
          ...e,
          Frames: undefined,
          length: e.Frames.length
        })}
      </pre>
    ))}
    {match.KillEvents?.map((e, i) => (
      <pre key={`kill-${i}`}>{JSON.stringify(e)}</pre>
    ))}
    {match.NadeEvents?.map((e, i) => (
      <pre key={`nade-${i}`}>{JSON.stringify(e)}</pre>
    ))}
  </section>
)
