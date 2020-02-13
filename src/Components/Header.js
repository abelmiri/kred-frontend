import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import {Link} from "react-router-dom"
import Hamburger from "./Hamburger"
import Material from "./Material"
import api from "../Functions/api"
import {ClipLoader} from "react-spinners"
import {NotificationManager} from "react-notifications"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isTransparent: true,
            showLoginModal: false,
            collapseSidebar: true,
            loginLoading: false,
        }
        this.onScroll = this.onScroll.bind(this)
        this.login = this.login.bind(this)
    }

    componentDidMount()
    {
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
                }
            }
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
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

    setOverflowAuto = () =>
    {
        document.body.style.overflow = "auto"
        this.setState({...this.state, loginLoading: false, showLoginModal: false})
    }

    hideLoginModal = () =>
    {
        document.body.clientWidth <= 480 && window.history.back()
        document.body.style.overflow = "auto"
        this.setState({...this.state, loginLoading: false, showLoginModal: false})
    }

    showLoginModalOnSide = () =>
    {
        this.hideSidebar()
        setTimeout(() => this.showLoginModal(), 150)
    }

    showLoginModal = () =>
    {
        this.setState({...this.state, showLoginModal: true})
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
                                NotificationManager.error(e.message === "Request failed with status code 404" ? "کاربری با اطلاعات وارد شده یافت نشد." : "سایت در ارسال اطلاعات با خطا مواجه شد!"),
                            )
                        })
                })
            }
            else NotificationManager.warning("اطلاعات ورود را به درستی وارد کنید.")
        }
    }

    showSidebar = () =>
    {
        document.body.style.overflow = "hidden"
        this.setState({...this.state, collapseSidebar: false})
    }

    hideSidebar = () =>
    {
        document.body.style.overflow = "auto"
        this.setState({...this.state, collapseSidebar: true})
    }

    logout = () =>
    {
        this.props.logout()
        if (!this.state.collapseSidebar && document.body.clientWidth <= 480) this.hideSidebar()
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.login()

    render()
    {
        const {location, user} = this.props
        if (location !== "/sign-up")
        {
            const {isTransparent, showLoginModal, collapseSidebar, loginLoading} = this.state
            return (
                <div className={`header-container-base ${isTransparent && location === "/" ? "hidden" : "visible"}`}>
                    <div className='header-buttons'>
                        {/*{*/}
                        {/*    location === "/exchange" &&*/}
                        {/*    <Material backgroundColor='rgba(255,255,255,0.3)' className='header-buttons-menu'>*/}
                        {/*        <HamburgerSvg className='header-buttons-hamburger'/>*/}
                        {/*        <span>تبادل کتاب</span>*/}
                        {/*    </Material>*/}
                        {/*}*/}
                        {
                            user ?
                                <Link to="/profile" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`}>
                                    سلام {user.name ? user.name.split(" ")[0] : user.phone}
                                </Link>
                                :
                                <React.Fragment>
                                    <div id="header-login" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`} onClick={this.showLoginModal}>ورود</div>
                                    <Link to="/sign-up" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`}>ثبت نام</Link>
                                </React.Fragment>
                        }
                        {/*<div className='header-buttons-title'>ارتباط با کرد</div>*/}
                        {/*<div className='header-buttons-title'>درباره ما</div>*/}
                        {user && <div className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`} onClick={this.logout}>خروج</div>}
                    </div>
                    <div className='header-logo-cont'>
                        <Material backgroundColor={!collapseSidebar ? "transparent" : "rgba(0,0,0,0.1)"} className={`header-hamburger-mobile-material ${!collapseSidebar ? "toggle" : ""}`}>
                            <Hamburger className="header-hamburger-mobile" collapse={collapseSidebar} onClick={collapseSidebar ? this.showSidebar : this.hideSidebar}/>
                        </Material>
                        <h1 style={{opacity: isTransparent && location === "/" ? 0 : 1}} className='header-logo-cont-title'>K<span>RED</span></h1>
                        <Link to="/" className='header-logo-link'><img src={Logo} className={`header-logo ${!collapseSidebar ? "show" : ""}`} alt='kred logo'/></Link>
                        {
                            user ?
                                <Link to="/profile" className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`}>{user.name ? collapseSidebar ? user.name.split(" ")[0] : user.name : user.phone}</Link>
                                :
                                <Material className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`} onClick={!collapseSidebar ? this.showLoginModalOnSide : this.showLoginModal}>ورود</Material>
                        }
                    </div>
                    {
                        showLoginModal &&
                        <React.Fragment>
                            <div className="create-exchange-back" onClick={this.hideLoginModal}/>
                            <div className="create-exchange-cont login">
                                <div className='create-exchange-title login'>ورود به KRED</div>
                                <img className="login-modal-logo" src={Logo} alt="kred"/>
                                <div className='create-exchange-section margin-top-none'>
                                    <input type='text'
                                           ref={e => this.phoneInput = e}
                                           className='create-exchange-section-input'
                                           placeholder="ایمیل یا شماره موبایل"
                                           maxLength={60}
                                           name="phone"
                                           onKeyDown={this.submitOnEnter}
                                    />
                                </div>
                                <div className='create-exchange-section'>
                                    <input type='password'
                                           ref={e => this.passwordInput = e}
                                           className='create-exchange-section-input'
                                           placeholder="رمز عبور"
                                           maxLength={30}
                                           name="password"
                                           onKeyDown={this.submitOnEnter}
                                    />
                                </div>
                                <Material className={`header-login-submit ${loginLoading ? "loading" : ""}`} onClick={this.login}>
                                    {loginLoading ? <ClipLoader color="white" size={15}/> : "ورود"}
                                </Material>
                                <Link onClick={this.setOverflowAuto} to="/sign-up" className='login-modal-sign-up'>ثبت نام در KRED</Link>
                            </div>
                        </React.Fragment>
                    }

                    <div className={`header-sidebar-back ${collapseSidebar ? "hide" : ""}`} onClick={this.hideSidebar}/>
                    <div className={`header-sidebar-container ${collapseSidebar ? "hide" : ""}`}>
                        <Link to="/exchange" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">تبادل کتاب</Material></Link>
                        {user && <Material className="header-sidebar-log-out" onClick={this.logout}>خروج از حساب</Material>}
                    </div>

                </div>
            )
        }
        else return null
    }
}

export default Header