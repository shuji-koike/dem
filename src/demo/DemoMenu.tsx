import React from "react"
import styled from "styled-components"
import { Filter } from "./DemoPlayer"
import { PlayerCard } from "./PlayerCard"
import { findPlayer, icon, SteamUser, teamColor } from "."

export const DemoMenu: React.VFC<{
  match: Match
  round?: Round
  frame?: Frame
  setTick?: (tick: number | undefined) => void
  steam?: Record<string, SteamUser>
  filter: Filter
  setFilter: (e: Filter) => void
}> = ({ match, round, frame, setTick, steam, filter, setFilter }) => {
  const [tab, setTab] = React.useState(1)
  React.useEffect(() => {
    switch (tab) {
      case 1:
        setFilter({
          players: () => true,
          kills: e => e.Round === round?.Round,
          nades: e => e.Round === round?.Round,
        })
        break
      case 2:
        setFilter({
          kills: e => !round || e.Round === round?.Round,
        })
        break
      case 3:
        setFilter({ nades: e => !round || e.Round === round?.Round })
        break
    }
  }, [tab, round])
  return (
    <StyledDemoMenu>
      <nav>
        <button onClick={() => setTab(1)}>Players</button>
        <button onClick={() => setTab(2)}>Kills</button>
        <button onClick={() => setTab(3)}>Nades</button>
        <label>
          <input
            type="checkbox"
            defaultChecked={!round}
            disabled={!round}
            onClick={() => setTick?.(undefined)}
          />
          All
        </label>
      </nav>
      <section onWheelCapture={e => e.stopPropagation()}>
        {filter.players &&
          frame?.Players.filter(filter.players).map(e => (
            <PlayerCard key={e.ID} player={e} steam={steam?.[e.ID]} />
          ))}
        {filter.kills &&
          match.KillEvents.filter(filter.kills).map((e, i) => (
            <p key={i} onClick={() => setTick?.(e.Tick)}>
              <PlayerLabel player={findPlayer(match, e.Killer)} />
              <img height={16} src={icon(e.Weapon)} />
              {!!e.Penetrated && <span>(P)</span>}
              {e.IsHeadshot && <span>(H)</span>}
              <PlayerLabel player={findPlayer(match, e.Victim)} />
            </p>
          ))}
        {filter.nades &&
          match.NadeEvents.filter(filter.nades).map((e, i) => (
            <p key={i} onClick={() => setTick?.(e.Tick)}>
              <img height={16} src={icon(e.Weapon)} />
              <PlayerLabel player={findPlayer(match, e.Thrower)} />
            </p>
          ))}
      </section>
    </StyledDemoMenu>
  )
}

const StyledDemoMenu = styled.div`
  max-height: calc(100vh - 60px - 100px);
  overflow-y: auto;
  > nav {
    position: sticky;
    top: 0;
  }
`

const PlayerLabel: React.VFC<{
  player: Player | null
  onClick?: () => unknown
}> = ({ player, onClick }) => {
  if (!player) return <></>
  return (
    <StyledPlayerLabel player={player} onClick={onClick}>
      {player.Name}
    </StyledPlayerLabel>
  )
}

const StyledPlayerLabel = styled.span<{ player: Player }>`
  font-weight: bold;
  color: ${p => teamColor(p.player.Team)};
`
