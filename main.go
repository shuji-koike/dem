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
		Parse(os.Stdin, "stdin", nil)
	} else {
		for _, path := range os.Args[1:] {
			if strings.HasPrefix(path, "-") {
				continue
			}
			if strings.HasSuffix(strings.ToLower(path), ".dem") {
				OpenDem(path)
			}
			if strings.HasSuffix(strings.ToLower(path), ".rar") {
				OpenRar(path)
			}
		}
	}
	log.Printf("main: end")
}

func OpenDem(path string) (err error) {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	match, err := Parse(file, path, nil)
	if err == nil && !*dryRun {
		err = goutil.WriteJSON(path+*postfix, match)
	}
	return err
}

func OpenRar(path string) (err error) {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	err = ParseRar(file, path, func(match Match) {
		if !match.Ended {
			return
		}
		err = goutil.WriteJSON(path+*postfix, match)
		if err != nil {
			log.Printf(err.Error())
		}
	})
	return err
}
