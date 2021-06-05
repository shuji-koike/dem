import React from "react"
import styled from "styled-components"
import { SteamUser, teamColor, icon, armorIcon } from "."

export const PlayerCard: React.VFC<{
  player: Player
  steam?: SteamUser
}> = ({ player, steam }) => {
  return (
    <StyledSection player={player}>
      <a href={steam?.profileurl} rel="noopener noreferrer">
        <img className="avatar" src={steam?.avatar} />
      </a>
      <div className="Player">
        <div className="bar"></div>
        <span className="Hp">{player.Hp}</span>
        <span className="Name">{player.Name}</span>
        <span className="Money">${player.Money}</span>
      </div>
      <div className="Weapons">
        <img src={armorIcon(player)} />
        {player.Weapons?.filter(e => e != 405).map((e, i) => (
          <img
            key={i}
            className={player.Weapon == e ? "active" : ""}
            src={icon(e)}
          />
        ))}
      </div>
    </StyledSection>
  )
}

const StyledSection = styled.section<{ player: Player }>`
  font-family: monospace;
  position: relative;
  margin-bottom: 4px;
  width: 100%;
  .avatar {
    position: absolute;
    border: none;
    width: 50px;
    height: 50px;
    background: #333;
  }
  .Player {
    display: flex;
    position: relative;
    height: 20px;
    margin-left: 50px;
    background: #444;
  }
  .Player > .bar {
    position: absolute;
    height: 100%;
    z-index: 0;
    width: ${({ player }) => player.Hp + "%"};
    background: ${({ player }) => teamColor(player.Team)};
    filter: brightness(80%);
  }
  .Player > span {
    z-index: 1;
    margin: 0 4px;
  }
  .Player .Hp {
    width: 2em;
    text-align: right;
  }
  .Player .Name {
    flex-grow: 4;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .Weapons {
    margin-left: 50px;
    height: 28px;
    white-space: nowrap;
  }
  .Weapons > img {
    margin: 2px 2px;
    height: 20px;
    filter: brightness(60%);
  }
  .Weapons > img.active {
    filter: brightness(100%);
  }
`
