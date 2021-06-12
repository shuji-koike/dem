import React from "react"
import ReactDOM from "react-dom"
import "./firebase/init"
import "./index.css"
import { App } from "./app"

ReactDOM.render(<App />, document.querySelector("body > article"))
