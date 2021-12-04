import { initializeApp } from "firebase/app"
import React from "react"
import ReactDOM from "react-dom"

import "./index.css"
import { App } from "./app"

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

ReactDOM.render(<App />, document.querySelector("#root"))
