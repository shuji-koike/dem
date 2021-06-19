import React from "react"
import styled from "styled-components"
import { storagePut } from "../store/io"

export const DebugNav: React.VFC<{
  match: Match
  round: Round | undefined
  frame: Frame | undefined
}> = ({ match, round, frame }) => {
  return (
    <StyledSection>
      <button onClick={() => storagePut("sandbox/test", match)}>save</button>
      <br />
      <button onClick={() => console.debug(match)}>log(match)</button>
      <button onClick={() => console.debug(round)}>log(round)</button>
      <button
        onClick={() =>
          void (console.debug(frame), console.debug(JSON.stringify(frame)))
        }>
        log(frame)
      </button>
    </StyledSection>
  )
}

const StyledSection = styled.section`
  opacity: 0.1;
  &:hover {
    opacity: 1;
  }
`
