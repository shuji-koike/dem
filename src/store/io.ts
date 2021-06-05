/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import GoWorker from "../../static/worker.js?worker"

export async function pickDir(): Promise<File[]> {
  const files: File[] = []
  for await (const [, e] of await showDirectoryPicker())
    if (e.kind === "file") files.push(await e.getFile())
  return files
}

export async function openDemo(
  file: File | string | null,
  onOutput?: (arr: string[]) => void
): Promise<Match | null> {
  if (typeof file === "string") return fetch(file).then(parseJson)
  if (file?.name.endsWith(".json")) return file.text().then(parseJson)
  if (file?.name.endsWith(".dem")) return parseDemo(file, onOutput)
  return null
}

export function parseJson(data: Response | string): Promise<Match> {
  if (typeof data === "string") return JSON.parse(data)
  return data.json()
}

export function parseDemo(
  file: File | null,
  onOutput?: (arr: string[]) => void
): Promise<Match | null> {
  if (!file) return Promise.resolve(null)
  return new Promise(resolve => {
    const worker: Worker = new GoWorker()
    worker.postMessage(["wasmParaseDemo", file])
    worker.onmessage = function ({ data: [cmd, ...args] }) {
      switch (cmd) {
        case "wasmParaseDemo":
          resolve(args[0])
          worker.terminate()
          break
        case "wasmLogger":
          onOutput?.(args)
          break
      }
    }
  })
}

export function setStorage(match: Match | null): Match | null {
  localStorage.setItem("$MATCH:$TMP", JSON.stringify(match))
  return match
}
