package main

import (
	"fmt"
	"io"
	"log"
	"strings"

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
			log.Printf("main: Error! %s", err)
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
