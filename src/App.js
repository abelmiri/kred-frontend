import React from "react"
import {Route, Switch} from "react-router-dom"
import HomePage from "./Components/HomePage"
import LoginPage from "./Components/LoginPage"
import Footer from "./Components/Footer"
import Header from "./Components/Header"

const App = () =>
    <React.Fragment>
        <Switch>
            <Route exact path='/Login' render={() => <LoginPage/>}/>
            <React.Fragment>
                <Header/>
                <Switch>
                    <Route path='*' render={() => <HomePage/>}/>
                </Switch>
                <Footer/>
            </React.Fragment>
        </Switch>
        {/*put global things like toast here*/}
    </React.Fragment>

export default App
