import { getApp } from "firebase/app"
import { httpsCallable, getFunctions } from "firebase/functions"
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
    httpsCallable<{ steamids: string }, { players: SteamUser[] }>(
      getFunctions(getApp(), "asia-northeast1"),
      "getPlayerSummaries"
    )(data)
      .then(({ data }) =>
        data.players.reduce((acc, e) => ({ ...acc, [e.steamid]: e }), {})
      )
      .then(setState)
  }, [ids.join(",")])
  return state
}
