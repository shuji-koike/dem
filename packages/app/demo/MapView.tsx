import React from "react"

import { assetsMapRadar } from "../assets"
import { useMatch } from "../hooks/useMatch"

export const MapView: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const radar = useMatch(({ match }) =>
    match ? assetsMapRadar[match.MapName] : undefined,
  )
  return (
    <svg viewBox="0 0 1024 1024">
      <filter id="grayscale">
        <feColorMatrix
          type="matrix"
          values="0.5 0.3 0.3 0 0 0.3 0.5 0.3 0 0 0.3 0.3 0.5 0 0 0 0 0 0.2 0"
        />
      </filter>
      <image
        x={0}
        y={0}
        width={1024}
        height={1024}
        href={radar}
        filter="url(#grayscale)"
      />
      {children}
    </svg>
  )
}
