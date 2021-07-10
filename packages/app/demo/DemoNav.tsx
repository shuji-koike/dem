import React from "react"
import styled from "styled-components"

import { teamColor } from "."

export const DemoNav: React.VFC<{
  match: Match
  round?: Round
  onChange: (round: Round) => void
}> = ({ match, round, onChange }) => {
  return (
    <>
      {match.Rounds?.map((e) => (
        <StyledSpan
          key={e.Tick}
          className={e === round ? "active" : undefined}
          style={{ color: teamColor(e.Winner) }}
          onClick={() => onChange(e)}
        >
          {e.Round + 1}
        </StyledSpan>
      ))}
    </>
  )
}

const StyledSpan = styled.span`
  display: inline-block;
  margin: 0.5em;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  vertical-align: middle;
  font-family: monospace;
  cursor: pointer;
  & {
    filter: brightness(80%);
  }
  &:hover {
    font-weight: bold;
    filter: brightness(120%);
  }
  &.active {
    font-weight: bold;
    text-decoration: underline;
    filter: brightness(150%);
  }
`
