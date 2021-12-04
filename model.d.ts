declare enum Team {
  Unassigned = 0,
  Spectators = 1,
  Terrorists = 2,
  CounterTerrorists = 3,
}

interface Match {
  __typename: "Match"
  Version: string
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
  TimeLimit: number
  Winner: Team
  Reason: number
  Frames: Frame[]
  BombSite: string
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
  State: number
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
  Position: Vector
  Velocity: Vector
  Yaw: number
  Pitch: number
  Trajectory: Point[] | null
  Tick: number
  Frame: number
  Round: number
}

interface KillEvent extends Point {
  Killer: number
  Victim: number
  Assister: number
  Weapon: number
  Team: Team
  IsHeadshot: boolean
  Penetrated: number
  From: Point
  Tick: number
  Frame: number
  Round: number
}

interface Point {
  X: number
  Y: number
}

interface Vector {
  X: number
  Y: number
  Z: number
}

interface Bomb extends Point {
  State: number
}
