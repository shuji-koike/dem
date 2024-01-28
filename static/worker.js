import "./wasm_exec"

onmessage = async function ({ data: { cmd, mainWasm, payload } }) {
  if (cmd === "wasmParaseDemo") {
    await initWasm(mainWasm)
    const data = self.$wasmParaseDemo(
      new Uint8Array(await payload.arrayBuffer()),
      onRoundEnd,
    )
    self.postMessage([cmd, JSON.parse(data)])
  }
}

function onRoundEnd(json) {
  self.postMessage(["wasmParaseDemo:RoundEnd", JSON.parse(json)])
}

// this function will be overrided by main_wasm.go
self.$wasmParaseDemo = function () {
  console.error("wasmParaseDemo not initialized")
}

self.$wasmLogger = function (log) {
  self.postMessage(["wasmLogger", log])
}

async function initWasm(path) {
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch(path),
    go.importObject,
  )
  go.run(instance)
}
