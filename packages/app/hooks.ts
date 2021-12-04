import { getAuth, User } from "firebase/auth"
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
