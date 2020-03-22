package main

import (
	"io"
	"io/ioutil"
	"log"
	"math"
	"sort"

	"github.com/golang/geo/r2"
	"github.com/golang/geo/r3"
	"github.com/markus-wa/demoinfocs-golang"
	"github.com/markus-wa/demoinfocs-golang/common"
	"github.com/markus-wa/demoinfocs-golang/events"
	"github.com/markus-wa/demoinfocs-golang/metadata"
)

var debug = log.New(ioutil.Discard, "", log.LstdFlags)

func init() {
	demoinfocs.DefaultParserConfig.MsgQueueBufferSize = 128 * 1024
}

// Parse ...
func Parse(reader io.Reader) (match Match, err error) {
	parser := demoinfocs.NewParser(reader)
	header, err := parser.ParseHeader()
	if err != nil {
		return
	}
	mapMetadata := metadata.MapNameToMap[header.MapName]
	normalize := func(point r3.Vector) r2.Point {
		x, y := mapMetadata.TranslateScale(point.X, point.Y)
		return r2.Point{X: math.Round(x), Y: math.Round(y)}
	}

	state := parser.GameState()
	var round Round
	var bombState BombState

	parser.RegisterEventHandler(func(e events.MatchStart) {
		log.Printf("%6d| MatchStart\tstarted=%t\twarmup=%t\n",
			parser.CurrentFrame(),
			state.IsMatchStarted(),
			state.IsWarmupPeriod())
		if state.IsWarmupPeriod() || match.Started {
			return
		}
		match = Match{
			TickRate:  int(math.Round(parser.TickRate())),
			FrameRate: int(math.Round(header.FrameRate())),
			MapName:   header.MapName,
			Started:   true,
		}
		log.Printf("%6d| TickRate=%d\tFrameRate=%d\n",
			parser.CurrentFrame(), match.TickRate, match.FrameRate)
	})
	parser.RegisterEventHandler(func(e events.RoundStart) {
		log.Printf("%6d| RoundStart\t[%d]\tstarted=%t\twarmup=%t\n",
			parser.CurrentFrame(),
			state.TotalRoundsPlayed(),
			state.IsMatchStarted(),
			state.IsWarmupPeriod())
		round = Round{
			Tick:  state.IngameTick(),
			Frame: parser.CurrentFrame(),
			Round: state.TotalRoundsPlayed(),
		}
		bombState = 0
	})
	parser.RegisterEventHandler(func(e events.RoundFreezetimeEnd) {
		if state.IsMatchStarted() && !state.IsWarmupPeriod() {
			round.Started = true
		}
	})
	parser.RegisterEventHandler(func(e events.RoundEnd) {
		log.Printf("%6d| RoundEnd\t[%d]\tstarted=%t\twarmup=%t\n",
			parser.CurrentFrame(),
			state.TotalRoundsPlayed(),
			state.IsMatchStarted(),
			state.IsWarmupPeriod())
		round.Winner = e.Winner
		round.Reason = e.Reason
		if match.Started && !match.Ended && round.Started &&
			round.Winner != common.TeamSpectators &&
			round.Reason != events.RoundEndReason(0) {
			match.Rounds = append(match.Rounds, round)
		}
	})
	parser.RegisterEventHandler(func(e events.AnnouncementWinPanelMatch) {
		log.Printf("%6d| AnnouncementWinPanelMatch\n", parser.CurrentFrame())
		match.Ended = true
	})

	parser.RegisterEventHandler(func(e events.FlashExplode) {
		debug.Printf("%6d| FlashExplode\t%d\t%d\t%d\n", parser.CurrentFrame(),
			e.GrenadeEntityID, e.Thrower.Team, e.Thrower.SteamID)
		proj := state.GrenadeProjectiles()[e.GrenadeEntityID]
		trajectory := make([]r2.Point, len(proj.Trajectory))
		for i := range proj.Trajectory {
			trajectory[i] = normalize(proj.Trajectory[i])
		}
		match.NadeEvents = append(match.NadeEvents, NadeEvent{
			ID:         e.GrenadeEntityID,
			Weapon:     e.GrenadeType,
			Thrower:    e.Thrower.SteamID,
			Team:       e.Thrower.Team,
			Trajectory: trajectory,
			Tick:       state.IngameTick(),
			Frame:      parser.CurrentFrame(),
			Round:      state.TotalRoundsPlayed(),
		})
	})

	parser.RegisterEventHandler(func(e events.PlayerFlashed) {
		debug.Printf("%6d| PlayerFlashed\t%d\t%d\t%d\n", parser.CurrentFrame(),
			e.Projectile.EntityID, e.Attacker.Team, e.Player.Team)
	})

	parser.RegisterEventHandler(func(e events.Kill) {
		match.KillEvents = append(match.KillEvents, KillEvent{
			Killer:     getSteamID(e.Killer),
			Victim:     getSteamID(e.Victim),
			Assister:   getSteamID(e.Assister),
			Weapon:     getWeapon(e.Weapon),
			Team:       getTeam(e.Killer),
			IsHeadshot: e.IsHeadshot,
			Penetrated: e.PenetratedObjects,
			Tick:       state.IngameTick(),
			Frame:      parser.CurrentFrame(),
			Round:      state.TotalRoundsPlayed(),
		})
	})

	parser.RegisterEventHandler(func(e events.BombEventIf) {
		// log.Printf("%6d| BombEventIf\t%#v\n", parser.CurrentFrame(), e)
		switch e.(type) {
		case events.BombPlantBegin:
			bombState = BombPlanting
		case events.BombPlantAborted:
			bombState = 0
		case events.BombPlanted:
			bombState = BombPlanted
		case events.BombDefuseStart:
			bombState = BombDefusing
		case events.BombDefuseAborted:
			bombState = BombPlanted
		case events.BombDefused:
			bombState = BombDefused
		case events.BombExplode:
			bombState = BombExploded
		}
	})

	parser.RegisterEventHandler(func(_ events.FrameDone) {
		if !state.IsMatchStarted() || state.IsWarmupPeriod() || !round.Started {
			return
		}
		if parser.CurrentFrame()%32 != 0 {
			return
		}
		frame := Frame{
			Tick:  state.IngameTick(),
			Frame: parser.CurrentFrame(),
			Bomb: Bomb{
				Point: normalize(state.Bomb().Position()),
				State: bombState,
			},
		}
		for _, p := range state.Participants().Connected() {
			switch p.Team {
			case common.TeamSpectators, common.TeamUnassigned:
				continue
			}
			player := Player{
				ID:    p.SteamID,
				Name:  p.Name,
				Team:  p.Team,
				Money: p.Money,
			}
			if p.IsAlive() {
				player.Point = normalize(p.Position)
				player.Yaw = math.Round(float64(p.ViewDirectionX))
				player.Hp = p.Hp
				if p.ActiveWeapon() != nil {
					player.Weapon = p.ActiveWeapon().Weapon
				}
				for _, w := range p.Weapons() {
					player.Weapons = append(player.Weapons, w.Weapon)
				}
				if p.HasDefuseKit {
					player.Weapons = append(player.Weapons, common.EqDefuseKit)
				}
				sort.Slice(player.Weapons, func(i, j int) bool {
					return int(player.Weapons[i]) < int(player.Weapons[j])
				})
			} else {
				player.Point = normalize(p.LastAlivePosition)
			}
			if p.FlashDuration > 0 {
				d := p.FlashDuration
				d -= float32(state.IngameTick()-p.FlashTick) / float32(header.TickRate())
				if d > 0 {
					player.Flashed = d
				}
			}
			frame.Players = append(frame.Players, player)
			sort.Slice(frame.Players, func(i, j int) bool {
				if frame.Players[i].Team == frame.Players[j].Team {
					return frame.Players[i].ID < frame.Players[j].ID
				}
				return int(frame.Players[i].Team) > int(frame.Players[j].Team)
			})
		}
		for _, e := range state.GrenadeProjectiles() {
			active := false
			if e.Weapon == common.EqSmoke {
				prop := state.Entities()[e.EntityID].FindProperty("m_nSmokeEffectTickBegin")
				if prop.Value().IntVal != 0 {
					active = true
				}
			}
			frame.Nades = append(frame.Nades, Nade{
				ID:      e.EntityID,
				Weapon:  e.Weapon,
				Point:   normalize(e.Position),
				Thrower: getSteamID(e.Thrower),
				Team:    getTeam(e.Thrower),
				Active:  active,
			})
			sort.Slice(frame.Nades, func(i, j int) bool {
				return frame.Nades[i].ID < frame.Nades[j].ID
			})
		}
		for _, e := range state.Infernos() {
			arr := e.Active().ConvexHull2D()
			for i, f := range arr {
				x, y := mapMetadata.TranslateScale(f.X, f.Y)
				arr[i].X = math.Round(x)
				arr[i].Y = math.Round(y)
			}
			frame.Fires = append(frame.Fires, arr)
		}
		round.Frames = append(round.Frames, frame)
	})

	err = parser.ParseToEnd()
	if err != nil {
		log.Printf("%6d| ParseError\t%s\n", parser.CurrentFrame(), err.Error())
	} else {
		log.Printf("%6d| ParseToEnd\n", parser.CurrentFrame())
	}

	return
}

func getSteamID(p *common.Player) int64 {
	if p == nil {
		return 0
	}
	return p.SteamID
}
func getTeam(p *common.Player) common.Team {
	if p == nil {
		return common.TeamUnassigned
	}
	return p.Team
}
func getWeapon(p *common.Equipment) common.EquipmentElement {
	if p == nil {
		return common.EqUnknown
	}
	return p.Weapon
}
