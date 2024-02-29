package main

import (
	"flag"
	"io"
	"log"
	"math"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/golang/geo/r2"
	"github.com/golang/geo/r3"
	"github.com/google/uuid"
	"github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs"
	"github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
	"github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
	"github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/msgs2"
	"github.com/oklog/ulid/v2"
)

const Version = "v0.0.0-alpha"

var Sample = flag.Float64("sample", 16, "frame sample rate")
var FlgTrajectory = flag.Bool("trajectory", false, "enable trajectory")

var debug = log.New(io.Discard, "", log.LstdFlags)
var warn = log.New(os.Stderr, "", log.LstdFlags)

func init() {
	demoinfocs.DefaultParserConfig.MsgQueueBufferSize = 0
}

// Parse ...
func Parse(reader io.Reader, path string, handler func(m Match)) (match Match, err error) {
	log.Printf("%6d| Parse: start", 0)
	if handler == nil {
		handler = func(_ Match) {}
	}
	parser := demoinfocs.NewParser(reader)
	header, err := parser.ParseHeader()
	if err != nil {
		return
	}
	log.Printf("%6d| ParseHeader\t%#v", 0, header)

	var MapName = header.MapName
	mapMetadata := GetLegacyMapMetadata(MapName)
	log.Printf("%6d| GetLegacyMapMetadata\t%#v", 0, mapMetadata)

	normalize := func(point r3.Vector) r2.Point {
		x, y := mapMetadata.TranslateScale(point.X, point.Y)
		return r2.Point{X: math.Round(x), Y: math.Round(y)}
	}
	normalizeSafe := func(p *common.Player) r2.Point {
		if p == nil {
			return r2.Point{}
		}
		return normalize(p.Position())
	}

	state := parser.GameState()
	var round Round
	var bomb Bomb
	nades := make(map[int64]NadeEvent)
	activeNades := make(map[ulid.ULID]*common.Equipment)

	getNadeIsActive := func(e *common.Equipment) bool {
		if e == nil || e.Entity == nil {
			return false
		}
		_, ok := activeNades[e.UniqueID2()]
		if ok {
			return true
		}
		if e.Type == common.EqSmoke {
			prop, ok := e.Entity.PropertyValue("m_nSmokeEffectTickBegin")
			if ok && prop.IntVal != 0 {
				return true
			}
		}
		return false
	}

	parser.RegisterNetMessageHandler(func(msg *msgs2.CSVCMsg_ServerInfo) {
		log.Printf("%6d| CSVCMsg_ServerInfo\t%s", parser.CurrentFrame(), msg.GetMapName())
		MapName = msg.GetMapName()
		match.MapName = MapName
		mapMetadata = GetLegacyMapMetadata(MapName)
	})

	startMatch := func() {
		match = Match{
			TypeName:   "Match",
			FileName:   filepath.Base(path),
			Version:    Version,
			UUID:       uuid.NewString(),
			TickRate:   int(math.Max(math.Round(parser.TickRate()), 64)),  // FIXME
			FrameRate:  int(math.Max(math.Round(header.FrameRate()), 64)), // FIXME
			MapName:    MapName,
			Started:    true,
			Rounds:     make([]Round, 0),
			KillEvents: make([]KillEvent, 0),
			NadeEvents: make([]NadeEvent, 0),
		}
	}
	startMatch()

	parser.RegisterEventHandler(func(e events.MatchStart) {
		log.Printf("%6d| MatchStart\t[%d]\tstarted=%t\twarmup=%t\tTickRate=%.1f\tFrameRate=%.1f\n",
			parser.CurrentFrame(),
			state.TotalRoundsPlayed(),
			state.IsMatchStarted(),
			state.IsWarmupPeriod(),
			parser.TickRate(),
			header.FrameRate())
		if match.Ended || match.Started && state.IsWarmupPeriod() {
			return
		}
		startMatch()
	})
	parser.RegisterEventHandler(func(e events.RoundStart) {
		log.Printf("%6d| RoundStart\t[%d]\tstarted=%t\twarmup=%t\n",
			parser.CurrentFrame(),
			state.TotalRoundsPlayed(),
			state.IsMatchStarted(),
			state.IsWarmupPeriod())
		BombTime, err := state.Rules().BombTime()
		if err != nil {
			debug.Printf("%6d| RoundStart\tBombTime\t%s", parser.CurrentFrame(), err.Error())
			BombTime = time.Duration(40 * time.Second)
		}
		round = Round{
			TypeName:  "Round",
			Tick:      state.IngameTick(),
			Frame:     parser.CurrentFrame(),
			Round:     state.TotalRoundsPlayed(),
			TimeLimit: e.TimeLimit,
			FragLimit: e.FragLimit,
			Objective: e.Objective,
			BombTime:  BombTime.Round(time.Millisecond).Seconds(),
			Frames:    make([]Frame, 0),
		}
		bomb = Bomb{}
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
	})
	parser.RegisterEventHandler(func(e events.RoundEndOfficial) {
		log.Printf("%6d| RoundEndOfficial\t[%d]\n", parser.CurrentFrame(), round.Round)
		if match.Started && !match.Ended && round.Started &&
			round.Winner != common.TeamSpectators &&
			round.Reason != events.RoundEndReason(0) {
			match.Rounds = append(match.Rounds, round)
			handler(match)
		} else {
			log.Printf("%6d| RoundEndOfficial\t[%d]\tdiscarded\n", parser.CurrentFrame(), round.Round)
		}
	})
	parser.RegisterEventHandler(func(e events.AnnouncementWinPanelMatch) {
		log.Printf("%6d| AnnouncementWinPanelMatch\n", parser.CurrentFrame())
		match.Ended = true
	})

	parser.RegisterEventHandler(func(e events.GrenadeProjectileThrow) {
		debug.Printf("%6d| GrenadeProjectileThrow\t%d\n", parser.CurrentFrame(),
			e.Projectile.UniqueID())
		if e.Projectile.Thrower == nil {
			warn.Printf("%6d| GrenadeProjectileThrow\tThrower is nil\n", parser.CurrentFrame())
			return
		}
		nades[e.Projectile.UniqueID()] = NadeEvent{
			Position: e.Projectile.Thrower.Position(),
			Velocity: e.Projectile.Thrower.Velocity(),
			Yaw:      e.Projectile.Thrower.ViewDirectionX(),
			Pitch:    e.Projectile.Thrower.ViewDirectionY(),
		}
	})

	parser.RegisterEventHandler(func(e events.FlashExplode) {
		debug.Printf("%6d| FlashExplode\t%d\t%d\t%d\n", parser.CurrentFrame(),
			e.GrenadeEntityID, e.Thrower.Team, e.Thrower.SteamID64)
		proj, ok := state.GrenadeProjectiles()[e.GrenadeEntityID]
		if !ok {
			debug.Printf("%6d| FlashExplode\tProjectile Not Found", parser.CurrentFrame())
			return
		}
		trajectory := make([]r2.Point, 0)
		if *FlgTrajectory {
			for i := range proj.Trajectory2 {
				trajectory[i] = normalize(proj.Trajectory2[i].Position)
			}
		}
		nade, ok := nades[e.Grenade.UniqueID()]
		if !ok {
			debug.Printf("%6d| FlashExplode\tProjectile Not Found", parser.CurrentFrame())
		}
		match.NadeEvents = append(match.NadeEvents, NadeEvent{
			ID:         e.GrenadeEntityID,
			Weapon:     e.GrenadeType,
			Thrower:    uint64(e.Thrower.SteamID64),
			Team:       e.Thrower.Team,
			Position:   nade.Position,
			Velocity:   nade.Velocity,
			Yaw:        nade.Yaw,
			Pitch:      nade.Pitch,
			Trajectory: trajectory,
			Tick:       state.IngameTick(),
			Frame:      parser.CurrentFrame(),
			Round:      state.TotalRoundsPlayed(),
		})
	})

	parser.RegisterEventHandler(func(e events.SmokeStart) {
		log.Printf("%6d| SmokeStart\t%d\t%v\n", parser.CurrentFrame(),
			e.GrenadeEntityID, e.Grenade.UniqueID2())
		activeNades[e.Grenade.UniqueID2()] = e.Grenade
	})
	parser.RegisterEventHandler(func(e events.SmokeExpired) {
		debug.Printf("%6d| SmokeExpired\t%d\t%d\t%d\n", parser.CurrentFrame(),
			e.GrenadeEntityID, e.Thrower.Team, e.Thrower.SteamID64)
		proj, ok := state.GrenadeProjectiles()[e.GrenadeEntityID]
		if !ok {
			debug.Printf("%6d| SmokeExpired\tProjectile Not Found", parser.CurrentFrame())
			return
		}
		trajectory := make([]r2.Point, 0)
		if *FlgTrajectory {
			for i := range proj.Trajectory2 {
				trajectory[i] = normalize(proj.Trajectory2[i].Position)
			}
		}
		nade, ok := nades[e.Grenade.UniqueID()]
		if !ok {
			// FIXME
			debug.Printf("%6d| SmokeExpired\tNade Not Found", parser.CurrentFrame())
		}
		match.NadeEvents = append(match.NadeEvents, NadeEvent{
			ID:         e.GrenadeEntityID,
			Weapon:     e.GrenadeType,
			Thrower:    uint64(e.Thrower.SteamID64),
			Team:       e.Thrower.Team,
			Position:   nade.Position,
			Velocity:   nade.Velocity,
			Yaw:        nade.Yaw,
			Pitch:      nade.Pitch,
			Trajectory: trajectory,
			Tick:       state.IngameTick(),
			Frame:      parser.CurrentFrame(),
			Round:      state.TotalRoundsPlayed(),
		})
	})

	parser.RegisterEventHandler(func(e events.PlayerFlashed) {
		debug.Printf("%6d| PlayerFlashed\n", parser.CurrentFrame()) // FIXME: NPE
	})

	parser.RegisterEventHandler(func(e events.Kill) {
		debug.Printf("%6d| KillEvents\t%#v\n", parser.CurrentFrame(), e)
		if !match.Started || match.Ended || !round.Started {
			return
		}
		match.KillEvents = append(match.KillEvents, KillEvent{
			Killer:        getSteamID(e.Killer),
			Victim:        getSteamID(e.Victim),
			Assister:      getSteamID(e.Assister),
			Weapon:        getWeapon(e.Weapon),
			Team:          getTeam(e.Victim),
			Penetrated:    e.PenetratedObjects,
			IsHeadshot:    e.IsHeadshot,
			AssistedFlash: e.AssistedFlash,
			AttackerBlind: e.AttackerBlind,
			NoScope:       e.NoScope,
			ThroughSmoke:  e.ThroughSmoke,
			Distance:      e.Distance,
			Tick:          state.IngameTick(),
			Frame:         parser.CurrentFrame(),
			Round:         state.TotalRoundsPlayed(),
			Point:         normalizeSafe(e.Victim),
			From:          normalizeSafe(e.Killer),
		})
	})

	parser.RegisterEventHandler(func(e events.PlayerHurt) {
		debug.Printf("%6d| PlayerHurt\t%#v\n", parser.CurrentFrame(), e)
	})
	parser.RegisterEventHandler(func(e events.Footstep) {
		debug.Printf("%6d| Footstep\t%#v\n", parser.CurrentFrame(), e)
	})

	parser.RegisterEventHandler(func(e events.BombEventIf) {
		debug.Printf("%6d| BombEventIf\t%#v\n", parser.CurrentFrame(), e)
		switch bombEvent := e.(type) {
		case events.BombPlantBegin:
			bomb.State |= BombPlanting
		case events.BombPlantAborted:
			bomb.State ^= BombPlanting
		case events.BombPlanted:
			bomb.State = BombPlanted
			round.BombSite = string(bombEvent.Site)
		case events.BombDefuseStart:
			bomb.State |= BombDefusing
		case events.BombDefuseAborted:
			bomb.State ^= BombDefusing
		case events.BombDefused:
			bomb.State = BombDefused
		case events.BombExplode:
			bomb.State = BombExploded
		default:
			bomb.State = 0
		}
	})

	parser.RegisterEventHandler(func(e events.FrameDone) {
		debug.Printf("%6d| FrameDone\t%p\n", parser.CurrentFrame(), e)
		if !state.IsMatchStarted() || state.IsWarmupPeriod() {
			return
		}
		if !match.Started || match.Ended || !round.Started {
			return
		}

		fps := int(math.Max(math.Round(*Sample*math.Max(header.FrameRate(), 64)/64), 1))
		if parser.CurrentFrame()%fps != 0 {
			return
		}
		frame := Frame{
			Tick:    state.IngameTick(),
			Frame:   parser.CurrentFrame(),
			Bomb:    bomb,
			Players: make([]Player, 0),
			Nades:   make([]Nade, 0),
		}
		frame.Bomb.Point = normalize(state.Bomb().Position())
		for _, p := range state.Participants().Playing() {
			player := Player{
				ID:    p.SteamID64,
				Name:  p.Name,
				Team:  p.Team,
				Money: p.Money(),
			}
			if p.IsAlive() {
				player.Point = normalize(p.Position())
				player.Yaw = math.Round(float64(p.ViewDirectionX()))
				player.Hp = p.Health() // TODO
				if p.ActiveWeapon() != nil {
					player.Weapon = p.ActiveWeapon().Type
				}
				for _, w := range p.Weapons() {
					// FIXME astralis-vs-natus-vincere-m2-inferno.dem round 7, electronic gets 2 AKs
					player.Weapons = append(player.Weapons, w.Type)
				}
				if p.HasDefuseKit() {
					player.Weapons = append(player.Weapons, common.EqDefuseKit)
					player.State ^= HasDefuseKit
				}
				if p.HasHelmet() {
					player.State ^= HasHelmet
				}
				if p.Armor() > 0 {
					player.State ^= HasArmor
				}
				if p.IsDucking() {
					player.State ^= IsDucking
				}
				if p.IsReloading {
					player.State ^= IsReloading
				}
				if p.IsUnknown {
					player.State ^= IsUnknown
				}
				sort.Slice(player.Weapons, func(i, j int) bool {
					return int(player.Weapons[i]) < int(player.Weapons[j])
				})
			} else {
				player.Point = normalize(p.LastAlivePosition)
			}
			if p.FlashDuration > 0 {
				d := p.FlashDuration
				d -= float32(state.IngameTick()-p.FlashTick) / float32(parser.TickRate())
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
			frame.Nades = append(frame.Nades, Nade{
				ID:      int(e.UniqueID()),
				Weapon:  e.WeaponInstance.Type,
				Point:   normalize(e.Position()),
				Thrower: getSteamID(e.Thrower),
				Team:    getTeam(e.Thrower),
				Active:  getNadeIsActive(e.WeaponInstance),
			})
			sort.Slice(frame.Nades, func(i, j int) bool {
				return frame.Nades[i].ID < frame.Nades[j].ID
			})
		}
		for _, e := range state.Infernos() {
			frame.Nades = append(frame.Nades, Nade{
				ID:      int(e.UniqueID()),
				Thrower: getSteamID(e.Thrower()),
				Team:    getTeam(e.Thrower()),
				Active:  true,
				Flames: func() []r2.Point {
					defer func() {
						recover() // FIXME
					}()
					arr := e.Fires().ConvexHull2D()
					for i, f := range arr {
						arr[i] = normalize(r3.Vector{X: f.X, Y: f.Y})
					}
					return arr
				}(),
			})
		}
		round.Frames = append(round.Frames, frame)
	})

	parser.RegisterEventHandler(func(e events.ParserWarn) {
		log.Printf("%6d| ParserWarn\t%s\n", parser.CurrentFrame(), e.Message)
	})

	err = parser.ParseToEnd()
	if err == demoinfocs.ErrUnexpectedEndOfDemo {
		warn.Printf("%6d| ErrUnexpectedEndOfDemo\n", parser.CurrentFrame())
		err = nil
	} else if err != nil {
		warn.Printf("%6d| ParseError\t%s\n", parser.CurrentFrame(), err.Error())
	} else if !match.Ended {
		warn.Printf("%6d| ParseToEnd\tUnexpected end\n", parser.CurrentFrame())
	} else {
		log.Printf("%6d| ParseToEnd\tEnded=%t\n", parser.CurrentFrame(), match.Ended)
	}
	match.Ended = true
	handler(match)
	return
}

func getSteamID(p *common.Player) uint64 {
	if p == nil {
		return 0
	}
	return p.SteamID64
}
func getTeam(p *common.Player) common.Team {
	if p == nil {
		return common.TeamUnassigned
	}
	return p.Team
}
func getWeapon(p *common.Equipment) common.EquipmentType {
	if p == nil {
		return common.EqUnknown
	}
	return p.Type
}
