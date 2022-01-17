import axios from "axios"
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage"
import initGzip, { compressStringGzip, decompressGzip } from "wasm-gzip"
import gzipWasm from "wasm-gzip/wasm_gzip_bg.wasm?url"

import mainWasm from "../../static/main.wasm?url"
import GoWorker from "../../static/worker.js?worker"

export async function openDemo(
  file: File | Response | string | null | undefined,
  onOutput?: (arr: string[]) => void,
  onRoundEnd?: (match: Match) => void
): Promise<Match | null> {
  if (typeof file === "string") {
    if (/^(public|private|sandbox)/.test(file)) return storageFetch(file)
    return fetch(file).then(parseJson)
  }
  if (file instanceof Response) return parseJson(file)
  if (file instanceof File && file.name.endsWith(".json"))
    return parseJson(file)
  if (file instanceof File && file.name.endsWith(".json.gz"))
    return parseJson(file)
  if (file instanceof File && file.name.endsWith(".dem"))
    return parseDemo(file, onOutput, onRoundEnd)
  console.warn("openDemo", "unsupported file type!")
  return await Promise.resolve(null)
}

async function parseJson(
  data: File | Response | ArrayBuffer | Uint8Array | string
): Promise<Match> {
  if (typeof data === "string") return JSON.parse(data)
  if (data instanceof Uint8Array)
    return parseJson(new TextDecoder().decode(data))
  if (data instanceof ArrayBuffer)
    return parseJson(await gunzip(new Uint8Array(data)))
  if (data instanceof Response)
    if (data.headers.get("content-type") === "application/octet-stream")
      return data.arrayBuffer().then(parseJson)
    else return data.json()
  if (data instanceof File)
    if (data.name.endsWith(".gz")) return data.arrayBuffer().then(parseJson)
    else return data.text().then(parseJson)
  const never: never = data
  console.error(never)
  throw new Error()
}

export function parseDemo(
  file: File | null,
  onOutput?: (arr: string[]) => void,
  onRoundEnd?: (match: Match) => void
): Promise<Match | null> {
  if (!file) return Promise.resolve(null)
  return new Promise((resolve) => {
    const worker: Worker = new GoWorker()
    worker.postMessage(["wasmParaseDemo", mainWasm, file])
    worker.onmessage = function ({ data: [cmd, ...args] }) {
      switch (cmd) {
        case "wasmParaseDemo":
          resolve(args[0])
          worker.terminate()
          break
        case "wasmParaseDemo:RoundEnd":
          onRoundEnd?.(args[0])
          break
        case "wasmLogger":
          onOutput?.(args)
          break
      }
    }
  })
}

export async function storageList(path: string): Promise<string[]> {
  return (await listAll(ref(getStorage(), path))).items.map((e) => e.fullPath)
}

export async function storagePut(
  path: string,
  data: string | Match,
  compress = true
): Promise<void> {
  const json = typeof data === "string" ? data : JSON.stringify(data)
  if (compress || /\.gz$/.test(path)) {
    await uploadBytes(ref(getStorage(), path), await gzip(json))
  } else {
    await uploadString(ref(getStorage(), path), json)
  }
}

export function storageFetch(path: string): Promise<Match | null> {
  return getDownloadURL(ref(getStorage(), path)).then(fetch).then(parseJson)
}

export function fetchFiles(file = ""): Promise<string[]> {
  return axios.get(`/api/files/${file}`).then(({ data }) => data.sort?.())
}

export function fileTypeFilter(file: unknown): boolean {
  if (file instanceof File) return /\.(dem|json)(\.gz)?$/i.test(file.name)
  return false
}

export function setStorage(match: Match | null): Match | null {
  localStorage.setItem("$MATCH:$TMP", JSON.stringify(match))
  return match
}

export async function gzip(input: string): Promise<Uint8Array> {
  await initGzip(await fetch(gzipWasm))
  const output = compressStringGzip(input)
  if (!output) throw new Error()
  return output
}

export async function gunzip(input: Uint8Array): Promise<Uint8Array> {
  await initGzip(await fetch(gzipWasm))
  const output = decompressGzip(input)
  if (!output) throw new Error()
  return output
}
