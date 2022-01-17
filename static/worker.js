import "./wasm_exec"

onmessage = async function ({ data: [cmd, ...args] }) {
  if (cmd === "wasmParaseDemo") {
    await initWasm(args[0])
    self.postMessage([
      cmd,
      JSON.parse(
        wasmParaseDemo(new Uint8Array(await args[1].arrayBuffer()), (json) => {
          self.postMessage(["wasmParaseDemo:RoundEnd", JSON.parse(json)])
        })
      ),
    ])
  }
}

self.wasmLogger = function (log) {
  self.postMessage(["wasmLogger", log])
}

async function initWasm(path) {
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch(path),
    go.importObject
  )
  go.run(instance)
}
