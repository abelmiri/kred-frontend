import React, {lazy, Suspense, PureComponent} from "react"
import Header from "./View/Components/Header"
import {Redirect, Route, Switch} from "react-router-dom"
import api from "./Functions/api"
import {NotificationContainer, NotificationManager} from "react-notifications"
import versionMigrations from "./Functions/versionMigration"

const SignUpPage = lazy(() => import("./View/Pages/SignUpPage"))
const HomePage = lazy(() => import("./View/Pages/HomePage"))
const ExchangeBookPage = lazy(() => import("./View/Pages/ExchangeBookPage"))
const ProfilePage = lazy(() => import("./View/Pages/ProfilePage"))
const VideoPacksPage = lazy(() => import("./View/Pages/VideoPacksPage"))
const PaymentPage = lazy(() => import("./View/Pages/PaymentPage"))
const Panel = lazy(() => import("./View/Panel/Panel"))
const PavilionPage = lazy(() => import("./View/Pages/PavilionPage"))
const ClassPage = lazy(() => import("./View/Pages/ClassPage"))

class App extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            redirect: false,
            page: "/",
            user: null,
            cities: {},
            categories: {},
            videoPacks: {},
            companies: {},
            devtoolsOpen: false,
        }
        this.goToExchangeBook = this.goToExchangeBook.bind(this)
    }

    componentDidMount()
    {
        versionMigrations("2")

        let user = null

        if (localStorage.hasOwnProperty("user") || sessionStorage.hasOwnProperty("user"))
        {
            user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"))
            this.setState({...this.state, user}, () =>
            {
                api.post("user/verify-token")
                    .then((data) => this.setUser(data))
                    .catch((e) =>
                    {
                        if (e?.response?.status === 403)
                        {
                            this.logout()
                        }
                    })
            })
        }

        const {location} = this.props
        if (
            location.pathname.includes("login-modal") ||
            location.pathname.includes("add-exchange") ||
            location.pathname.includes("complete-profile") ||
            location.pathname.includes("add-comment")
        )
        {
            let currentPath = location.pathname
                .replace("/login-modal", "")
                .replace("/add-exchange", "")
                .replace("/complete-profile", "")
                .replace("/add-comment", "")
            window.history.replaceState("", "", currentPath ? currentPath : "/")
            document.location.reload()
        }

        if (process.env.NODE_ENV === "production" && user?.role !== "admin")
        {
            const element = new Image()
            let devtoolsOpen = false
            element.__defineGetter__("id", () => devtoolsOpen = true) // change to "Object.defineProperty" later
            setInterval(() =>
            {
                devtoolsOpen = false
                console.log(element)
                if (devtoolsOpen !== this.state.devtoolsOpen) this.setState({...this.state, devtoolsOpen})
            }, 1000)
            document.addEventListener("keydown", this.onKeyDown)
        }
    }

    onKeyDown = (e) => e.keyCode === 123 && e.preventDefault()

    componentWillUnmount()
    {
        if (process.env.NODE_ENV === "production")
        {
            document.removeEventListener("keydown", this.onKeyDown)
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

    setUser = (user, dontRememberMe) =>
    {
        if (dontRememberMe)
        {
            if (sessionStorage.hasOwnProperty("user") && !user.token)
            {
                const token = JSON.parse(sessionStorage.getItem("user")).token
                let userWT = {...user, token}
                sessionStorage.setItem("user", JSON.stringify(userWT))
                this.setState({...this.state, user: userWT})
            }
            else
            {
                sessionStorage.setItem("user", JSON.stringify(user))
                this.setState({...this.state, user})
            }
        }
        else
        {
            if (localStorage.hasOwnProperty("user") && !user.token)
            {
                const token = JSON.parse(localStorage.getItem("user")).token
                let userWT = {...user, token}
                localStorage.setItem("user", JSON.stringify(userWT))
                this.setState({...this.state, user: userWT})
            }
            else
            {
                localStorage.setItem("user", JSON.stringify(user))
                this.setState({...this.state, user})
            }
        }
    }

    logout = () =>
    {
        localStorage.removeItem("user")
        sessionStorage.removeItem("user")
        localStorage.removeItem("push-notification")
        this.setState({...this.state, user: null})
    }

    getCities = () =>
    {
        api.get("city", `?limit=100&time=${new Date().toISOString()}`).then((cities) =>
            this.setState({...this.state, cities: cities.reduce((sum, city) => ({...sum, [city._id]: {...city}}), {})}),
        )
    }

    getCategories = () =>
    {
        api.get("category", `?limit=100&time=${new Date().toISOString()}`).then((categories) =>
            this.setState({...this.state, categories: categories.reduce((sum, category) => ({...sum, [category._id]: {...category}}), {})}),
        )
    }

    getVideoPacks = () =>
    {
        api.get("video-pack", `?limit=100&time=${new Date().toISOString()}`, true)
            .then((videoPacks) =>
            {
                this.setState({...this.state, videoPacks: videoPacks.reduce((sum, videoPack) => ({...sum, [videoPack._id]: {...videoPack}}), {})}, () =>
                    localStorage.setItem("video-pack", JSON.stringify(videoPacks)),
                )
            })
            .catch(() =>
            {
                const videoPacks = localStorage.getItem("video-pack")
                if (videoPacks)
                {
                    this.setState({...this.state, videoPacks: JSON.parse(videoPacks).reduce((sum, videoPack) => ({...sum, [videoPack._id]: {...videoPack}}), {})}, () =>
                        NotificationManager.warning("عدم دسترسی به اینترنت، بارگزاری آفلاین..."),
                    )
                }
                else NotificationManager.error("سایت در گرفتن اطلاعات با خطا مواجه شد!")
            })
    }

    getCompanies = () =>
    {
        api.get("company", `?limit=100&time=${new Date().toISOString()}`, true)
            .then((companies) =>
            {
                this.setState({...this.state, companies: companies.reduce((sum, company) => ({...sum, [company._id]: {...company}}), {})}, () =>
                    localStorage.setItem("company", JSON.stringify(companies)),
                )
            })
            .catch(() =>
            {
                const companies = localStorage.getItem("company")
                if (companies)
                {
                    this.setState({...this.state, companies: JSON.parse(companies).reduce((sum, company) => ({...sum, [company._id]: {...company}}), {})}, () =>
                        NotificationManager.warning("عدم دسترسی به اینترنت، بارگزاری آفلاین..."),
                    )
                }
                else NotificationManager.error("سایت در گرفتن اطلاعات با خطا مواجه شد!")
            })
    }

    render()
    {
        const {redirect, page, user, cities, categories, videoPacks, companies, devtoolsOpen} = this.state
        const {location} = this.props
        if (!devtoolsOpen)
            return (
                <main className='main'>
                    {redirect && <Redirect push to={page}/>}
                    <Header user={user} location={location.pathname} setUser={this.setUser} logout={this.logout}/>
                    <Suspense fallback={null}>
                        <Switch>
                            <Route exact path='/sign-up' render={() => <SignUpPage setUser={this.setUser}/>}/>
                            <Route exact path='/profile' render={() => <ProfilePage user={user} setUser={this.setUser}/>}/>
                            <Route path='/exchanges' render={() => <ExchangeBookPage defaultPhone={user ? user.phone : ""} cities={cities} getCities={this.getCities} categories={categories}
                                                                                     getCategories={this.getCategories}/>}/>
                            <Route path='/pavilions' render={() => <PavilionPage user={user}/>}/>
                            <Route path='/class' render={() => <ClassPage/>}/>
                            <Route path='/videos' render={() =>
                                <VideoPacksPage user={user}
                                                getVideoPacks={this.getVideoPacks}
                                                videoPacks={videoPacks}
                                                getCompanies={this.getCompanies}
                                                companies={companies}
                                                setUser={this.setUser}
                                />
                            }/>
                            <Route path='/payment/:type' render={(route) => <PaymentPage type={route.match.params.type}/>}/>
                            <Route path='/panel' render={() => <Panel user={user}/>}/>
                            <Route path='*' render={() => <HomePage goToExchangeBook={this.goToExchangeBook}/>}/>
                        </Switch>
                    </Suspense>
                    <NotificationContainer/>
                </main>
            )
        else return <div style={{textAlign: "center", padding: "20px", direction: "ltr"}}>Please Close Inspect Babe :)</div>
    }
}

export default App