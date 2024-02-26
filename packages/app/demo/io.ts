import { getAnalytics, logEvent } from "firebase/analytics"
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage"
import { Archive } from "libarchive.js"
import archiveWorker from "libarchive.js/dist/worker-bundle.js?url"
import initGzip, { compress, decompress } from "wasm-gzip"
import gzipWasm from "wasm-gzip/wasm_gzip_bg.wasm?url"

import mainWasm from "/static/main.wasm?url"
import GoWorker from "/static/worker.js?worker"

export async function openDemo(
  file: File | Response | string | null | undefined,
  setOutput?: React.Dispatch<string>,
  onRoundEnd?: React.Dispatch<Match | null | undefined>,
): Promise<Match | null> {
  if (!file) return null
  if (typeof file === "string") {
    if (/^(public|private|sandbox)/.test(file))
      return getDownloadURL(ref(getStorage(), file)).then(fetch).then(parseJson)
    return parseJson(await fetch(file))
  }
  if (file instanceof Response) return parseJson(file)
  try {
    if (import.meta.env.PROD)
      logEvent(getAnalytics(), "openDemo", { file: file?.name })
  } catch (err) {
    console.error(err)
  }
  if (file instanceof File && file.name.endsWith(".json"))
    return parseJson(file)
  if (file instanceof File && file.name.endsWith(".json.gz"))
    return parseJson(file)
  if (file instanceof File && file.name.endsWith(".dem"))
    return parseDemo(file, setOutput, onRoundEnd)
  if (file instanceof File && file.name.endsWith(".rar"))
    return parseDemo(file, setOutput, onRoundEnd)
  if (file instanceof File) throw new Error("unsupported file type!")
  const never: never = file
  throw new Error(never)
}

async function parseJson(
  data: File | Response | ArrayBuffer | Uint8Array | string,
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
  throw new Error(never)
}

export function parseDemo(
  file: File | null,
  setOutput?: React.Dispatch<string>,
  onRoundEnd?: React.Dispatch<Match | null | undefined>,
): Promise<Match | null> {
  if (!file) return Promise.resolve(null)
  return new Promise((resolve) => {
    const worker: Worker = new GoWorker()
    worker.postMessage({ cmd: "wasmParaseDemo", mainWasm, payload: file })
    worker.onmessage = function ({ data: [cmd, ...args] }) {
      switch (cmd) {
        case "wasmParaseDemo":
        case "wasmParaseDemo:MatchEnd":
          resolve(args[0])
          worker.terminate()
          break
        case "wasmParaseDemo:RoundEnd":
          onRoundEnd?.(args[0])
          break
        case "wasmLogger":
          if (!Array.isArray(args[0])) return
          // eslint-disable-next-line no-case-declarations
          const [level, message] = args[0]
          if (level === "debug") console.debug(message)
          else if (level === "info") console.info(message)
          else if (level === "warn") console.warn(message)
          else console.error(level, message)
          setOutput?.(`[${level}] ${message}`)
          break
        default:
          console.error(args)
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
  compress = true,
): Promise<string> {
  const json = typeof data === "string" ? data : JSON.stringify(data)
  if (compress || /\.gz$/i.test(path)) {
    await uploadBytes(ref(getStorage(), path), await gzip(json))
  } else {
    await uploadString(ref(getStorage(), path), json)
  }
  return path
}

export async function storagePutPublicMatch(
  match: Match,
  file: File | string,
): Promise<string> {
  const path = `public/${new Date().getTime()}-${toName(file)}.json.gz`
  return await storagePut(path, match)
}

function toName(file: File | string) {
  return encodeURIComponent(typeof file === "string" ? file : file.name)
}

export function isFile(file: unknown): file is File {
  return file instanceof File
}

export function isValidFile(file: unknown): file is File {
  if (file instanceof File) return /\.(dem|json)(\.gz)?$/i.test(file.name)
  return false
}

export function isArchiveFile(file: unknown): file is File & { __rar: never } {
  if (file instanceof File) return /\.(rar)$/i.test(file.name)
  return false
}

export function setStorage(match: Match | null): Match | null {
  localStorage.setItem("$MATCH:$TMP", JSON.stringify(match))
  return match
}

export async function gzip(input: string): Promise<Uint8Array> {
  await initGzip(await fetch(gzipWasm))
  return compress(input) ?? Promise.reject()
}

export async function gunzip(input: Uint8Array): Promise<Uint8Array> {
  await initGzip(await fetch(gzipWasm))
  return decompress(input) ?? Promise.reject()
}

export async function rarList(file: File & { __rar: never }): Promise<File[]> {
  Archive.init({ workerUrl: archiveWorker })
  const archive = await Archive.open(file)
  if (await archive.hasEncryptedData()) {
    // eslint-disable-next-line no-alert
    alert(`This file is password protected!
Please send a feature request to add support for password protected files.`)
    return []
  }
  // FIXME: use getFilesArray() instead of extractFiles()
  const files = Object.values(await archive.extractFiles()).filter(isFile)
  await archive.close()
  return [file, ...files]
}
