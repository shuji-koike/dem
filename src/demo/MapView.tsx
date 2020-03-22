import React from "react"

export const MapView: React.FC<{
  match: Match
}> = ({ match, children }) => {
  return (
    <svg viewBox="0 0 1024 1024">
      <filter id="grayscale">
        <feColorMatrix
          type="matrix"
          values="0.5 0.3 0.3 0 0 0.3 0.5 0.3 0 0 0.3 0.3 0.5 0 0 0 0 0 0.2 0"></feColorMatrix>
      </filter>
      <image
        x={0}
        y={0}
        width={1024}
        height={1024}
        href={"/static/maps/" + match.MapName + "_radar.png"}
        filter="url(#grayscale)"></image>
      {children}
    </svg>
  )
}
