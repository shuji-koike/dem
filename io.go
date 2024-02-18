package main

import (
	"fmt"
	"io"
	"log"
	"os"
	"strings"
	"sync"

	"github.com/nwaples/rardecode"
)

func ParseRar(file io.Reader, path string, handler func(m Match)) (err error) {
	reader, err := rardecode.NewReader(file, "")
	if err != nil {
		return err
	}
	for {
		head, err := reader.Next()
		if head == nil {
			break
		}
		if err != nil {
			log.Printf("Error! %s", err)
			continue
		}
		if !strings.HasSuffix(strings.ToLower(head.Name), ".dem") {
			continue
		}
		match, err := Parse(reader, fmt.Sprintf("%s/%s", path, head.Name), handler)
		if err != nil {
			return err
		}
		handler(match)
	}
	return err
}

func ParseRarConcurrent(path string, handler func(m Match)) (err error) {
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
		for i := 0; i < count; i++ {
			head, err = reader.Next()
		}
		if head == nil {
			break
		}
		if err != nil {
			log.Printf("Error! %s", err)
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
