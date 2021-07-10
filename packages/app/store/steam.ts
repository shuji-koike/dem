import firebase from "firebase/app"
import { useEffect, useState } from "react"

export interface SteamUser {
  steamid: string
  profileurl: string
  avatar: string
}

export type SteamUsers = Record<string, SteamUser>

export function useSteamUsers(ids: number[] = []): SteamUsers {
  const data = { steamids: [...new Set(ids)].sort().join(",") }
  const [state, setState] = useState<SteamUsers>({})
  useEffect(() => {
    getPlayerSummaries(data).then(setState)
  }, [ids.join(",")])
  return state
}

async function getPlayerSummaries(data: {
  steamids: string
}): Promise<SteamUsers> {
  const players = await firebase
    .app()
    .functions("asia-northeast1")
    .httpsCallable("getPlayerSummaries")(data)
    .then<SteamUser[]>((e) => e.data?.response?.players)
  if (!players) {
    console.error("getPlayerSummaries")
    return {}
  }
  return players.reduce((acc, e) => ({ ...acc, [e.steamid]: e }), {})
}
