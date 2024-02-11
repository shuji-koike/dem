package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"sync"

	"github.com/nwaples/rardecode"
)

func ParseRar(path string, handler func(m Match)) (err error) {
	var wg sync.WaitGroup
	var count = 0
	for {
		wg.Add(1)
		count++
		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()
		reader, err := rardecode.NewReader(file, "")
		if err != nil {
			return err
		}
		var head *rardecode.FileHeader
		// call reader.Next N times
		for i := 0; i < count; i++ {
			head, err = reader.Next()
		}
		if head == nil {
			break
		}
		if err != nil {
			log.Printf("main: Error! %s", err)
			continue
		}
		if !strings.HasSuffix(strings.ToLower(head.Name), ".dem") {
			continue
		}
		go Parse(reader, fmt.Sprintf("%s/%s", path, head.Name), func(match Match) {
			handler(match)
			if match.Ended {
				wg.Done()
			}
		})
	}
	wg.Wait()
	return err
}
