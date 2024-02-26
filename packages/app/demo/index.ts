import { Theme } from "@mui/material"

import icons from "../../../static/icons.json"
import mapData from "../../../static/map_data.json"

export enum Team {
  Unassigned = 0,
  Spectators = 1,
  Terrorists = 2,
  CounterTerrorists = 3,
}

export enum BombState {
  Planting = 1,
  Planted = 1 << 1,
  Defusing = 1 << 2,
  Defused = 1 << 3,
  Exploded = 1 << 4,
}

export enum PlayerState {
  HasHelmet = 1,
  HasArmor = 1 << 1,
  HasDefuseKit = 1 << 2,
  HasBomb = 1 << 3,
  IsBot = 1 << 4,
  IsConnected = 1 << 5,
  IsDucking = 1 << 6,
  IsDefusing = 1 << 7,
  IsPlanting = 1 << 8,
  IsReloading = 1 << 9,
  IsUnknown = 1 << 10,
}

export const teamOpponentMap: ReadonlyMap<Team, Team> = new Map([
  [Team.Terrorists, Team.CounterTerrorists],
  [Team.CounterTerrorists, Team.Terrorists],
])

export const teamColorMap: ReadonlyMap<Team, string> = new Map([
  [Team.Unassigned, "#F00"],
  [Team.Spectators, "#0F0"],
  [Team.Terrorists, "#CC9629"],
  [Team.CounterTerrorists, "#295FCC"],
])

export const teamColorVariantMap = new Map([
  [Team.Unassigned, "info"],
  [Team.Spectators, "info"],
  [Team.Terrorists, "warning"],
  [Team.CounterTerrorists, "success"],
] as const)

export function mapScale(x: unknown): number {
  return (isMapName(x) && mapData[x].scale) || 1
}

export function isMapName(x: unknown): x is keyof typeof mapData {
  return typeof x === "string" && x in mapData
}

export function teamColor(team: Team): string {
  return teamColorMap.get(team) ?? throwDataError()
}

export function teamOpponent(team: Team): Team {
  return teamOpponentMap.get(team) ?? throwDataError()
}

export function teamOpponentColor(team: Team): string {
  return teamColor(teamOpponent(team))
}

export const NadeColor: Record<string, string> = {
  501: "gray", // EqDecoy
  502: "red", // EqMolotov
  503: "red", // EqIncendiary
  504: "#A1E6C9", // EqFlash
  505: "white", // EqSmoke
  506: "purple", // EqHE
}

export function bombColor(state: BombState): string {
  return (
    {
      [BombState.Planting]: "#FFFF00",
      [BombState.Planted]: "#FF0000",
      [BombState.Planted | BombState.Defusing]: "#3567CC",
      [BombState.Defused]: "#3567CC",
      [BombState.Exploded]: "#AA0000",
    }[state] || "#E04800"
  )
}

export function colorToMatrix(hex: string): string {
  const [r, g, b] = (hex.slice(1).match(/.{2}/g) || []).map(
    (a) => parseInt(a, 16) / 255,
  )
  return [
    [0, 0, 0, 0, r],
    [0, 0, 0, 0, g],
    [0, 0, 0, 0, b],
    [0, 0, 0, 1, 0],
  ]
    .flat()
    .join(" ")
}

export function rotatePoint(p: Point, r: number, d: number): Point {
  return {
    X: p.X + Math.cos((r * Math.PI) / 180) * d,
    Y: p.Y + Math.sin((r * Math.PI) / 180) * d,
  }
}

export function pointToTuple(p: Point): [number, number] {
  return [p.X, p.Y]
}

export function pointsToString(arr: Point[]): string {
  return arr.map(pointToTuple).flat().join(" ")
}

export function findRound(
  match: Match | null | undefined,
  tick: number | undefined,
): Round | undefined {
  if (typeof tick !== "number") return
  return match?.Rounds?.find((e) => (e.Frames.at(-1)?.Tick ?? 0) > tick)
}

export function findFrame(
  match: Match | null | undefined,
  tick: number | undefined,
): Frame | undefined {
  if (typeof tick !== "number") return
  return findRound(match, tick)?.Frames.find((e) => e.Tick >= tick)
}

export function findPlayer(match: Match, ID: number): Player | null {
  if (!match.Rounds) return null
  for (const round of match.Rounds)
    for (const frame of round.Frames) {
      const player = frame.Players.find((e) => e.ID === ID)
      if (player) return player
    }
  return null
}

