import React from "react"

import { assetsMapRadar } from "../assets"

export const MapView: React.VFC<{
  match: Match
  children?: React.ReactNode
}> = ({ match, children }) => {
  return (
    <svg viewBox="0 0 1024 1024">
      <filter id="grayscale">
        <feColorMatrix
          type="matrix"
          values="0.5 0.3 0.3 0 0 0.3 0.5 0.3 0 0 0.3 0.3 0.5 0 0 0 0 0 0.2 0"
        ></feColorMatrix>
      </filter>
      <image
        x={0}
        y={0}
        width={1024}
        height={1024}
        href={assetsMapRadar[match.MapName]}
        filter="url(#grayscale)"
      ></image>
      {children}
    </svg>
  )
}
