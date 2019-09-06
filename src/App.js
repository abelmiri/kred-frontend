import React from "react"
import {Route, Switch} from "react-router-dom"
import HomePage from "./Components/HomePage"
import LoginPage from "./Components/LoginPage"

const App = () =>
    <React.Fragment>
        <Switch>
            <Route exact path='/Login' render={() => <LoginPage/>}/>
            <React.Fragment>
                {/*put header here*/}
                <Switch>
                    <Route path='*' render={() => <HomePage/>}/>
                </Switch>
            </React.Fragment>
        </Switch>
        {/*put global things like toast here*/}
    </React.Fragment>

export default App
