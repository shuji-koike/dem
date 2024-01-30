import React from "react"

import { DemoPlayer } from "./DemoPlayer"
import { useMatch } from "../store/useMatch"

export const MatchView: React.FC = () => {
  const { match } = useMatch()
  if (!match) return <></>
  return (
    <>
      <DemoPlayer />
    </>
  )
}
