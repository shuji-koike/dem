package main

import (
	"github.com/golang/geo/r2"
	"github.com/golang/geo/r3"
	"github.com/markus-wa/demoinfocs-golang/common"
	"github.com/markus-wa/demoinfocs-golang/events"
)

// Match ...
type Match struct {
	TypeName   string `json:"__typename"`
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
	TypeName  string `json:"__typename"`
	Tick      int
	Frame     int
	Round     int
	Started   bool
	TimeLimit int
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
	r2.Point
	ID      int64
	Name    string
	Yaw     float64
	Hp      int
	Flashed float32
	Money   int
	Team    common.Team
	Weapon  common.EquipmentElement
	Weapons []common.EquipmentElement
}

// Nade ...
type Nade struct {
	r2.Point
	ID      int
	Weapon  common.EquipmentElement
	Thrower int64
	Team    common.Team
	Active  bool
	Flames  []r2.Point
}

// NadeEvent ...
type NadeEvent struct {
	ID         int
	Weapon     common.EquipmentElement
	Thrower    int64
	Team       common.Team
	Position   r3.Vector
	Velocity   r3.Vector
	Yaw        float32
	Pitch      float32
	Trajectory []r2.Point
	Tick       int
	Frame      int
	Round      int
}

// KillEvent ...
type KillEvent struct {
	r2.Point
	Killer     int64
	Victim     int64
	Assister   int64
	Weapon     common.EquipmentElement
	Team       common.Team
	IsHeadshot bool
	Penetrated int
	From       r2.Point
	Tick       int
	Frame      int
	Round      int
}

// Bomb ...
type Bomb struct {
	r2.Point
	Planted bool
	State   BombState
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
