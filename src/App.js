import React, {PureComponent} from "react"
import LoginPage from "./Components/LoginPage"
import Header from "./Components/Header"
import HomePage from "./Components/HomePage"
import {Redirect, Route, Switch} from "react-router-dom"
import api from "./Functions/api"
import ShowVideoPage from "./Components/ShowVideoPage"
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
            categories: {},
        }
        this.goToExchangeBook = this.goToExchangeBook.bind(this)
    }

    componentDidMount()
    {
        if (localStorage.hasOwnProperty("user"))
        {
            const user = JSON.parse(localStorage.getItem("user"))
            this.setState({...this.state, user}, () =>
            {
                api.post("user/login", {phone: user.phone, password: user.password}, "", true)
                    .then((data) => this.setUser(data))
                    .catch((e) =>
                    {
                        if (e.message === "Request failed with status code 404")
                        {
                            localStorage.clear()
                            this.setState({...this.state, user: null})
                        }
                    })
            })
        }
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

    logout = () =>
    {
        localStorage.removeItem("user")
        this.setState({...this.state, user: null})
    }

    setExchanges = (exchanges) => this.setState({...this.state, exchanges})

    setCities = (cities) => this.setState({...this.state, cities: cities.reduce((sum, city) => ({...sum, [city._id]: {...city}}), {})})

    setCategories = (categories) => this.setState({...this.state, categories: categories.reduce((sum, category) => ({...sum, [category._id]: {...category}}), {})})

    render()
    {
        const {redirect, page, user, cities, exchanges, categories} = this.state
        const {location} = this.props
        return (
            <Switch>
                {redirect && <Redirect push to={page}/>}
                <Route exact path='/sign-up' render={() => <LoginPage setUser={this.setUser}/>}/>
                <React.Fragment>
                    <main className='main'>
                        <Header user={user} location={location.pathname} setUser={this.setUser} logout={this.logout}/>
                        <Switch>
                            {/*<Route exact path='/profile' render={() => <ProfilePage user={user}/>}/>*/}
                            <Route path='/exchange' render={() =>
                                <ExchangeBookPage defaultPhone={user ? user.phone : ""}
                                                  cities={cities}
                                                  setCities={this.setCities}
                                                  exchanges={exchanges}
                                                  setExchanges={this.setExchanges}
                                                  categories={categories}
                                                  setCategories={this.setCategories}
                                />
                            }/>
                            <Route path='/videos/:pack' render={(route) => <ShowVideoPage user={user} route={route}/>}/>
                            <Route path='*' render={() => <HomePage goToExchangeBook={this.goToExchangeBook}/>}/>
                        </Switch>
                        {/*<Footer/>*/}
                    </main>
                </React.Fragment>
            </Switch>
        )
    }
}

export default App