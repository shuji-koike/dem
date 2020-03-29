import React from "react"
import styled from "styled-components"
import { TeamColor } from "."

export const PlayerCard: React.FC<{
  player: Player
  steam: any
}> = function({ player, steam }) {
  return (
    <StyledSection>
      <a href={steam?.profileurl} rel="noopener noreferrer">
        <img src={steam?.avatar} />
      </a>
      <div className="name">
        <div
          style={{
            width: player.Hp + "%",
            background: TeamColor[player.Team]
          }}></div>
        <span>{player.Hp}</span>
        <span>{player.Name}</span>
        <span>${player.Money}</span>
      </div>
      <div className="inventory">
        {player.Weapons?.filter(e => e != 405).map(e => (
          <img
            key={e}
            className={player.Weapon == e ? "active" : ""}
            src={"/static/icons/" + e + ".png"}
          />
        ))}
      </div>
    </StyledSection>
  )
}

const StyledSection = styled.section`
  font-family: monospace;
  position: relative;
  margin-bottom: 4px;
  width: 100%;
  > a > img {
    position: absolute;
    border: none;
    width: 50px;
    height: 50px;
  }
  .name {
    position: relative;
    height: 22px;
    margin-left: 50px;
    background: #444;
    cursor: pointer;
  }
  .name > div {
    position: absolute;
    height: 100%;
    z-index: 0;
  }
  .name > * {
    position: relative;
    z-index: 1;
  }
  .inventory {
    margin-left: 50px;
    height: 28px;
    white-space: nowrap;
  }
  .inventory > img {
    margin: 2px 2px;
    height: 20px;
    filter: brightness(60%);
  }
  .inventory > img.active {
    filter: brightness(100%);
  }
`
