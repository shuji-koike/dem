import { css } from "@emotion/react"
import React from "react"

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
    <section
      css={css`
        opacity: 0.1;
        &:hover {
          opacity: 1;
        }
      `}
    >
      {path && <button onClick={() => storagePut(path, match)}>upload</button>}
      <br />
      <button onClick={() => console.debug(match)}>match</button>
      <button onClick={() => console.debug(round)}>round</button>
      <button onClick={() => console.debug(frame)}>frame</button>
    </section>
  )
}
