import React, {PureComponent} from "react"
import LoginPage from "./Components/LoginPage"
import Header from "./Components/Header"
import HomePage from "./Components/HomePage"
import Footer from "./Components/Footer"
import {Switch, Route, Redirect} from "react-router-dom"
import ExchangeBookPage from "./Components/ExchangeBookPage"

class App extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            redirect: false,
            page: "/",
            user: null,
            exchanges: [],
            cities: {},
        }
        this.goToExchangeBook = this.goToExchangeBook.bind(this)
    }

    componentDidMount()
    {
        if (localStorage.hasOwnProperty("user")) this.setState({...this.state, user: JSON.parse(localStorage.getItem("user"))})
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

    setUser = (user) =>
    {
        localStorage.setItem("user", JSON.stringify(user))
        this.setState({...this.state, user})
    }

    setExchanges = (exchanges) => this.setState({...this.state, exchanges})

    setCities = (cities) => this.setState({...this.state, cities: cities.reduce((sum, city) => ({...sum, [city._id]: {...city}}), {})})

    render()
    {
        const {redirect, page, user, cities, exchanges} = this.state
        const {location} = this.props
        return (
            <React.Fragment>
                {redirect && <Redirect push to={page}/>}
                <Switch>
                    <Route exact path='/sign-up' render={() => <LoginPage setUser={this.setUser}/>}/>
                    <React.Fragment>
                        <main className='main'>
                            <Header user={user} location={location.pathname} setUser={this.setUser}/>
                            <Switch>
                                <Route path='/exchange' render={() => <ExchangeBookPage cities={cities} defaultPhone={user ? user.phone : ""} exchanges={exchanges} setExchanges={this.setExchanges} setCities={this.setCities}/>}/>
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