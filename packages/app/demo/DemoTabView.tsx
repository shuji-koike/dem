import { css } from "@emotion/react"
import { Paper, Tab, Tabs } from "@mui/material"
import React from "react"

import { DebugView } from "./DebugView"
import { KillsView } from "./KillsView"
import { NadesView } from "./NadesView"
import { RoundsView } from "./RoundsView"
import { ScoreBoardView } from "./ScoreBoardView"

export const DemoTabView: React.VFC<{
  match: Match
  setTick?: (tick: number) => void
  tab?: number
  setTab?: (tab: number) => void
}> = ({ match, setTick, tab = 1, setTab }) => {
  const [value, setValue] = React.useState(tab)
  React.useEffect(() => setValue(tab), [tab])
  setTab = setTab || setValue
  return (
    <Paper css={style}>
      <Tabs value={value} onChange={(_, e) => setTab?.(e)}>
        <Tab label="Scores" />
        <Tab label="Rounds" />
        <Tab label="Kills" />
        <Tab label="Nades" />
        <Tab label="Debug" />
      </Tabs>
      {value === 0 && <ScoreBoardView match={match} />}
      {value === 1 && <RoundsView match={match} setTick={setTick} />}
      {value === 2 && <KillsView match={match} setTick={setTick} />}
      {value === 3 && <NadesView match={match} setTick={setTick} />}
      {value === 4 && <DebugView match={match} />}
    </Paper>
  )
}

const style = css`
  table {
    width: 100%;
  }
  table th {
    text-align: left;
  }
  svg {
    max-width: 40vh;
    background-color: #111;
    cursor: crosshair;
  }
`
