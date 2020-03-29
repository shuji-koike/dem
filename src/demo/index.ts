import axios from "axios";

export enum Team {
  Unassigned = 0,
  Spectators = 1,
  Terrorists = 2,
  CounterTerrorists = 3
}

export enum BombState {
  Planting = 1,
  Planted = 1 << 1,
  Defusing = 1 << 2,
  Defused = 1 << 3,
  Exploded = 1 << 4
}

export type Dict<V = string> = {
  [key: string]: V;
};

export const TeamOpponent: Map<Team, Team> = new Map([
  [Team.Terrorists, Team.CounterTerrorists],
  [Team.CounterTerrorists, Team.Terrorists]
]);

export const TeamColor: Dict<string> = {
  [Team.Unassigned]: "#F00",
  [Team.Spectators]: "#0F0",
  [Team.Terrorists]: "#CC9629",
  [Team.CounterTerrorists]: "#295FCC"
};

export function teamColor(n: Team): string {
  return TeamColor[n || 0];
}

export function teamOpponentColor(n: Team): string {
  return TeamColor[TeamOpponent.get(n) || 0];
}

export const NadeColor: Dict<string> = {
  501: "gray", // EqDecoy
  502: "red", // EqMolotov
  503: "red", // EqIncendiary
  504: "#A1E6C9", // EqFlash
  505: "white", // EqSmoke
  506: "purple" // EqHE
};

export const bombColorMatrix = (state: BombState) =>
  colorToMatrix(bombColor(state));

export function bombColor(state: BombState) {
  return (
    {
      [BombState.Planting]: "#FFFF00",
      [BombState.Planted]: "#CC9629",
      [BombState.Defusing]: "#3567CC",
      [BombState.Defused]: "#3567CC",
      [BombState.Exploded]: "#FF0000"
    }[state] || "#FFFFFF"
  );
}

export function colorToMatrix(hex: string) {
  const [r, g, b] = (hex.slice(1).match(/.{2}/g) || []).map(
    a => parseInt(a, 16) / 255
  );
  return [
    [0, 0, 0, 0, r],
    [0, 0, 0, 0, g],
    [0, 0, 0, 0, b],
    [0, 0, 0, 1, 0]
  ]
    .flat()
    .join(" ");
}

export async function fetchSteamData(ids: number[]) {
  const url =
    "/api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=" +
    Array.from(new Set(ids)).join(",");
  const { data } = await axios.get(url);
  return data.response?.players?.reduce?.(
    (acc: any, e: any) => (acc[e.steamid] = e),
    {}
  );
}
