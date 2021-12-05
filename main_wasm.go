package main

import (
	"bytes"
	"encoding/json"
	"log"
	"syscall/js"
)

// https://golang.org/pkg/syscall/js/

func main() {
	log.Printf("main: start")
	log.SetOutput(&logger{})
	js.Global().Set("wasmParaseDemo", js.FuncOf(wasmParaseDemo))
	select {}
}

type logger struct{}

func (logger) Write(p []byte) (int, error) {
	js.Global().Call("wasmLogger", string(p))
	return len(p), nil
}

func wasmParaseDemo(this js.Value, args []js.Value) interface{} {
	log.Printf("start")
	if len(args) < 1 {
		log.Printf("args error")
	}
	buf := make([]byte, args[0].Get("byteLength").Int())
	js.CopyBytesToGo(buf, args[0])
	match, err := Parse(bytes.NewReader(buf), func(m Match) {
		if len(args) > 1 {
			args[1].Invoke(toJson(m))
		}
	})
	if err != nil {
		log.Printf("parse error %s", err.Error())
	}
	log.Printf("end")
	return toJson(match)
}

func toJson(match Match) js.Value {
	writer := bytes.NewBufferString("")
	json.NewEncoder(writer).Encode(match)
	return js.ValueOf(writer.String())
}
