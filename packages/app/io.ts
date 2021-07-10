import axios from "axios"
import firebase from "firebase/app"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GoWorker from "../../static/worker.js?worker"

export async function pickDir(): Promise<File[]> {
  const files: File[] = []
  for await (const [, e] of await showDirectoryPicker())
    if (e.kind === "file") files.push(await e.getFile())
  return files
}

export async function openDemo(
  file: File | Response | string | null | undefined,
  onOutput?: (arr: string[]) => void
): Promise<Match | null> {
  if (typeof file === "string") {
    if (/^(public|private|sandbox)/.test(file)) return storageFetch(file)
    return fetch(file).then(parseJson)
  }
  if (file instanceof Response) return parseJson(file)
  if (file instanceof File && file.name.endsWith(".json"))
    return file.text().then(parseJson)
  if (file instanceof File && file.name.endsWith(".dem"))
    return parseDemo(file, onOutput)
  console.warn("openDemo", "unsupported file type!")
  return await Promise.resolve(null)
}

export function parseJson(data: Response | string): Promise<Match> {
  if (typeof data === "string") return JSON.parse(data)
  if (data instanceof Response) return data.json()
  throw new Error()
}

export function parseDemo(
  file: File | null,
  onOutput?: (arr: string[]) => void
): Promise<Match | null> {
  if (!file) return Promise.resolve(null)
  return new Promise((resolve) => {
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

export async function storageList(path = ""): Promise<string[]> {
  return Promise.all(
    (await firebase.storage().ref(path).list()).items.map((e) => e.fullPath)
  )
}

export async function storagePut(
  path: string,
  data: string | Match
): Promise<void> {
  if (typeof data === "object") data = JSON.stringify(data)
  await firebase
    .storage()
    .ref(path)
    .putString(data, undefined, { contentType: "application/json" })
    .then(console.debug)
}

export function storageFetch(path: string): Promise<Match | null> {
  return firebase
    .storage()
    .ref(path)
    .getDownloadURL()
    .then((e) => (typeof e === "string" ? fetch(e).then(parseJson) : null))
}

export function fetchFiles(file = ""): Promise<string[]> {
  return axios.get(`/api/files/${file}`).then(({ data }) => data.sort?.())
}

export function fileTypeFilter(file: unknown): boolean {
  if (file instanceof File) return /\.(dem|json)(\.gz)?$/i.test(file.name)
  return false
}

export interface SteamUser {
  steamid: string
  profileurl: string
  avatar: string
}

export async function fetchSteamData(
  ids: number[]
): Promise<Record<string, SteamUser>> {
  if (!import.meta.env.VITE_STEAM_API) return {}
  const url =
    "/api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=" +
    Array.from(new Set(ids)).join(",")
  const { data } = await axios.get<{
    response?: { players?: SteamUser[] }
  }>(url)
  if (!data.response?.players) throw Error()
  return data.response.players.reduce?.(
    (acc, e) => ({ ...acc, [e.steamid]: e }),
    {}
  )
}

export function setStorage(match: Match | null): Match | null {
  localStorage.setItem("$MATCH:$TMP", JSON.stringify(match))
  return match
}
