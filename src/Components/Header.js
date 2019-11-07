import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import {Link} from "react-router-dom"
import HamburgerSvg from "../Media/Svgs/Hamburger"
import Hamburger from "./Hamburger"
import Material from "./Material"
import api from "../Functions/api"
import {ClipLoader} from "react-spinners"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isTransparent: true,
            showLoginModal: false,
            displayShowLoginModal: false,
            collapseSidebar: true,
            loginLoading: false,
        }
        this.pos1 = 0
        this.pos3 = 0
        this.posY = 0
        this.prevX = null
        this.changing = false
        this.started = false
        this.deltaY = 0
        this.onScroll = this.onScroll.bind(this)
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.login = this.login.bind(this)
    }

    componentDidMount()
    {
        const {location} = this.props
        if (location.includes("loginModal") || location.includes("openSidebar") || location.includes("addExchangeModal"))
        {
            let shit = location.replace("/openSidebar", "").replace("/loginModal", "").replace("/addExchangeModal", "")
            window.history.replaceState("", "", shit ? shit : "/")
        }
        document.addEventListener("scroll", this.onScroll)
        document.addEventListener("touchstart", this.onTouchStart)
        document.addEventListener("touchmove", this.onTouchMove)
        document.addEventListener("touchend", this.onTouchEnd)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        window.onpopstate = () =>
        {
            if (document.body.clientWidth <= 480)
            {
                if (this.state.showLoginModal)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, showLoginModal: false})
                }
                if (!this.state.collapseSidebar)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, collapseSidebar: true})
                    this.sidebar.style.transition = "transform linear 0.1s"
                    this.sidebar.style.transform = `translateX(${this.sidebar.clientWidth}px)`
                    this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
                    this.sidebarBack.style.opacity = `0`
                    this.sidebarBack.style.height = `0`
                    setTimeout(() => this.sidebar.style.transition = "initial", 250)
                    setTimeout(() => this.sidebarBack.style.transition = "initial", 250)
                }
            }
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
        document.removeEventListener("touchstart", this.onTouchStart)
        document.removeEventListener("touchmove", this.onTouchMove)
        document.removeEventListener("touchend", this.onTouchEnd)
    }

    onTouchStart(e)
    {
        this.prevX = this.state.collapseSidebar ? this.sidebar.clientWidth : 0
        this.pos3 = e.touches[0].clientX
        this.posY = e.touches[0].clientY
        this.started = true
    }

    onTouchMove(e)
    {
        this.deltaY = e.touches[0].clientY - this.posY
        this.pos1 = this.pos3 - e.touches[0].clientX
        if (this.changing || (this.started && this.deltaY < 15 && this.deltaY > -15 && (this.pos1 > 5 || this.pos1 < -5)))
        {
            this.pos3 = e.touches[0].clientX
            this.prevX = this.prevX - this.pos1 >= 0 ? this.prevX - this.pos1 : 0
            this.sidebar.style.transform = `translateX(${this.prevX}px)`
            this.sidebarBack.style.opacity = `${1 - (this.prevX / this.sidebar.clientWidth)}`
            this.sidebarBack.style.height = `100vh`
            if (this.started)
            {
                document.body.style.overflow = "hidden"
                this.changing = true
                this.posY = e.touches[0].clientY
            }
            this.started = false
        }
        else this.started = false
    }

    onTouchEnd()
    {
        if (this.changing)
        {
            if (this.prevX >= this.sidebar.clientWidth / 2)
            {
                this.prevX = this.sidebar.clientWidth
                if (!this.state.collapseSidebar) this.hideSidebar()
                else
                {
                    this.sidebar.style.transition = "transform linear 0.1s"
                    this.sidebar.style.transform = `translateX(${this.prevX}px)`
                    this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
                    this.sidebarBack.style.opacity = `0`
                    this.sidebarBack.style.height = `0`
                    setTimeout(() => this.sidebar.style.transition = "initial", 250)
                    setTimeout(() => this.sidebarBack.style.transition = "initial", 250)
                }
            }
            else
            {
                this.prevX = 0
                if (this.state.collapseSidebar) this.showSidebar()
                else
                {
                    this.sidebar.style.transition = "transform linear 0.2s"
                    this.sidebar.style.transform = `translateX(0px)`
                    this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
                    this.sidebarBack.style.opacity = `1`
                    this.sidebarBack.style.height = `100vh`
                    setTimeout(() => this.sidebar.style.transition = "initial", 250)
                    setTimeout(() => this.sidebarBack.style.transition = "initial", 250)
                }
            }
            document.body.style.overflow = "auto"
            this.changing = false
        }
    }

    onScroll()
    {
        const {isTransparent} = this.state
        if (window.scrollY >= window.innerHeight - 50)
        {
            if (isTransparent) this.setState({...this.state, isTransparent: false})
        }
        else
        {
            if (!isTransparent) this.setState({...this.state, isTransparent: true})
        }
    }

    setOverflowAuto = () => document.body.style.overflow = "auto"

    hideLoginModal = () =>
    {
        if (document.body.clientWidth <= 480)
        {
            window.history.back()
            document.body.style.overflow = "auto"
            this.setState({...this.state, loginLoading: false, showLoginModal: false})
            setTimeout(() => this.setState({...this.state, displayShowLoginModal: false}), 150)
        }
        else
        {
            document.body.style.overflow = "auto"
            this.setState({...this.state, loginLoading: false, showLoginModal: false})
            setTimeout(() => this.setState({...this.state, displayShowLoginModal: false}), 150)
        }
    }

    showLoginModalOnSide = () =>
    {
        this.hideSidebar()
        setTimeout(() => this.showLoginModal(), 150)
    }

    showLoginModal = () =>
    {
        setTimeout(() => this.setState({...this.state, showLoginModal: true}), 150)
        this.setState({...this.state, displayShowLoginModal: true})
        const {location} = this.props
        if (document.body.clientWidth <= 480) window.history.pushState("", "", `${location === "/" ? "" : location.replace("/loginModal", "")}/loginModal`)
        document.body.style.overflow = "hidden"
    }

    login()
    {
        if (!this.state.loginLoading)
        {
            const phone = this.phoneInput.value.trim()
            const password = this.passwordInput.value
            if (phone.length > 0 && password.length >= 6 && password.length <= 30)
            {
                this.setState({...this.state, loginLoading: true}, () =>
                {
                    api.post("user/login", {phone, password}, "", true)
                        .then((data) =>
                        {
                            this.props.setUser(data)
                            this.hideLoginModal()
                        })
                        .catch((e) =>
                        {
                            this.setState({...this.state, loginLoading: false}, () =>
                                e.message === "Request failed with status code 404" && alert("کاربری با اطلاعات وارد شده یافت نشد."),
                            )
                        })
                })
            }
            else alert("اطلاعات ورود را به درستی وارد کنید.")
        }
    }

    showSidebar = () =>
    {
        this.setState({...this.state, collapseSidebar: false})
        const {location} = this.props
        window.history.pushState("", "", `${location === "/" ? "" : location.replace("/openSidebar", "")}/openSidebar`)
        document.body.style.overflow = "hidden"
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateX(0px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
        this.sidebarBack.style.opacity = `1`
        this.sidebarBack.style.height = `100vh`
        setTimeout(() => this.sidebar.style.transition = "initial", 250)
        setTimeout(() => this.sidebarBack.style.transition = "initial", 250)
    }

    hideSidebar = () =>
    {
        window.history.back()
        setTimeout(() =>
        {
            document.body.style.overflow = "auto"
            this.setState({...this.state, collapseSidebar: true})
            this.sidebar.style.transition = "transform linear 0.1s"
            this.sidebar.style.transform = `translateX(${this.sidebar.clientWidth}px)`
            this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
            this.sidebarBack.style.opacity = `0`
            this.sidebarBack.style.height = `0`
            setTimeout(() => this.sidebar.style.transition = "initial", 250)
            setTimeout(() => this.sidebarBack.style.transition = "initial", 250)
        }, 100)
    }

    hideSidebarAfterLink = () =>
    {
        document.body.style.overflow = "auto"
        this.setState({...this.state, collapseSidebar: true})
    }

    logout = () =>
    {
        this.props.logout()
        if (!this.state.collapseSidebar && document.body.clientWidth <= 480) this.hideSidebar()
    }

    render()
    {
        const {location, user} = this.props
        const {isTransparent, showLoginModal, displayShowLoginModal, collapseSidebar, loginLoading} = this.state
        return (
            <div className={`header-container-base ${isTransparent && location === "/" ? "hidden" : "visible"}`}>
                <div className='header-buttons'>
                    {
                        location === "/exchange" &&
                        <Material backgroundColor='rgba(255,255,255,0.3)' className='header-buttons-menu'>
                            <HamburgerSvg className='header-buttons-hamburger'/>
                            <span>تبادل کتاب</span>
                        </Material>
                    }
                    {
                        user ?
                            <Link to="/profile" className='header-buttons-title'>
                                سلام {user.name ? user.name.split(" ")[0] : user.phone}
                            </Link>
                            :
                            <React.Fragment>
                                <div className='header-buttons-title' onClick={this.showLoginModal}>ورود</div>
                                <Link to="/sign-up" className='header-buttons-title'>ثبت نام</Link>
                            </React.Fragment>
                    }
                    <div className='header-buttons-title'>ارتباط با کرد</div>
                    <div className='header-buttons-title'>درباره ما</div>
                    {user && <div className='header-buttons-title' onClick={this.logout}>خروج</div>}
                </div>
                <div className='header-logo-cont'>
                    <Material backgroundColor={!collapseSidebar ? "transparent" : "rgba(0,0,0,0.1)"} className={`header-hamburger-mobile-material ${!collapseSidebar ? "toggle" : ""}`}>
                        <Hamburger className="header-hamburger-mobile" collapse={collapseSidebar} onClick={collapseSidebar ? this.showSidebar : this.hideSidebar}/>
                    </Material>
                    <h1 style={{opacity: isTransparent && location === "/" ? 0 : 1}} className='header-logo-cont-title'>K<span>RED</span></h1>
                    <Link to="/" className='header-logo-link'><img src={Logo} className={`header-logo ${!collapseSidebar ? "show" : ""}`} alt='kred logo'/></Link>
                    {
                        user ?
                            <div className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`}>{user.name ? collapseSidebar ? user.name.split(" ")[0] : user.name : user.phone}</div>
                            :
                            <Material className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`} onClick={!collapseSidebar ? this.showLoginModalOnSide : this.showLoginModal}>ورود</Material>
                    }
                </div>
                {
                    displayShowLoginModal &&
                    <React.Fragment>
                        <div className={`create-exchange-back ${showLoginModal ? "show" : "hide"}`} onClick={this.hideLoginModal}/>
                        <div className={`create-exchange-cont login ${showLoginModal ? "show" : "hide"}`}>
                            <div className='create-exchange-title'>ورود به KRED</div>
                            <div className='create-exchange-section'>
                                <input type='text'
                                       ref={e => this.phoneInput = e}
                                       className='create-exchange-section-input'
                                       placeholder="ایمیل یا شماره موبایل"
                                       maxLength={60}
                                       name="phone"
                                />
                            </div>
                            <div className='create-exchange-section'>
                                <input type='password'
                                       ref={e => this.passwordInput = e}
                                       className='create-exchange-section-input'
                                       placeholder="رمز عبور"
                                       maxLength={30}
                                       name="password"
                                />
                            </div>
                            <Material className={`header-login-submit ${loginLoading ? "loading" : ""}`} onClick={this.login}>
                                {loginLoading ? <ClipLoader color="white" size={15}/> : "ورود"}
                            </Material>
                            <Link onClick={this.setOverflowAuto} to="/sign-up" className='login-modal-sign-up'>ثبت نام در KRED</Link>
                        </div>
                    </React.Fragment>
                }

                <div ref={e => this.sidebarBack = e} className="header-sidebar-back" style={{opacity: "0", height: "0"}} onClick={this.hideSidebar}/>
                <div ref={e => this.sidebar = e} style={{transform: "translateX(100%)"}} className="header-sidebar-container">
                    <div className="header-sidebar-buttons">
                        <Link replace to="/exchange" className="header-sidebar-link" onClick={this.hideSidebarAfterLink}><Material className="header-sidebar-btn">تبادل کتاب</Material></Link>
                        {user && <Material className="header-sidebar-log-out" onClick={this.logout}>خروج از حساب</Material>}
                    </div>
                </div>

            </div>
        )
    }
}

export default Header