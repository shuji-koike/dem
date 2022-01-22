import { setUser as setSentryUser } from "@sentry/react"
import { getApp } from "firebase/app"
import { getAuth, User } from "firebase/auth"
import { httpsCallable, getFunctions } from "firebase/functions"
import { useEffect, useMemo, useState } from "react"

export function useAuth(): User | null {
  const [user, setUser] = useState(getAuth().currentUser)
  useEffect(() => getAuth().onAuthStateChanged(setUser), [])
  useEffect(() => setSentryUser({ id: user?.uid }), [user])
  return user
}

export function useAuthSuspense(): User {
  const user = useAuth()
  if (!user)
    throw new Promise<void>((resolve) => {
      const unsubscribe = getAuth().onAuthStateChanged(() => {
        resolve()
        unsubscribe()
      })
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

export function useFileDrop(setFiles: (files: File[]) => void) {
  function handler(e: DragEvent) {
    setFiles([...(e.dataTransfer?.files ?? [])])
    e.preventDefault()
    e.stopPropagation()
  }
  useEffect(() => {
    window.addEventListener("drop", handler)
    return () => window.removeEventListener("drop", handler)
  })
}

export function useToggle(initialState = false) {
  const [state, setState] = useState<boolean>(initialState)
  return useMemo(
    () => ({
      state,
      setState,
      setFalse: () => setState(false),
      setTrue: () => setState(true),
      toggle: () => setState(!state),
    }),
    [state, setState]
  )
}
