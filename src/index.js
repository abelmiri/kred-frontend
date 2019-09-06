import React from "react"
import ReactDOM from "react-dom"
import "./Styles/index.scss"
import App from "./App"
import {BrowserRouter} from "react-router-dom"
import serviceWorker from "./serviceWorker"

ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("root"))

serviceWorker()
