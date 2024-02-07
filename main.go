//go:build !wasm

package main

import (
	"flag"
	"log"
	"os"
	"runtime"
	"strings"

	"github.com/shuji-koike/goutil"
)

var dryRun = flag.Bool("dry", false, "dry run")
var stdin = flag.Bool("stdin", false, "read from stdin")
var postfix = flag.String("postfix", ".json.gz", "postfix for cache files")

func main() {
	log.Printf("main: pid=%d %s %v", os.Getpid(), runtime.GOARCH, os.Args)
	flag.Parse()
	log.SetFlags(log.Lshortfile | log.LstdFlags)
	if *stdin {
		Parse(os.Stdin, nil)
	} else {
		for _, path := range os.Args[1:] {
			if !strings.HasPrefix(path, "-") {
				file, err := os.Open(path)
				if err != nil {
					log.Printf("main: error on load %s", err.Error())
				}
				match, err := Parse(file, func(m Match) {
					debug.Printf("load: rounds=%d", len(m.Rounds))
				})
				if err == nil && !*dryRun {
					err = goutil.WriteJSON(path+*postfix, match)
				}
				break
			}
		}
	}
	log.Printf("main: end")
}
