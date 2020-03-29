package main

import (
	"bytes"
	"encoding/json"
	"log"
	"syscall/js"
)

// https://golang.org/pkg/syscall/js/

// StartWasm ...
func main() {
	log.Printf("main: start")
	js.Global().Set("wasmParaeDemo", js.FuncOf(wasmParaeDemo))
	select {}
}

func wasmParaeDemo(this js.Value, args []js.Value) interface{} {
	log.Printf("start")
	if len(args) != 1 {
		log.Printf("args error")
	}
	data := args[0]
	size := data.Get("byteLength").Int()
	buf := make([]byte, size)
	js.CopyBytesToGo(buf, data)
	match, err := Parse(bytes.NewReader(buf))
	if err != nil {
		log.Printf("parse error")
	}
	writer := bytes.NewBufferString("")
	json.NewEncoder(writer).Encode(match)
	log.Printf("end")
	return js.ValueOf(writer.String())
}
