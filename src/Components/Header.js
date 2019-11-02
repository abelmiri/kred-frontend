import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import {Link} from "react-router-dom"
import Hamburger from "../Media/Svgs/Hamburger"
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
                    setTimeout(() => this.setState({...this.state, displayShowLoginModal: false}), 150)
                }
            }
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

    showLoginModal = () =>
    {
        const {location} = this.props
        if (document.body.clientWidth <= 480) window.history.pushState("", "", `${location === "/" ? "" : location}/login`)
        document.body.style.overflow = "hidden"
        setTimeout(() => this.setState({...this.state, showLoginModal: true}), 150)
        this.setState({...this.state, displayShowLoginModal: true})
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

    render()
    {
        const {location, user} = this.props
        const {isTransparent, showLoginModal, displayShowLoginModal} = this.state
        return (
            <div className={`header-container-base ${isTransparent && location === "/" ? "hidden" : "visible"}`}>
                <div className='header-buttons'>
                    {
                        location === "/exchange" &&
                        <Material backgroundColor='rgba(255,255,255,0.3)' className='header-buttons-menu'>
                            <Hamburger className='header-buttons-hamburger'/>
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
                </div>
                <div className='header-logo-cont'>
                    <Hamburger className='header-hamburger-mobile'/>
                    <h1 style={{opacity: isTransparent && location === "/" ? 0 : 1}} className='header-logo-cont-title'>K<span>RED</span></h1>
                    <Link to="/" className='header-logo-link'><img src={Logo} className='header-logo' alt='kred logo'/></Link>
                    {
                        user ?
                            <div className="header-mobile-name">{user.name ? user.name.split(" ")[0] : user.phone}</div>
                            :
                            <Material className="header-mobile-login" onClick={this.showLoginModal}>ورود</Material>
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
                            <Link onClick={this.hideLoginModal} to="/sign-up" className='login-modal-sign-up'>ثبت نام در KRED</Link>
                        </div>
                    </React.Fragment>
                }
            </div>
        )
    }
}

export default Header