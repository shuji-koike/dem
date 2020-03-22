onmessage = async function ({ data: [cmd, ...args] }) {
  if (cmd == "wasmParaseDemo") {
    await initWasm()
    self.postMessage([
      cmd,
      JSON.parse(wasmParaseDemo(new Uint8Array(await args[0].arrayBuffer()))),
    ])
  }
}

self.wasmLogger = function (log) {
  self.postMessage(["wasmLogger", log])
}

async function initWasm() {
  self.importScripts("/static/wasm_exec.js")
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch("/static/main.wasm"),
    go.importObject
  )
  go.run(instance)
  return instance
}