export function findKillEvent(
  match: Match | null | undefined,
  round: Round | null | undefined,
  id: Player["ID"],
) {
  if (!match || !round) return
  return match.KillEvents.find(
    (e) => e.Round === round.Round && e.Victim === id,
  )
}

class PlayerScore {
  ID: number
  Name = ""
  Team: Team = 0
  kills = 0
  assists = 0
  deaths = 0
  headshots = 0
  constructor(ID: number) {
    this.ID = ID
  }
  get headshotPercentage() {
    return ((this.headshots / this.kills) * 100).toFixed(1) + "%"
  }
  get killDeath() {
    return (this.kills / this.deaths).toFixed(2)
  }
}

export function findIndex(
  frames: Frame[],
  fn: (f: Frame) => boolean,
  index = frames.findIndex(fn),
): number {
  return ~index ? index : frames.length - 1
}

export function tickToTime(match: Match, round: Round, tick: number) {
  return ((tick || 0) - (round.Frames[0]?.Tick ?? NaN)) / match.TickRate
}

export function frameToTime(match: Match, round: Round, frame: Frame): number {
  const planted =
    frame.Bomb.State & BombState.Planted
      ? round.Frames.find((e) => e.Bomb.State & BombState.Planted)
      : null
  const time = planted
    ? round.BombTime - (frame.Tick - planted.Tick) / match.TickRate
    : round.TimeLimit - tickToTime(match, round, frame.Tick)
  return Math.max(0, time)
}

export function frameToColor(this: Theme, frame: Frame, theme = this): string {
  if (frame.Bomb.State & BombState.Planted) return theme.palette.warning.main
  return theme.palette.grey[600]
}

export function labelFormat(
  match: Match,
  round: Round,
  frame: Frame | undefined,
) {
  if (!frame) return
  const time = frameToTime(match, round, frame)
  if (Number.isNaN(time)) return
  return new Date(time * 1000).toISOString().slice(14, 19).replace(/^0/, "")
}

export function getRoundScore(
  match: Match | null | undefined,
  Round: number | null | undefined,
) {
  const map = new Map<Team, number>()
  if (!match || !Round) return map
  for (const e of match?.Rounds ?? []) {
    if (Round <= e.Round) break
    map.set(e.Winner, (map.get(e.Winner) ?? 0) + 1)
  }
  return map
}

export function getScores(match: Match): PlayerScore[] {
  const dict: { [key: number]: PlayerScore } = {}
  match.KillEvents.map((e) => [e.Killer, e.Assister, e.Victim])
    .flat()
    .forEach((e) => (dict[e] = new PlayerScore(e)))
  match.KillEvents.forEach((e) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    dict[e.Killer]!.kills += 1
    dict[e.Assister]!.assists += 1
    dict[e.Victim]!.deaths += 1
    dict[e.Killer]!.headshots += e.IsHeadshot ? 1 : 0
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  })
  match.Rounds?.at(-1)
    ?.Frames.at(-1)
    ?.Players.forEach((e) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Object.assign(dict[e.ID]!, { Name: e.Name, Team: e.Team }),
    )
  return Object.entries(dict)
    .map(([, v]) => v)
    .filter((e) => e.ID)
    .sort((a, b) => (a.Team === b.Team ? b.kills - a.kills : a.Team - b.Team))
}

export function sumCache(frame: Frame, team: Team): number {
  return frame.Players.filter((e) => e.Team === team)
    .map((e) => e.Money)
    .reduce((a, b) => a + b, 0)
}

export function setpos(e: {
  Position: Vector
  Yaw: number
  Pitch: number
}): string {
  return [
    `setpos ${e.Position.X} ${e.Position.Y} ${e.Position.Z}`,
    `setang ${e.Yaw} ${e.Pitch}`,
  ].join(";")
}

export function velocity(vector: Vector): string {
  return Object.values(vector)
    .map((e) => Math.floor(e))
    .join(",")
}

export function icon(name: string | number): string {
  return (
    icons.canvas.sprites.find((e) => e.name === String(name))?.src || emptyImage
  )
}

export function armorIcon(State: Player["State"]): string {
  return (
    (State & PlayerState.HasHelmet && icon(403)) ||
    (State & PlayerState.HasArmor && icon(402)) ||
    emptyImage
  )
}

export function smoke2dRadius(match: Match | null | undefined): number {
  const scale = mapScale(match?.MapName)
  return scale ? 144 / scale : NaN
}

export const emptyImage =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="

function throwDataError<T>(): T {
  throw new Error("DataError")
}
