import { getApp, initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import React from "react"
import ReactDOM from "react-dom"

import "./index.css"

initializeApp({
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
  authDomain: `${import.meta.env["VITE_FIREBASE_PROJECT_ID"]}.firebaseapp.com`,
  databaseURL: `https://${
    import.meta.env["VITE_FIREBASE_PROJECT_ID"]
  }.firebaseio.com`,
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
  storageBucket: `${import.meta.env["VITE_FIREBASE_PROJECT_ID"]}.appspot.com`,
  appId: import.meta.env["VITE_FIREBASE_APP_ID"],
})

if (import.meta.env["VITE_FIREBASE_USE_EMULATOR"] === "true") {
  connectAuthEmulator(getAuth(), "http://localhost:9099")
  connectFunctionsEmulator(
    getFunctions(getApp(), "asia-northeast1"),
    "localhost",
    5001
  )
  connectStorageEmulator(getStorage(), "localhost", 8080)
}

const App = React.lazy(() => import("./app"))
ReactDOM.render(
  <React.Suspense fallback="">
    <App />
  </React.Suspense>,
  document.querySelector("#root")
)
