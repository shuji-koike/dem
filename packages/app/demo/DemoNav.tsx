import { css } from "@emotion/react"
import React from "react"

import { teamColor } from "."

export const DemoNav: React.VFC<{
  match: Match
  round?: Round
  onChange: (round: Round) => void
}> = ({ match, round, onChange }) => {
  return (
    <>
      {match.Rounds?.map((e) => (
        <DemoNavItem
          key={e.Tick}
          round={e}
          active={e === round}
          onClick={() => onChange(e)}
        />
      ))}
    </>
  )
}

const DemoNavItem: React.VFC<{
  round: Round
  active?: boolean
  size?: number
  onClick?: () => void
}> = ({ round, active, size = 32, onClick }) => {
  const style = css`
    display: inline-block;
    width: ${size}px;
    height: ${size}px;
    line-height: ${size}px;
    border-radius: ${size / 2}px;
    text-align: center;
    font-family: monospace;
    color: ${teamColor(round.Winner)};
    cursor: pointer;
    font-weight: bold;
    filter: brightness(80%);
    &:hover,
    &.active {
      color: #fff;
      background-color: ${teamColor(round.Winner)};
    }
    &:hover {
      filter: brightness(120%);
    }
  `
  return (
    <div className={active ? "active" : ""} css={style} onClick={onClick}>
      {round.Round + 1}
    </div>
  )
}
