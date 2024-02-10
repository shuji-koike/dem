import React from "react"

import { teamColor, teamOpponentColor } from "."

export const KillEventView: React.FC<{
  event: KillEvent
  selected?: boolean
  onClick?: (event: KillEvent) => void
}> = ({ event, selected, onClick }) => {
  const [hover, setHover] = React.useState(false)
  const active = selected || hover
  const size = active ? 8 : 4
  return (
    <g
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() => onClick?.(event)}
    >
      {event.From.X && event.From.Y && (
        <>
          <circle
            cx={event.From.X}
            cy={event.From.Y}
            r={8}
            fill="transparent"
          />
          <path
            d={["M", event.From.X, event.From.Y, "L", event.X, event.Y].join(
              " ",
            )}
            fill="transparent"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />
          <circle
            cx={event.From.X}
            cy={event.From.Y}
            r={active ? 4 : 2}
            fill={teamOpponentColor(event.Team)}
          />
        </>
      )}
      <circle cx={event.X} cy={event.Y} r={16} fill="transparent" />
      <path
        d={[
          "M",
          event.X - size,
          event.Y - size,
          "L",
          event.X + size,
          event.Y + size,
          "M",
          event.X - size,
          event.Y + size,
          "L",
          event.X + size,
          event.Y - size,
        ].join(" ")}
        fill="transparent"
        stroke={teamColor(event.Team)}
        strokeWidth={size / 2}
      />
    </g>
  )
}
