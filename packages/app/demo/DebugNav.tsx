import React from "react"
import styled from "styled-components"

import { useAuth } from "../hooks"
import { storagePut } from "../io"

export const DebugNav: React.VFC<{
  match: Match
  round: Round | undefined
  frame: Frame | undefined
}> = ({ match, round, frame }) => {
  const user = useAuth()
  const path = user && `private/${user.uid}/${new Date().getTime()}.dem.json`
  if (import.meta.env.PROD) return <></>
  return (
    <StyledSection>
      {path && <button onClick={() => storagePut(path, match)}>upload</button>}
      <br />
      <button onClick={() => console.debug(match)}>log(match)</button>
      <button onClick={() => console.debug(round)}>log(round)</button>
      <button
        onClick={() =>
          void (console.debug(frame), console.debug(JSON.stringify(frame)))
        }
      >
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
