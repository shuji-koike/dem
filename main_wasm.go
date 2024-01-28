package main

import (
	"bytes"
	"encoding/json"
	"log"
	"syscall/js"
)

// https://golang.org/pkg/syscall/js/

func main() {
	log.SetOutput(&Logger{Level: "info"})
	warn.SetOutput(&Logger{Level: "warn"})
	js.Global().Set("$wasmParaseDemo", js.FuncOf(wasmParaseDemo))
	log.Printf("initialized")
	select {}
}

type Logger struct {
	Level string
}

func (logger *Logger) Write(p []byte) (int, error) {
	js.Global().Call("$wasmLogger", js.Global().Get("Array").New(logger.Level, string(p)))
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
	log.Printf("end: %t", match.Ended)
	return toJson(match)
}

func toJson(match Match) js.Value {
	writer := bytes.NewBufferString("")
	json.NewEncoder(writer).Encode(match)
	return js.ValueOf(writer.String())
}
