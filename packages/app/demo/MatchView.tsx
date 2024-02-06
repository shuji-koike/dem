import React from "react"

import { DemoPlayer } from "./DemoPlayer"
import { useMatch } from "../hooks/useMatch"

export const MatchView: React.FC = () => {
  const match = useMatch((state) => state.match)
  if (!match) return null
  return (
    <>
      <DemoPlayer />
    </>
  )
}
