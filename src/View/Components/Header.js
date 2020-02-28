import React, {PureComponent} from "react"
import Logo from "../../Media/Images/Logo.png"
import {Link} from "react-router-dom"
import Hamburger from "./Hamburger"
import Material from "./Material"
import api from "../../Functions/api"
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
            hideDropDown: true,
            hidePanelDropDown: true,
        }
        this.deltaX = 0
        this.posX = 0
        this.posY = 0
        this.prevX = null
        this.changing = false
        this.started = false
        this.deltaY = 0
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.login = this.login.bind(this)
    }

    componentDidMount()
    {
        document.addEventListener("click", this.onClick)
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
            }
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener("click", this.onClick)
        document.removeEventListener("scroll", this.onScroll)
        document.removeEventListener("touchstart", this.onTouchStart)
        document.removeEventListener("touchmove", this.onTouchMove)
        document.removeEventListener("touchend", this.onTouchEnd)
    }

    checkParentClass(element, classname)
    {
        if (element.className && element.className.toString().split(" ").indexOf(classname) >= 0) return true
        return element.parentNode && this.checkParentClass(element.parentNode, classname)
    }

    onTouchStart(e)
    {
        if (!this.checkParentClass(e.target, "dont-gesture"))
        {
            this.prevX = !this.state.collapseSidebar ? 0 : this.sidebar ? this.sidebar.clientWidth : 0
            this.posX = e.touches[0].clientX
            this.posY = e.touches[0].clientY
            this.started = true
        }
    }

    onTouchMove(e)
    {
        this.deltaY = this.posY - e.touches[0].clientY
        this.deltaX = this.posX - e.touches[0].clientX
        if (this.changing || (this.started && this.deltaY < 5 && this.deltaY > -5 && (this.deltaX > 5 || this.deltaX < -5)))
        {
            this.posX = e.touches[0].clientX
            this.prevX = this.prevX - this.deltaX >= 0 ? this.prevX - this.deltaX <= this.sidebar.clientWidth ? this.prevX - this.deltaX : this.sidebar.clientWidth : 0
            this.sidebar.style.transform = `translateX(${this.prevX}px)`
            this.sidebarBack.style.opacity = `${1 - (this.prevX / this.sidebar.clientWidth)}`
            this.sidebarBack.style.height = `100vh`
            if (this.started)
            {
                document.body.style.overflow = "hidden"
                this.changing = true
            }
            this.started = false
        }
        else this.started = false
    }

    onTouchEnd()
    {
        if (this.changing)
        {
            if (!(this.deltaX > 3) && (this.deltaX < -3 || this.prevX >= this.sidebar.clientWidth / 2))
            {
                this.prevX = this.sidebar.clientWidth
                this.hideSidebar()
            }
            else
            {
                this.prevX = 0
                this.showSidebar()
            }
            this.changing = false
        }
    }

    showSidebar = () =>
    {
        this.setState({...this.state, collapseSidebar: false})
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateX(0px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
        this.sidebarBack.style.opacity = `1`
        this.sidebarBack.style.height = `100vh`
        document.body.style.overflow = "hidden"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    hideSidebar = () =>
    {
        this.setState({...this.state, collapseSidebar: true})
        this.sidebar.style.transition = "transform linear 0.1s"
        this.sidebar.style.transform = `translateX(100%)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
        this.sidebarBack.style.opacity = `0`
        this.sidebarBack.style.height = `0`
        document.body.style.overflow = "auto"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    onClick(e)
    {
        if (!this.state.hideDropDown && this.dropDownCont && !this.dropDownCont.contains(e.target)) this.toggleDropDown()
        if (!this.state.hidePanelDropDown && this.panelDropDownCont && !this.panelDropDownCont.contains(e.target)) this.togglePanelDropDown()
    }

    onScroll()
    {
        const {isTransparent, hideDropDown, hidePanelDropDown} = this.state
        if (window.scrollY >= window.innerHeight - 50)
        {
            if (isTransparent) this.setState({...this.state, isTransparent: false})
        }
        else
        {
            if (!isTransparent) this.setState({...this.state, isTransparent: true})
        }

        if (!hideDropDown) this.toggleDropDown()
        if (!hidePanelDropDown) this.togglePanelDropDown()
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
                                NotificationManager.error(e.response.status === 404 ? "کاربری با اطلاعات وارد شده یافت نشد." : "سایت در ارسال اطلاعات با خطا مواجه شد!"),
                            )
                        })
                })
            }
            else NotificationManager.warning("اطلاعات ورود را به درستی وارد کنید.")
        }
    }

    logout = () =>
    {
        this.props.logout()
        if (!this.state.collapseSidebar && document.body.clientWidth <= 480) this.hideSidebar()
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.login()

    toggleDropDown = () =>
    {
        const hideDropDown = !this.state.hideDropDown
        this.setState({...this.state, hideDropDown}, () =>
        {
            if (hideDropDown)
            {
                if (this.dropDown) this.dropDown.style.height = "0"
            }
            else
            {
                if (this.dropDown) this.dropDown.style.height = this.dropDown.scrollHeight + "px"
            }
        })
    }

    togglePanelDropDown = () =>
    {
        const hidePanelDropDown = !this.state.hidePanelDropDown
        this.setState({...this.state, hidePanelDropDown}, () =>
        {
            if (hidePanelDropDown)
            {
                if (this.panelDropDown) this.panelDropDown.style.height = "0"
            }
            else
            {
                if (this.panelDropDown) this.panelDropDown.style.height = this.panelDropDown.scrollHeight + "px"
            }
        })
    }

    render()
    {
        const {location, user} = this.props
        if (location !== "/sign-up")
        {
            const {isTransparent, showLoginModal, collapseSidebar, loginLoading, hideDropDown, hidePanelDropDown} = this.state
            return (
                <div className={`header-container-base ${isTransparent && location === "/" ? "hidden" : "visible"}`}>
                    <div className='header-buttons'>
                        {
                            (
                                location === "/" ||
                                location.slice(0, 10) === "/exchanges" ||
                                location.slice(0, 7) === "/videos" ||
                                location.slice(0, 8) === "/profile" ||
                                (user && user.role === "admin" && (location.slice(0, 12) === "/statistics" || location.slice(0, 6) === "/panel"))
                            ) &&
                            <div className={`header-buttons-menu-cont ${isTransparent && location === "/" ? `styled ${hideDropDown ? "" : "open-drop"}` : ""}`} ref={e => this.dropDownCont = e}>
                                <Material backgroundColor='rgba(255,255,255,0.3)' className="header-buttons-menu" onClick={this.toggleDropDown}>
                                    <Hamburger className='header-hamburger-desktop' collapse={hideDropDown}/>
                                    <span>
                                        {
                                            location === "/" ? "صفحه اصلی"
                                                :
                                                location.slice(0, 10) === "/exchanges" ? "تبادل کتاب"
                                                    :
                                                    location.slice(0, 7) === "/videos" ? "فیلم‌های آموزشی"
                                                        :
                                                        location.slice(0, 8) === "/profile" ? "پروفایل من"
                                                            :
                                                            user && user.role === "admin" ?
                                                                location.slice(0, 12) === "/statistics" ? "آمارها"
                                                                    :
                                                                    location.slice(0, 6) === "/panel" && "پنل ادمین"
                                                                :
                                                                null
                                        }
                                    </span>
                                </Material>
                                <div className="header-buttons-menu-drop" ref={e => this.dropDown = e} style={{height: "0"}}>
                                    <Link className="header-buttons-menu-drop-link" to="/">
                                        <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>صفحه اصلی</Material>
                                    </Link>
                                    {
                                        user &&
                                        <Link className="header-buttons-menu-drop-link" to="/profile">
                                            <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>پروفایل من</Material>
                                        </Link>
                                    }
                                    <Link className="header-buttons-menu-drop-link" to="/videos">
                                        <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>فیلم‌های آموزشی</Material>
                                    </Link>
                                    <Link className="header-buttons-menu-drop-link" to="/exchanges">
                                        <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>تبادل کتاب</Material>
                                    </Link>
                                </div>
                            </div>
                        }

                        {
                            user ?
                                <React.Fragment>
                                    {
                                        user.role === "admin" ?
                                            <div className={`header-buttons-menu-cont styled ${hidePanelDropDown ? "" : "open-drop"}`} ref={e => this.panelDropDownCont = e}>
                                                <Material backgroundColor='rgba(255,255,255,0.3)' className="header-buttons-menu panel" onClick={this.togglePanelDropDown}>
                                                    <Hamburger className='header-hamburger-desktop' collapse={hidePanelDropDown}/>
                                                    <span>{location === "/panel/off-codes" ? "کد تخفیف" : "سلام ادمین!"}</span>
                                                </Material>
                                                <div className="header-buttons-menu-drop" ref={e => this.panelDropDown = e} style={{height: "0"}}>
                                                    <Link className="header-buttons-menu-drop-link" to="/panel">
                                                        <Material className="header-buttons-menu-drop-item" onClick={this.togglePanelDropDown}>پنل ادمین</Material>
                                                    </Link>
                                                    <Link className="header-buttons-menu-drop-link" to="/panel/statistics">
                                                        <Material className="header-buttons-menu-drop-item" onClick={this.togglePanelDropDown}>آمارها</Material>
                                                    </Link>
                                                    <Link className="header-buttons-menu-drop-link" to="/panel/off-codes">
                                                        <Material className="header-buttons-menu-drop-item" onClick={this.togglePanelDropDown}>کد تخفیف</Material>
                                                    </Link>
                                                </div>
                                            </div>
                                            :
                                            <Link to="/profile" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`}>
                                                سلام {user.name ? user.name.split(" ")[0] : user.phone}
                                            </Link>
                                    }
                                    <div className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`} onClick={this.logout}>خروج</div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <div id="header-login" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`} onClick={this.showLoginModal}>ورود</div>
                                    <Link to="/sign-up" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`}>ثبت نام</Link>
                                </React.Fragment>
                        }
                        {/*<div className='header-buttons-title'>ارتباط با کرد</div>*/}
                        {/*<div className='header-buttons-title'>درباره ما</div>*/}
                    </div>
                    <div className='header-logo-cont'>
                        <Material backgroundColor={!collapseSidebar ? "transparent" : "rgba(0,0,0,0.1)"} className={`header-hamburger-mobile-material ${!collapseSidebar ? "toggle" : ""}`}>
                            <Hamburger className="header-hamburger-mobile" collapse={collapseSidebar} onClick={collapseSidebar ? this.showSidebar : this.hideSidebar}/>
                        </Material>
                        <Link to="/" className='header-logo-link'>
                            <h1 style={{opacity: isTransparent && location === "/" ? 0 : 1}} className='header-logo-cont-title'>K<span>RED</span></h1>
                            <img src={Logo} className={`header-logo ${!collapseSidebar ? "show" : ""}`} alt='kred logo'/>
                        </Link>
                        {
                            user ?
                                <Link to="/profile" onClick={this.hideSidebar} className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`}>{user.name ? collapseSidebar ? user.name.split(" ")[0] : user.name : user.phone}</Link>
                                :
                                <Material className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`} onClick={!collapseSidebar ? this.showLoginModalOnSide : this.showLoginModal}>ورود</Material>
                        }
                    </div>

                    <div className="header-sidebar-back" style={{opacity: "0", height: "0"}} ref={e => this.sidebarBack = e} onClick={this.hideSidebar}/>
                    <div className="header-sidebar-container" style={{transform: "translateX(100%)"}} ref={e => this.sidebar = e}>
                        <Link to="/" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn margin-top">صفحه اصلی</Material></Link>
                        {user && <Link to="/profile" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">پروفایل من</Material></Link>}
                        <Link to="/videos" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">فیلم‌های آموزشی</Material></Link>
                        <Link to="/exchanges" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">تبادل کتاب</Material></Link>
                        {
                            user && user.role === "admin" &&
                            <React.Fragment>
                                <Link to="/panel" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">پنل ادمین</Material></Link>
                            </React.Fragment>
                        }
                        {user && <Material className="header-sidebar-log-out" onClick={this.logout}>خروج از حساب</Material>}
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

                </div>
            )
        }
        else return null
    }
}

export default Header