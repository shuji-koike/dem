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
        <div key={e.Tick} onClick={() => onChange(e)}>
          <DemoNavItem round={e} active={e === round} />
        </div>
      ))}
    </>
  )
}

const DemoNavItem: React.VFC<{
  round: Round
  active?: boolean
}> = ({ round, active }) => {
  const style = css`
    display: inline-block;
    margin: 0.5em;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    vertical-align: middle;
    font-family: monospace;
    color: ${teamColor(round.Winner)};
    cursor: pointer;
    & {
      filter: brightness(80%);
    }
    &:hover {
      font-weight: bold;
      filter: brightness(120%);
    }
    ${active &&
    css`
      font-weight: bold;
      text-decoration: underline;
      filter: brightness(150%);
    `}
  `
  return <span css={style}>{round.Round + 1}</span>
}
