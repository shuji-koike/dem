import React from "react";
import { TeamColor, NadeColor, bombColorMatrix } from ".";

export const FrameView: React.FC<{
  frame: Frame;
}> = function({ frame }) {
  return (
    <svg viewBox="0 0 1024 1024">
      <MolotovView frame={frame}></MolotovView>
      {(frame.Players || []).map(e => (
        <FramePlayer key={e.ID} player={e}></FramePlayer>
      ))}
      <BombView frame={frame}></BombView>
      {(frame.Nades || []).map(e => (
        <NadeView key={e.ID} nade={e}></NadeView>
      ))}
    </svg>
  );
};

export const FramePlayer: React.FC<{
  player: Player;
}> = function({ player }) {
  return (
    <g key={player.ID}>
      {!player.Hp ? (
        <>
          <rect
            x={player.X - 2}
            y={player.Y - 8}
            width="4"
            height="16"
            fill={TeamColor[player.Team]}
            transform-origin={player.X + "px " + player.Y + "px"}
            transform="rotate(45)"
          />
          <rect
            x={player.X - 2}
            y={player.Y - 8}
            width="4"
            height="16"
            fill={TeamColor[player.Team]}
            transform-origin={player.X + "px " + player.Y + "px"}
            transform="rotate(-45)"
          />
        </>
      ) : (
        <>
          <circle
            cx={player.X}
            cy={player.Y}
            r="10"
            fill={TeamColor[player.Team]}
          />
          <circle
            cx={player.X}
            cy={player.Y}
            r="15"
            fill="white"
            style={{ fillOpacity: player.Flashed ? 0.5 : 0 }}
          />
          <rect
            x={player.X - 2}
            y={player.Y + 5}
            width="4"
            height="10"
            fill="white"
            transform-origin={player.X + "px " + player.Y + "px"}
            transform={"rotate(" + (270 - player.Yaw) + ")"}
          />
        </>
      )}
      <text
        x={player.X + 15}
        y={player.Y}
        fontSize="14"
        fill={player.Hp ? "#eee" : "#888"}
        fontFamily="monospace">
        {player.Name}
      </text>
    </g>
  );
};

export const TrailView: React.FC<{
  round: Round;
  currentFrame: number;
}> = function({ round }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    (async function() {
      const context = canvasRef?.current?.getContext("2d");
      if (context) {
        context.clearRect(0, 0, 1024, 1024);
        round.Frames.forEach(f => {
          for (const e in f.Players) {
            context.fillStyle = TeamColor[f.Players[e].Team];
            context.fillRect(f.Players[e].X, f.Players[e].Y, 1, 1);
          }
        });
      }
    })();
  }, [round]);
  return <canvas ref={canvasRef} width="1024" height="1024"></canvas>;
};

export const BombView: React.FC<{
  frame: Frame;
}> = function({ frame }) {
  return (
    <g>
      <image
        x={frame.Bomb.X - 8}
        y={frame.Bomb.Y - 13}
        xlinkHref="/static/icons/404.png"
        width="15"
        height="25"
        filter="url(#BombColor)"
      />
      <filter id="BombColor">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values={bombColorMatrix(frame.Bomb.State)}
        />
      </filter>
    </g>
  );
};

export const MolotovView: React.FC<{
  frame: Frame;
}> = function({ frame }) {
  return (
    <g>
      {frame.Nades?.filter(e => e.Flames?.length).map((e, i) => (
        <polygon
          key={i}
          points={e.Flames?.map(p => p.X + " " + p.Y).join(" ")}
          stroke="#b50f07"
          strokeWidth="2"
          fill="#8e0c05"
          style={{ fillOpacity: 0.5 }}
        />
      ))}
    </g>
  );
};

export const NadeView: React.FC<{
  nade: Nade;
}> = function({ nade }) {
  return nade.Weapon == 505 && nade.Active ? (
    <circle
      cx={nade.X}
      cy={nade.Y}
      r="24"
      fill="#fff"
      stroke={TeamColor[nade.Team.toString()]}
      strokeWidth="2"
      style={{ fillOpacity: 0.5 }}
    />
  ) : (
    <circle
      cx={nade.X}
      cy={nade.Y}
      r="5"
      fill={NadeColor[nade.Weapon]}
      stroke={TeamColor[nade.Team]}
      strokeWidth="2"
    />
  );
};
