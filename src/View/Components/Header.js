import React, {PureComponent} from "react"
import {Link} from "react-router-dom"
import Hamburger from "./Hamburger"
import Material from "./Material"
import LoginModal from "./LoginModal"
import LogoSvg from "../../Media/Svgs/LogoSvg"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isTransparent: true,
            showLoginModal: false,
            collapseSidebar: true,
            hideDropDown: true,
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
    }

    onScroll()
    {
        const {isTransparent, hideDropDown} = this.state
        if (window.scrollY >= window.innerHeight - 50)
        {
            if (isTransparent) this.setState({...this.state, isTransparent: false})
        }
        else
        {
            if (!isTransparent) this.setState({...this.state, isTransparent: true})
        }

        if (!hideDropDown) this.toggleDropDown()
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
        if (document.body.clientWidth <= 480) window.history.pushState("", "", `${location === "/" ? "" : location.replace("/login-modal", "")}/login-modal`)
        document.body.style.overflow = "hidden"
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
        this.setState({...this.state, showLoginModal: false})
    }

    logout = () =>
    {
        this.props.logout()
        if (!this.state.collapseSidebar && document.body.clientWidth <= 480) this.hideSidebar()
    }

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

    render()
    {
        const {location, user, setUser} = this.props
        if (location !== "/sign-up")
        {
            const {isTransparent, showLoginModal, collapseSidebar, hideDropDown} = this.state
            return (
                <div className={`header-container-base ${isTransparent && location === "/" ? "hidden" : "visible"}`}>
                    <div className='header-buttons'>
                        {
                            (
                                location === "/" ||
                                location.slice(0, 10) === "/exchanges" ||
                                location.slice(0, 7) === "/videos" ||
                                location.slice(0, 8) === "/profile" ||
                                location.slice(0, 10) === "/pavilions" ||
                                location.slice(0, 6) === "/class" ||
                                location.slice(0, 9) === "/payment/" ||
                                (user && user.role === "admin" && location.slice(0, 6) === "/panel")
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
                                                            location.slice(0, 10) === "/pavilions" ? "گپ و گفت"
                                                                :
                                                                location.slice(0, 6) === "/class" ? "کلاس درس"
                                                                    :
                                                                    location.slice(0, 9) === "/payment/" ? "پرداخت"
                                                                        :
                                                                        location.slice(0, 6) === "/panel" && "پنل ادمین"
                                        }
                                    </span>
                                </Material>
                                <div className="header-buttons-menu-drop" ref={e => this.dropDown = e} style={{height: "0"}}>
                                    <Link className="header-buttons-menu-drop-link" to="/">
                                        <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>صفحه اصلی</Material>
                                    </Link>
                                    {
                                        user && user.role === "admin" &&
                                        <Link className="header-buttons-menu-drop-link" to="/panel/dashboard">
                                            <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>پنل ادمین</Material>
                                        </Link>
                                    }
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
                                    <Link className="header-buttons-menu-drop-link" to="/pavilions">
                                        <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>گپ و گفت</Material>
                                    </Link>
                                    <Link className="header-buttons-menu-drop-link" to="/class">
                                        <Material className="header-buttons-menu-drop-item" onClick={this.toggleDropDown}>کلاس درس</Material>
                                    </Link>
                                </div>
                            </div>
                        }

                        {
                            user ?
                                <React.Fragment>
                                    <Link to="/profile" className={`header-buttons-title ${isTransparent && location === "/" ? "styled" : ""}`}>
                                        سلام {user.name ? user.name.split(" ")[0] : user.phone}
                                    </Link>
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
                            <LogoSvg className={`header-logo ${!collapseSidebar ? "show" : ""}`}/>
                        </Link>
                        {
                            user ?
                                <Link to="/profile" onClick={this.hideSidebar}
                                      className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`}>{user.name ? collapseSidebar ? user.name.split(" ")[0] : user.name : user.phone}</Link>
                                :
                                <Material className={`header-mobile-name ${!collapseSidebar ? "on-side" : ""}`}
                                          onClick={!collapseSidebar ? this.showLoginModalOnSide : this.showLoginModal}>ورود</Material>
                        }
                    </div>

                    <div className="header-sidebar-back" style={{opacity: "0", height: "0"}} ref={e => this.sidebarBack = e} onClick={this.hideSidebar}/>
                    <div className="header-sidebar-container" style={{transform: "translateX(100%)"}} ref={e => this.sidebar = e}>
                        <Link to="/" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn margin-top">صفحه اصلی</Material></Link>
                        {user && <Link to="/profile" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">پروفایل من</Material></Link>}
                        <Link to="/videos" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">فیلم‌های آموزشی</Material></Link>
                        <Link to="/exchanges" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">تبادل کتاب</Material></Link>
                        <Link to="/pavilions" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">گپ و گفت</Material></Link>
                        {
                            user && user.role === "admin" &&
                            <React.Fragment>
                                <Link to="/panel/dashboard" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">پنل ادمین</Material></Link>
                            </React.Fragment>
                        }
                        {user && <Material className="header-sidebar-log-out" onClick={this.logout}>خروج از حساب</Material>}
                    </div>

                    {showLoginModal && <LoginModal setUser={setUser} setOverflowAuto={this.setOverflowAuto} hideLoginModal={this.hideLoginModal}/>}

                </div>
            )
        }
        else return null
    }
}

export default Header