//go:build !wasm

package main

import (
	"bytes"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"runtime"
	"strings"
	"sync"

	"github.com/akiver/cs-demo-analyzer/pkg/api"
	"github.com/akiver/cs-demo-analyzer/pkg/api/constants"
	"github.com/shuji-koike/goutil"
	"golang.org/x/sync/singleflight"
)

var dryRun = flag.Bool("dry", false, "dry run")
var stdin = flag.Bool("stdin", false, "read from stdin")
var server = flag.Bool("server", false, "start http server")
var port = flag.Int("port", 4000, "port to listen http requests")
var dir = flag.String("dir", "/srv/app", "demo dir")
var postfix = flag.String("postfix", ".json.gz", "postfix for cache files")
var useMemCache = flag.Bool("useMemCache", false, "use memory cache")
var useFileCache = flag.Bool("useFileCache", false, "use file cache")
var analyzeDemo = flag.Bool("analyzeDemo", false, "use akiver/cs-demo-analyzer")

var group singleflight.Group
var cache = sync.Map{}

func main() {
	log.Printf("main: pid=%d %s %v", os.Getpid(), runtime.GOARCH, os.Args)
	flag.Parse()
	log.SetFlags(log.Lshortfile | log.LstdFlags)
	if *server {
		new(Server).Listen(*port)
	} else if *stdin {
		buf, err := io.ReadAll(os.Stdin)
		if err != nil {
			log.Printf("main: error reading stdin %s", err.Error())
		} else {
			Parse(bytes.NewReader(buf), nil)
		}
	} else if *analyzeDemo {
		analyzeAndExportDemo(os.Args[2])
	} else {
		for _, path := range os.Args[1:] {
			if !strings.HasPrefix(path, "-") {
				_, err := load(path)
				if err != nil {
					log.Printf("main: error on load %s", err.Error())
				}
			}
		}
	}
	log.Printf("main: end")
}

func load(path string) (Match, error) {
	log.Printf("load: path=%s", path)
	if len(path) == 0 {
		return Match{}, errors.New("name is empty")
	}
	v, err, _ := group.Do(path, func() (interface{}, error) {
		var match Match
		var err error
		if m, ok := cache.Load(path); ok {
			return m, nil
		}
		if *useFileCache {
			err = goutil.ReadJSON(path+*postfix, &match)
			if err != nil && !os.IsNotExist(err) {
				log.Printf("load: skip parse. file exists.")
				return match, err
			}
		}
		if !*useFileCache || os.IsNotExist(err) {
			var file *os.File
			file, err = os.Open(path)
			if err != nil {
				return match, err
			}
			defer file.Close()
			match, err = Parse(file, func(m Match) {
				debug.Printf("load: rounds=%d", len(m.Rounds))
			})
			if err == nil && !*dryRun {
				err = goutil.WriteJSON(path+*postfix, match)
			}
		}
		if err == nil && !*dryRun && *useMemCache {
			cache.Store(path, match)
		}
		return match, err
	})
	return v.(Match), err
}

func analyzeAndExportDemo(demoPath string) {
	err := api.AnalyzeAndExportDemo(demoPath, "", api.AnalyzeAndExportDemoOptions{
		IncludePositions: true,
		Source:           constants.DemoSourceValve,
		Format:           constants.ExportFormatJSON,
		MinifyJSON:       false,
	})
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
