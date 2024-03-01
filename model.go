package main

import (
	"github.com/golang/geo/r3"
	"github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
	"github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
)

// Match ...
type Match struct {
	TypeName   string
	FileName   string
	Version    string
	UUID       string
	TickRate   int
	FrameRate  int
	MapName    string
	Started    bool
	Ended      bool
	Rounds     []Round
	NadeEvents []NadeEvent
	KillEvents []KillEvent
}

// Round ...
type Round struct {
	TypeName  string
	Tick      int
	Frame     int
	Round     int
	Started   bool
	TimeLimit int
	FragLimit int
	Objective string
	BombTime  float64
	Winner    common.Team
	Reason    events.RoundEndReason
	Frames    []Frame
	BombSite  string
}

// Frame ...
type Frame struct {
	Tick    int
	Frame   int
	Players []Player
	Nades   []Nade
	Bomb    Bomb
}

// Player ...
type Player struct {
	r3.Vector
	ID      uint64
	Name    string
	Yaw     float64
	Hp      int
	Flashed float32
	Money   int
	Team    common.Team
	State   PlayerState
	Weapon  common.EquipmentType
	Weapons []common.EquipmentType
}

// Nade ...
type Nade struct {
	r3.Vector
	ID      int
	Weapon  common.EquipmentType
	Thrower uint64
	Team    common.Team
	Active  bool
	Flames  [][3]r3.Vector
}

// NadeEvent ...
type NadeEvent struct {
	ID       int
	Weapon   common.EquipmentType
	Thrower  uint64
	Team     common.Team
	Position r3.Vector
	Velocity r3.Vector
	Yaw      float32
	Pitch    float32
	Tick     int
	Frame    int
	Round    int
}

// KillEvent ...
type KillEvent struct {
	r3.Vector
	Killer        uint64
	Victim        uint64
	Assister      uint64
	Weapon        common.EquipmentType
	Team          common.Team
	Penetrated    int
	IsHeadshot    bool
	AssistedFlash bool
	AttackerBlind bool
	NoScope       bool
	ThroughSmoke  bool
	Distance      float32
	From          r3.Vector
	Tick          int
	Frame         int
	Round         int
}

// Bomb ...
type Bomb struct {
	r3.Vector
	State BombState
}

// BombState ...
type BombState = int

// BombState ...
const (
	BombPlanting BombState = (1 << iota)
	BombPlanted
	BombDefusing
	BombDefused
	BombExploded
)

// PlayerState ...
type PlayerState = int

// PlayerState ...
const (
	HasHelmet = (1 << iota)
	HasArmor
	HasDefuseKit
	HasBomb
	IsBot
	IsConnected
	IsDucking
	IsDefusing
	IsPlanting
	IsReloading
	IsUnknown
)
