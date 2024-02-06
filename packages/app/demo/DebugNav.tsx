import React from "react"

import { storagePut } from "./io"
import { useAuth } from "../hooks"
import { useMatch } from "../hooks/useMatch"

export const DebugNav: React.FC = () => {
  const user = useAuth()
  const { match, round, frame } = useMatch()
  const path = user && `private/${user.uid}/${new Date().getTime()}.dem.json.gz`
  if (!import.meta.env.DEV) return null
  return (
    <section className="debug">
      {match && path && (
        <button onClick={() => storagePut(path, match)}>upload</button>
      )}
      <button onClick={() => console.debug(match)}>match</button>
      <button onClick={() => console.debug(round)}>round</button>
      <button onClick={() => console.debug(frame)}>frame</button>
    </section>
  )
}
