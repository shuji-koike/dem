import React from "react"

import { useAuth } from "../hooks"
import { storagePut } from "./io"

export const DebugNav: React.VFC<{
  match: Match
  round: Round | undefined
  frame: Frame | undefined
}> = ({ match, round, frame }) => {
  const user = useAuth()
  const path = user && `private/${user.uid}/${new Date().getTime()}.dem.json.gz`
  if (!import.meta.env.DEV) return <></>
  return (
    <section className="debug">
      {path && <button onClick={() => storagePut(path, match)}>upload</button>}
      <button onClick={() => console.debug(match)}>match</button>
      <button onClick={() => console.debug(round)}>round</button>
      <button onClick={() => console.debug(frame)}>frame</button>
    </section>
  )
}
