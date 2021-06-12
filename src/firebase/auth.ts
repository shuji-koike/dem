import firebase from "firebase/app"
import { useEffect, useState } from "react"

const providers = {
  steam: new firebase.auth.OAuthProvider("steam"),
  facebook: new firebase.auth.FacebookAuthProvider(),
  github: new firebase.auth.GithubAuthProvider(),
  google: new firebase.auth.GoogleAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
}

export async function signIn(
  method: keyof typeof providers
): Promise<firebase.auth.UserCredential> {
  return firebase.auth().signInWithPopup(providers[method])
}

export async function signOut(): Promise<void> {
  return firebase.auth().signOut()
}

export function useAuth(): firebase.User | null {
  const [user, setUser] = useState(firebase.auth().currentUser)
  useEffect(() => firebase.auth().onAuthStateChanged(setUser), [])
  return user
}
