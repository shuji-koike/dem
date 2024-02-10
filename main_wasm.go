package main

import (
	"bytes"
	"encoding/json"
	"log"
	"strings"
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
	if len(args) < 2 {
		log.Printf("args error")
	}
	name := args[0].String()
	buf := make([]byte, args[1].Get("byteLength").Int())
	js.CopyBytesToGo(buf, args[1])
	reader := bytes.NewReader(buf)
	callback := func(m Match) {
		args[2].Invoke(toJson(m))
	}
	if strings.HasSuffix(strings.ToLower(name), ".rar") {
		err := ParseRar(reader, name, callback)
		if err != nil {
			log.Printf("parse error %s", err.Error())
		}
		return nil
	}
	match, err := Parse(reader, name, callback)
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
