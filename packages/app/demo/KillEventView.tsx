import React from "react"

import { teamColor, teamOpponentColor, vectorToPoint } from "."

export const KillEventView: React.FC<{
  event: KillEvent
  selected?: boolean
  onClick?: (event: KillEvent) => void
}> = ({ event, selected, onClick }) => {
  const [hover, setHover] = React.useState(false)
  const active = selected || hover
  const size = active ? 8 : 4
  const from = vectorToPoint(event.From)
  const { X, Y } = vectorToPoint(event)
  return (
    <g
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() => onClick?.(event)}
      cursor="pointer"
    >
      {from.X && from.Y && (
        <>
          <circle cx={from.X} cy={from.Y} r={8} fill="transparent" />
          <path
            d={["M", from.X, from.Y, "L", X, Y].join(" ")}
            fill="red"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />
          <circle
            cx={from.X}
            cy={from.Y}
            r={active ? 4 : 2}
            fill={teamOpponentColor(event.Team)}
          />
        </>
      )}
      <circle cx={X} cy={Y} r={12} fill="transparent" />
      <path
        d={[
          ...["M", X - size, Y - size, "L", X + size, Y + size],
          ...["M", X - size, Y + size, "L", X + size, Y - size],
        ].join(" ")}
        fill="transparent"
        stroke={teamColor(event.Team)}
        strokeWidth={size / 2}
      />
    </g>
  )
}
