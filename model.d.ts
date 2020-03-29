declare enum Team {
  Unassigned = 0,
  Spectators = 1,
  Terrorists = 2,
  CounterTerrorists = 3
}

declare enum BombState {
  Planting = 1,
  Planted = 1 << 1,
  Defusing = 1 << 2,
  Defused = 1 << 3,
  Exploded = 1 << 4
}

interface Match {
  __typename: "Match"
  TickRate: number
  FrameRate: number
  MapName: string
  Started: boolean
  Ended: boolean
  Rounds: Round[] | null
  NadeEvents: NadeEvent[]
  KillEvents: KillEvent[]
}

interface Round {
  __typename: "Round"
  Tick: number
  Frame: number
  Round: number
  Started: boolean
  Winner: Team
  Reason: number
  Frames: Frame[]
}

interface Frame {
  Tick: number
  Frame: number
  Players: Player[]
  Nades: Nade[] | null
  Bomb: Bomb
}

interface Player extends Point {
  ID: number
  Name: string
  Yaw: number
  Hp: number
  Flashed: number
  Money: number
  Team: Team
  Weapon: number
  Weapons: number[] | null
}

interface Nade extends Point {
  ID: number
  Weapon: number
  Thrower: number
  Team: Team
  Active: boolean
  Flames: Point[] | null
}

interface NadeEvent {
  ID: number
  Weapon: number
  Thrower: number
  Team: Team
  Trajectory: Point[] | null
  Tick: number
  Frame: number
  Round: number
}

interface KillEvent {
  Killer: number
  Victim: number
  Assister: number
  Weapon: number
  Team: Team
  IsHeadshot: boolean
  Penetrated: number
  Tick: number
  Frame: number
  Round: number
}

interface Point {
  X: number
  Y: number
}

interface Bomb extends Point {
  State: number
}
