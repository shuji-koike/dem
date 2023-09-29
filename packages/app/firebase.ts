import {
  getAnalytics,
  initializeAnalytics,
  logEvent,
  setUserId,
} from "firebase/analytics"
import { getApp, initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { ReactElement, useEffect } from "react"
import { useLocation } from "react-router"

initializeApp({
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
  authDomain: `${import.meta.env["VITE_FIREBASE_PROJECT_ID"]}.firebaseapp.com`,
  databaseURL: `https://${
    import.meta.env["VITE_FIREBASE_PROJECT_ID"]
  }.firebaseio.com`,
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
  storageBucket: `${import.meta.env["VITE_FIREBASE_PROJECT_ID"]}.appspot.com`,
  appId: import.meta.env["VITE_FIREBASE_APP_ID"],
  measurementId: import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"],
})

initializeAnalytics(getApp())

getAuth().onAuthStateChanged(
  (user) => user && setUserId(getAnalytics(), user.uid),
)

if (import.meta.env["VITE_FIREBASE_USE_EMULATOR"] === "true") {
  connectAuthEmulator(getAuth(), "http://localhost:9099")
  connectFunctionsEmulator(
    getFunctions(getApp(), "asia-northeast1"),
    "localhost",
    5001,
  )
  connectStorageEmulator(getStorage(), "localhost", 8080)
}

export function AnalyticsProvider({
  children,
}: {
  children: ReactElement
}): ReactElement {
  const location = useLocation()
  useEffect(() => {
    // eslint-disable-next-line camelcase
    logEvent(getAnalytics(), "page_view", { page_path: location.pathname })
  }, [location.pathname])
  return children
}
