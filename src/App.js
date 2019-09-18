import React, {Component} from "react"
import LoginPage from "./Components/LoginPage"
import Header from "./Components/Header"
import HomePage from "./Components/HomePage"
import Footer from "./Components/Footer"
import {Switch, Route, Redirect} from "react-router-dom"
import ExchangeBookPage from "./Components/ExchangeBookPage"

class App extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            redirect: false,
            page: "/",
        }
        this.goToExchangeBook = this.goToExchangeBook.bind(this)
    }

    goToExchangeBook(target, page)
    {
        target.style.color = "transparent"
        const rect = target.getBoundingClientRect()
        target.style.position = "fixed"
        target.style.top = rect.top + "px"
        target.style.height = rect.height + "px"
        target.style.left = rect.left + "px"
        target.style.right = "auto"
        target.style.border = "none"
        document.body.clientWidth > 500 ? target.style.zIndex = "2" : target.style.zIndex = "11"
        target.remove()
        document.body.append(target)
        setTimeout(() =>
        {
            target.style.borderRadius = "100%"
            target.style.height = rect.width + "px"
            target.style.zIndex = "11"
            target.style.left = `calc((100vw - ${rect.width}px) / 2)`
            target.style.top = `calc((100vh - ${rect.width}px) / 2)`
            document.body.clientWidth > 500 ? target.style.transform = "scale(3)" : target.style.transform = "scale(.6)"
            setTimeout(() =>
            {
                document.body.clientWidth > 500 ? target.style.transform = "scale(20)" : target.style.transform = "scale(5)"
                setTimeout(() =>
                {
                    this.setState({...this.state, redirect: true, page}, () =>
                        this.setState({...this.state, redirect: false, page: "/"}, () =>
                        {
                            target.style.opacity = 0
                            setTimeout(() => target.remove(), 800)
                        }),
                    )
                }, 200)
            }, 100)
        }, 20)
    }

    render()
    {
        const {redirect, page} = this.state
        return (
            <React.Fragment>
                {redirect && <Redirect push to={page}/>}
                <Switch>
                    <Route exact path='/Login' render={() => <LoginPage/>}/>
                    <React.Fragment>
                        <main className='main'>
                            <Header/>
                            <Switch>
                                <Route path='/exchange' render={() => <ExchangeBookPage/>}/>
                                <Route path='*' render={() => <HomePage goToExchangeBook={this.goToExchangeBook}/>}/>
                            </Switch>
                            <Footer/>
                        </main>
                    </React.Fragment>
                </Switch>
            </React.Fragment>
        )
    }
}

export default App