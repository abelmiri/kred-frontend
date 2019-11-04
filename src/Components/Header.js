import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import {Link} from "react-router-dom"
import HamburgerSvg from "../Media/Svgs/Hamburger"
import Hamburger from "./Hamburger"
import Material from "./Material"
import api from "../Functions/api"

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
            displaySidebar: false,
        }
        this.onScroll = this.onScroll.bind(this)
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
                    setTimeout(() => this.setState({...this.state, displayShowLoginModal: false}), 150)
                }
                if (!this.state.collapseSidebar)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, collapseSidebar: true})
                    setTimeout(() => this.setState({...this.state, displaySidebar: false}), 150)
                }
            }
        }
    }

    setOverflowAuto = () => document.body.style.overflow = "auto"

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

    hideLoginModal = () =>
    {
        if (document.body.clientWidth <= 480)
        {
            window.history.back()
            document.body.style.overflow = "auto"
            this.setState({...this.state, showLoginModal: false})
            setTimeout(() => this.setState({...this.state, displayShowLoginModal: false}), 150)
        }
        else
        {
            document.body.style.overflow = "auto"
            this.setState({...this.state, showLoginModal: false})
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
        const phone = this.phoneInput.value.trim()
        const password = this.passwordInput.value
        if (phone.length > 0 && password.length >= 6 && password.length <= 30)
        {
            api.post("user/login", {phone, password}, "", true)
                .then((data) =>
                {
                    this.props.setUser(data)
                    this.hideLoginModal()
                })
                .catch((e) =>
                {
                    if (e.message === "Request failed with status code 404") alert("کاربری با اطلاعات وارد شده یافت نشد.")
                })
        }
        else alert("اطلاعات ورود را به درستی وارد کنید.")
    }

    showSidebar = () =>
    {
        setTimeout(() => this.setState({...this.state, collapseSidebar: false}), 150)
        this.setState({...this.state, displaySidebar: true})
        const {location} = this.props
        window.history.pushState("", "", `${location === "/" ? "" : location.replace("/openSidebar", "")}/openSidebar`)
        document.body.style.overflow = "hidden"
    }

    hideSidebar = () =>
    {
        window.history.back()
        document.body.style.overflow = "auto"
        this.setState({...this.state, collapseSidebar: true})
        setTimeout(() => this.setState({...this.state, displaySidebar: false}), 150)
    }

    hideSidebarAfterLink = () =>
    {
        document.body.style.overflow = "auto"
        this.setState({...this.state, collapseSidebar: true})
        setTimeout(() => this.setState({...this.state, displaySidebar: false}), 150)
    }

    logout = () =>
    {
        this.props.logout()
        if (!this.state.collapseSidebar && document.body.clientWidth > 480) this.hideSidebar()
    }

    render()
    {
        const {location, user} = this.props
        const {isTransparent, showLoginModal, displayShowLoginModal, collapseSidebar, displaySidebar} = this.state
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
                            <div className='header-buttons-title'>
                                سلام {user.name ? user.name.split(" ")[0] : user.phone}
                            </div>
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
                                       placeholder="ایمیل، شمار یا موبایل"
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
                            <Material className='header-login-submit' onClick={this.login}>ورود</Material>
                            <Link onClick={this.setOverflowAuto} to="/sign-up" className='login-modal-sign-up'>ثبت نام در KRED</Link>
                        </div>
                    </React.Fragment>
                }

                {
                    displaySidebar &&
                    <React.Fragment>
                        <div className={`create-exchange-back ${!collapseSidebar ? "show" : "hide"}`} onClick={this.hideSidebar}/>
                        <div className={`header-sidebar-container ${collapseSidebar ? "" : "show"}`}>
                            <div className="header-sidebar-buttons">
                                <Link replace to="/exchange" className="header-sidebar-link" onClick={this.hideSidebarAfterLink}><Material className="header-sidebar-btn">تبادل کتاب</Material></Link>
                                {user && <Material className="header-sidebar-log-out" onClick={this.logout}>خروج از حساب</Material>}
                            </div>
                        </div>
                    </React.Fragment>
                }

            </div>
        )
    }
}

export default Header