import { css } from "@emotion/react"
import { Tab, Tabs } from "@mui/material"
import React from "react"

import { useMatch } from "../hooks/useMatch"

export interface Filter {
  players?: (e: Player) => boolean
  kills?: (e: KillEvent) => boolean
  nades?: (e: NadeEvent) => boolean
}

// unused
export const DemoMenu: React.FC<{
  setFilter: (e: Filter) => void
}> = ({ setFilter }) => {
  const { round, frame } = useMatch()
  const [tab, setTab] = React.useState(1)
  React.useEffect(() => {
    switch (tab) {
      case 1:
        setFilter({ players: () => true })
        break
      case 2:
        setFilter({ kills: (e) => !round || e.Round === round?.Round })
        break
      case 3:
        setFilter({ nades: (e) => !round || e.Round === round?.Round })
        break
    }
  }, [tab, round])
  if (!round && !frame) return null
  return (
    <div css={style} onWheelCapture={(e) => e.stopPropagation()}>
      <nav>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={(_, tab) => setTab(tab)}
        >
          <Tab value={1} label="Players" />
          <Tab value={2} label="Kills" />
          <Tab value={3} label="Nades" />
        </Tabs>
      </nav>
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
