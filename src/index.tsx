import React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"
import "./index.css"

ReactDOM.render(<App />, document.querySelector("body > article"))

declare global {
  class Go {
    importObject: {}
    run: <T = any>(a: WebAssembly.Instance) => Promise<T>
  }
  function wasmParaeDemo(data: Uint8Array): string
}

async function initWasm() {
  await loadScript({ src: "/static/wasm_exec.js" })
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch("/static/main.wasm"),
    go.importObject
  )
  go.run(instance)
  return go
}

export async function parseDemo(file: File): Promise<Match> {
  await initWasm()
  return JSON.parse(wasmParaeDemo(new Uint8Array(await file.arrayBuffer())))
}

export async function loadScript(props: { src: string }) {
  return new Promise(resolve => {
    document.head.append(
      Object.assign(document.createElement("script"), {
        onload: resolve,
        ...props
      })
    )
  })
}
