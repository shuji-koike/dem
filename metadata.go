// original source:
// https://github.com/markus-wa/demoinfocs-golang/blob/master/examples/map_metadata.go
// https://github.com/markus-wa/demoinfocs-golang/blob/6c7355688ea7a1d2721a789b4ea1c4f2b273300e/examples/map_metadata.go

package main

import (
	"fmt"
	"log"
)

var mapCodes = map[string]uint32{
	"de_mirage":   1936772555,
	"de_anubis":   3934213780,
	"de_nuke":     4081488007,
	"de_inferno":  3201302029,
	"de_ancient":  4262714479,
	"de_overpass": 2863184063,
	"de_vertigo":  970160341,
}

// Map represents a CS:GO map. It contains information required to translate
// in-game world coordinates to coordinates relative to (0, 0) on the provided map-overviews (radar images).
type Map struct {
	Name  string  `json:"name"`
	PosX  float64 `json:"pos_x,string"`
	PosY  float64 `json:"pos_y,string"`
	Scale float64 `json:"scale,string"`
}

// Translate translates in-game world-relative coordinates to (0, 0) relative coordinates.
func (m Map) Translate(x, y float64) (float64, float64) {
	return x - m.PosX, m.PosY - y
}

// TranslateScale translates and scales in-game world-relative coordinates to (0, 0) relative coordinates.
// The outputs are pixel coordinates for the radar images found in the maps folder.
func (m Map) TranslateScale(x, y float64) (float64, float64) {
	x, y = m.Translate(x, y)
	return x / m.Scale, y / m.Scale
}

// GetMapMetadata fetches metadata for a specific map version from
// `https://radar-overviews.csgo.saiko.tech/<map>/<crc>/info.json`.
// Panics if any error occurs.
// func GetMapMetadata(name string, crc uint32) Map {
// url := fmt.Sprintf("https://radar-overviews.csgo.saiko.tech/%s/%d/info.json", name, crc)

// resp, err := http.Get(url)
// if err != nil {
// 	panic(fmt.Sprintf("failed to get map info.json entry for %q crc:%d", name, crc))
// }

// defer resp.Body.Close()

// var data map[string]Map

// err = json.NewDecoder(resp.Body).Decode(&data)
// if err != nil {
// 	panic(fmt.Sprintf("failed decode map info.json entry for %q crc:%d", name, crc))
// }

// mapInfo, ok := data[name]
// if !ok {
// 	panic(fmt.Sprintf("failed to get map info.json entry for %q", name))
// }

// log.Printf("%#v", mapInfo)

// 	return GetLegacyMapMetadata(name)
// }

// GetMapRadar fetches the radar image for a specific map version from
// `https://radar-overviews.csgo.saiko.tech/<map>/<crc>/radar.png`.
// Panics if any error occurs.
func GetMapRadar(name string, crc uint32) string {
	return fmt.Sprintf("https://radar-overviews.csgo.saiko.tech/%s/%d/radar.png", name, crc)
}

func GetLegacyMapMetadata(name string) Map {
	legacyMap, ok := MapNameToMap[name]
	if !ok {
		return makeMap(name, -3000, 3250, 5.5)
	}
	log.Printf("GetMapRadar: %s", GetMapRadar(name, mapCodes[name]))
	return legacyMap
}

//--

// makeMap creates a map stuct initialized with the given parameters.
func makeMap(name string, x, y, scale float64) Map {
	return Map{Name: name, PosX: x, PosY: y, Scale: scale}
}

// Pre-defined map translations.
var (
	MapDeAncient  = makeMap("de_ancient", -3000, 3250, 5.5) // FIXME
	MapDeAnubis   = makeMap("de_anubis", -3000, 3250, 5.5)  // FIXME
	MapDeCache    = makeMap("de_cache", -2000, 3250, 5.5)
	MapDeCanals   = makeMap("de_canals", -2496, 1792, 4)
	MapDeCbble    = makeMap("de_cbble", -3840, 3072, 6)
	MapDeDust2    = makeMap("de_dust2", -2476, 3239, 4.4)
	MapDeInferno  = makeMap("de_inferno", -2087, 3870, 4.9)
	MapDeMirage   = makeMap("de_mirage", -3230, 1713, 5)
	MapDeNuke     = makeMap("de_nuke", -3453, 2887, 7)
	MapDeOverpass = makeMap("de_overpass", -4831, 1781, 5.2)
	MapDeTrain    = makeMap("de_train", -2477, 2392, 4.7)
	MapDeVertigo  = makeMap("de_vertigo", -3168, 1762, 4)
)

// MapNameToMap translates a map name to a Map.
var MapNameToMap = map[string]Map{
	"de_ancient":  MapDeAncient,
	"de_anubis":   MapDeAnubis,
	"de_cache":    MapDeCache,
	"de_canals":   MapDeCanals,
	"de_cbble":    MapDeCbble,
	"de_dust2":    MapDeDust2,
	"de_inferno":  MapDeInferno,
	"de_mirage":   MapDeMirage,
	"de_nuke":     MapDeNuke,
	"de_overpass": MapDeOverpass,
	"de_train":    MapDeTrain,
	"de_vertigo":  MapDeVertigo,
}
