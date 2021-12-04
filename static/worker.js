import "./wasm_exec"

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
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(
    // fetch((await import("./main.wasm?url")).default),
    fetch("/static/main.wasm")
      .then((res) => (res.ok ? res : Promise.reject()))
      .catch(() => fetch("https://csgo.tokyo/static/main.wasm")),
    go.importObject
  )
  go.run(instance)
}
