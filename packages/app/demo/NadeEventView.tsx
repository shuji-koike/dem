import React from "react"

import { teamColor } from "."

export const NadeEventView: React.FC<{
  event: NadeEvent
  selected?: boolean
  onClick?: (event: NadeEvent) => void
}> = ({ event, selected, onClick }) => {
  const [hover, setHover] = React.useState(false)
  const active = selected || hover
  return (
    <g>
      <path
        d={event.Trajectory?.map((p, i) =>
          [i === 0 ? "M" : "L", p.X, p.Y].join(" "),
        ).join(" ")}
        fill="transparent"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={active ? 2 : 0.25}
       />
      <circle
        cx={event.Trajectory?.[0]?.X}
        cy={event.Trajectory?.[0]?.Y}
        r={active ? 4 : 2}
        fill={teamColor(event.Team)}
       />
      {event.Trajectory?.slice(-1)?.map((p, i) => (
        <g
          key={i}
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onClick={() => onClick?.(event)}
        >
          <circle cx={p.X} cy={p.Y} r={16} fill="transparent" />
          <circle
            cx={p.X}
            cy={p.Y}
            r={active ? 4 : 2}
            fill="#fff"
            stroke={teamColor(event.Team)}
            strokeWidth={1.5}
           />
        </g>
      ))}
    </g>
  )
}
