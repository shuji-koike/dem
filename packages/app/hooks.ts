import { getApp } from "firebase/app"
import { getAuth, User } from "firebase/auth"
import { httpsCallable, getFunctions } from "firebase/functions"
import { useEffect, useState } from "react"

export function useAuth(): User | null {
  const [user, setUser] = useState(getAuth().currentUser)
  useEffect(() => getAuth().onAuthStateChanged(setUser), [])
  return user
}

export function useAuthSuspense(): User {
  const user = useAuth()
  if (!user)
    throw new Promise<void>((resolve) => {
      getAuth().onAuthStateChanged(() => resolve())
    })
  return user
}

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

export function useFileDrop(fn: (file: File) => void) {
  function handler(e: DragEvent) {
    ;[...(e.dataTransfer?.files ?? [])].slice(0, 1).forEach(fn)
    e.preventDefault()
    e.stopPropagation()
  }
  useEffect(() => {
    window.addEventListener("drop", handler)
    return () => window.removeEventListener("drop", handler)
  })
}
