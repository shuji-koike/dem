declare enum Team {
  Unassigned = 0,
  Spectators = 1,
  Terrorists = 2,
  CounterTerrorists = 3,
}

interface Match {
  TypeName: "Match"
  FileName: string
  Version: string
  UUID: string
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
  TypeName: "Round"
  Tick: number
  Frame: number
  Round: number
  Started: boolean
  TimeLimit: number
  FragLimit: number
  Objective: string
  BombTime: number
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

interface Player extends Vector {
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

interface Nade extends Vector {
  ID: number
  Weapon: number
  Thrower: number
  Team: Team
  Active: boolean
  Flames: Vector[][] | null
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
  Tick: number
  Frame: number
  Round: number
}

interface KillEvent extends Vector {
  Killer: number
  Victim: number
  Assister: number
  Weapon: number
  Team: Team
  Penetrated: number
  IsHeadshot: boolean
  AssistedFlash: boolean
  AttackerBlind: boolean
  NoScope: boolean
  ThroughSmoke: boolean
  Distance: number
  From: Vector
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

interface Bomb extends Vector {
  State: number
}
