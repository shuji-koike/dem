import React from "react"
import { isSafari } from "react-device-detect"

import {
  NadeColor,
  bombColor,
  colorToMatrix,
  pointToTuple,
  pointsToString,
  rotatePoint,
  teamColor,
  icon,
} from "."
import { useMatch } from "../hooks/useMatch"

export const FrameView: React.FC = () => {
  const { frame } = useMatch()
  return frame ? (
    <>
      <MolotovView frame={frame}></MolotovView>
      {(frame.Players || []).map((e) => (
        <FramePlayer key={e.ID} player={e}></FramePlayer>
      ))}
      <BombView frame={frame}></BombView>
      {(frame.Nades || []).map((e) => (
        <NadeView key={e.ID} nade={e}></NadeView>
      ))}
    </>
  ) : (
    <></>
  )
}

export const FramePlayer: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <g onClick={() => console.debug(JSON.stringify(player))}>
      {!player.Hp ? (
        <path
          d={[
            "M",
            player.X - 4,
            player.Y - 4,
            "L",
            player.X + 4,
            player.Y + 4,
            "M",
            player.X - 4,
            player.Y + 4,
            "L",
            player.X + 4,
            player.Y - 4,
          ].join(" ")}
          fill="transparent"
          stroke={teamColor(player.Team)}
          strokeWidth={2}
        ></path>
      ) : (
        <>
          <circle
            cx={player.X}
            cy={player.Y}
            r="8"
            fill={teamColor(player.Team)}
          />
          <circle
            cx={player.X}
            cy={player.Y}
            r="12"
            fill="white"
            fillOpacity={player.Flashed ? 0.5 : 0}
          />
          <path
            d={[
              ...["M", ...pointToTuple(rotatePoint(player, -player.Yaw, 2))],
              ...["L", ...pointToTuple(rotatePoint(player, -player.Yaw, 12))],
            ].join(" ")}
            strokeWidth={2}
            stroke="#fff"
            fill="transparent"
          />
        </>
      )}
      <text
        x={player.X + 15}
        y={player.Y}
        fontSize="14"
        fill={player.Hp ? "#eee" : "#888"}
        fontFamily="monospace"
      >
        {player.Name}
      </text>
    </g>
  )
}

export const TrailView: React.FC = () => {
  const { round } = useMatch()
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const context = ref.current?.getContext?.("2d")
    if (context) {
      context.clearRect(0, 0, 1024, 1024)
      round?.Frames.forEach((e) => {
        for (const player of e.Players) {
          context.fillStyle = teamColor(player.Team)
          context.fillRect(player.X, player.Y, 1, 1)
        }
      })
    }
  }, [round])
  if (isSafari) return // ref https://bugs.webkit.org/show_bug.cgi?id=23113
  return (
    <foreignObject x={0} y={0} width={1024} height={1024}>
      <canvas ref={ref} width="1024" height="1024"></canvas>
    </foreignObject>
  )
}

export const BombView: React.FC<{ frame: Frame }> = ({ frame }) => {
  return (
    <g>
      <image
        x={frame.Bomb.X - 8}
        y={frame.Bomb.Y - 13}
        href={icon("404")}
        width="15"
        height="25"
        filter="url(#BombColor)"
      />
      <filter id="BombColor">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values={colorToMatrix(bombColor(frame.Bomb.State))}
        />
      </filter>
    </g>
  )
}

export const MolotovView: React.FC<{ frame: Frame }> = ({ frame }) => {
  return (
    <g>
      {frame.Nades?.filter((e) => e.Flames?.length).map((nade, i) => (
        <polygon
          key={i}
          points={pointsToString(nade.Flames || [])}
          stroke={teamColor(nade.Team)}
          strokeOpacity={0.75}
          strokeWidth="2"
          fill="#8e0c05"
          fillOpacity={0.25}
        />
      ))}
    </g>
  )
}

export const NadeView: React.FC<{ nade: Nade }> = ({ nade }) => {
  if (!nade.Weapon) return null
  return nade.Weapon === 505 && nade.Active ? (
    <circle
      cx={nade.X}
      cy={nade.Y}
      r="24"
      fill="#fff"
      fillOpacity={0.5}
      stroke={teamColor(nade.Team)}
      strokeOpacity={0.75}
      strokeWidth="2"
    />
  ) : (
    <circle
      cx={nade.X}
      cy={nade.Y}
      r="5"
      fill={NadeColor[nade.Weapon]}
      stroke={teamColor(nade.Team)}
      strokeWidth="2"
    />
  )
}
