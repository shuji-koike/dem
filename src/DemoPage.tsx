import Paper from "@material-ui/core/Paper"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import axios from "axios"
import React from "react"
import { useParams, useLocation } from "react-router-dom"
import { Team, getScores, setpos, velocity, sumCache } from "./demo"
import { DemoPlayer } from "./demo/DemoPlayer"
import { KillEventView } from "./demo/KillEvent"
import { MapView } from "./demo/MapView"
import { NadeEventView } from "./demo/NadeEvent"

export const DemoPage: React.FC = function () {
  const path = useParams<{ 0: string }>()[0]
  const { search, hash } = useLocation()
  const params = new URLSearchParams(hash.slice(1))
  const [match, setMatch] = React.useState<Match | null>(null)
  const [tab, setTab] = React.useState(Number(params.get("tab")) || 0)
  const [tick, setTick] = React.useState(Number(params.get("tick")) || 0)
  React.useEffect(() => {
    axios.get(`/api/files/${path}${search}`).then(({ data }) => setMatch(data))
  }, [path])
  if (!match) return <span>loading</span>
  return tick ? (
    <DemoPlayer match={match} tick={tick} onExit={() => setTick(0)} />
  ) : (
    <main>
      <Paper>
        <Tabs value={tab} onChange={(_, e) => setTab(e)}>
          <Tab label="Rounds" />
          <Tab label="Scores" />
          <Tab label="Kills" />
          <Tab label="Nades" />
          <Tab label="Debug" />
        </Tabs>
        {
          [
            /* eslint-disable react/jsx-key */
            <RoundsView match={match} setTick={setTick} />,
            <ScoreBoard match={match} />,
            <KillsView match={match} setTick={setTick} />,
            <NadesView match={match} setTick={setTick} />,
            <DebugView match={match} />,
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
    </section>
  )
}

const RoundsView: React.FC<{
  match: Match
  setTick: (tick: number) => void
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
            <tr key={i} onClick={() => setTick(e.Tick)}>
              <td>{e.Round + 1}</td>
              <td>{e.Tick}</td>
              <td>{e.Winner}</td>
              <td>{e.Reason}</td>
              <td>{e.BombSite || "-"}</td>
              <td>{sumCache(e.Frames[0], Team.CounterTerrorists)}</td>
              <td>{sumCache(e.Frames[0], Team.Terrorists)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

const KillsView: React.FC<{
  match: Match
  setTick: (tick: number) => void
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
            onClick={e => setTick(e.Tick)}
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
              <td onClick={() => setTick(e.Tick)}>{e.Tick}</td>
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

const NadesView: React.FC<{
  match: Match
  setTick: (tick: number) => void
}> = ({ match, setTick }) => {
  const [selected, setSelected] = React.useState<NadeEvent | null>(null)
  return (
    <section>
      <MapView match={match}>
        {match.NadeEvents?.map((e, i) => (
          <NadeEventView
            key={i}
            event={e}
            selected={e == selected}
            onClick={e => setTick(e.Tick)}
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
              onMouseLeave={() => setSelected(null)}>
              <td>{e.Round + 1}</td>
              <td onClick={() => setTick(e.Tick)}>{e.Tick}</td>
              <td>{e.ID}</td>
              <td>{e.Weapon}</td>
              <td>{e.Thrower}</td>
              <td>{e.Team}</td>
              <td>{velocity(e.Velocity)}</td>
              <td>
                <button
                  onClick={() => navigator.clipboard.writeText(setpos(e))}>
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

const DebugView: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <section>
      <pre>
        {JSON.stringify({
          ...match,
          Rounds: undefined,
          KillEvents: undefined,
          NadeEvents: undefined,
        })}
      </pre>
      {match.Rounds?.map((e, i) => (
        <pre key={`round-${i}`}>
          {JSON.stringify({
            ...e,
            Frames: undefined,
            length: e.Frames.length,
          })}
        </pre>
      ))}
      {[...match.KillEvents, ...match.NadeEvents].map((e, i) => (
        <pre key={i}>{JSON.stringify(e)}</pre>
      ))}
    </section>
  )
}
