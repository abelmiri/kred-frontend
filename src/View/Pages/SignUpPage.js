import React, {PureComponent} from "react"
import Slider1 from "../../Media/Images/login-slider1.png"
import Slider2 from "../../Media/Images/login-slider2.png"
import Slider3 from "../../Media/Images/login-slider3.png"
import Material from "../Components/Material"
import {Link, Redirect} from "react-router-dom"
import {BeatLoader} from "react-spinners"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"
import LogoSvg from "../../Media/Svgs/LogoSvg"
import {Helmet} from "react-helmet"
import Constant from "../../Constant/Constant"

class SignUpPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.slides = [
            {img: Slider1, text: "دیگه لازم نیست پول زیادی برای کتاب‌هات خرج کنی!"},
            {img: Slider2, text: "دیگه وقتشه حرفه ای درس بخونی!"},
            {img: Slider3, text: "توی KRED از حال و هوای دانشجوهای موفق باخبر شو!"},
        ]
        this.usernameValid = false
        this.phoneValid = false
        this.emailValid = false
        this.passwordValid = false
        this.state = {
            redirect: false,
            loading: false,
            previousSlider: this.slides.length - 1,
            sliderIndex: 0,
            phone: "",
            level: 1,
        }
        this.changeEmail = this.changeEmail.bind(this)
        this.blurEmail = this.blurEmail.bind(this)
        this.changeUsername = this.changeUsername.bind(this)
        this.blurUsername = this.blurUsername.bind(this)
        this.changePhone = this.changePhone.bind(this)
        this.blurPassword = this.blurPassword.bind(this)
        this.blurPhone = this.blurPhone.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.submit = this.submit.bind(this)
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        if (localStorage.hasOwnProperty("user") || sessionStorage.hasOwnProperty("user")) this.setState({...this.state, redirect: "/"})

        this.sliderInterval = setInterval(() =>
        {
            const {sliderIndex} = this.state
            this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === this.slides.length ? 0 : sliderIndex + 1})
        }, 5000)

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "ثبت نام"}).catch(err => console.log(err))
    }

    componentWillUnmount()
    {
        clearInterval(this.sliderInterval)
    }

    setSlider(index)
    {
        const {sliderIndex} = this.state
        if (sliderIndex !== index)
        {
            this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: index}, () =>
            {
                clearInterval(this.sliderInterval)
                this.sliderInterval = setInterval(() =>
                {
                    const {sliderIndex} = this.state
                    this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === this.slides.length ? 0 : sliderIndex + 1})
                }, 5000)
            })
        }
    }

    changePhone(e)
    {
        this.phoneValid = false
        const value = e.target.value.trim()
        if (!isNaN(value))
        {
            this.setState({...this.state, phone: value})
            if (value.length === 11 && value.slice(0, 2) === "09")
            {
                api.post("user/phone_check", {phone: value}, "")
                    .then((data) =>
                    {
                        if (data.count > 0)
                        {
                            if (this.phoneInput) this.phoneInput.style.borderBottom = "1px solid red"
                            if (this.phoneError) this.phoneError.style.height = "20px"
                            this.phoneValid = false
                        }
                        else
                        {
                            if (this.phoneInput) this.phoneInput.style.borderBottom = ""
                            if (this.phoneError) this.phoneError.style.height = ""
                            this.phoneValid = true
                        }
                    })
            }
            else this.phoneValid = false
        }
    }

    blurPhone(e)
    {
        const phone = e.target.value
        if (phone.length !== 11 || phone.slice(0, 2) !== "09") this.phoneInput.style.borderBottom = "1px solid red"
    }

    changeUsername(e)
    {
        this.usernameValid = false
        const value = e.target.value.trim()
        this.setState({...this.state, username: value})
        if (value.length > 2 && Constant.USERNAME_REGEX.test(value))
        {
            api.post("user/username_check", {username: value}, "")
                .then((data) =>
                {
                    if (data.count > 0)
                    {
                        if (this.usernameInput) this.usernameInput.style.borderBottom = "1px solid red"
                        if (this.usernameError)
                        {
                            this.usernameError.innerText = "نام کاربری وارد شده قبلا استفاده شده است!"
                            this.usernameError.style.height = "20px"
                        }
                    }
                    else
                    {
                        if (this.usernameInput) this.usernameInput.style.borderBottom = ""
                        if (this.usernameError) this.usernameError.style.height = ""
                        this.usernameValid = true
                    }
                })
        }
        else
        {
            if (value.length > 1 && !Constant.USERNAME_REGEX.test(value))
            {
                if (this.usernameInput) this.usernameInput.style.borderBottom = "1px solid red"
                if (this.usernameError)
                {
                    this.usernameError.innerText = "فقط حروف و اعداد و _ مجاز است."
                    this.usernameError.style.height = "20px"
                }
            }
        }
    }

    blurUsername(e)
    {
        if (e.target.value.length < 3) this.usernameInput.style.borderBottom = "1px solid red"
    }

    changeEmail(e)
    {
        this.emailValid = false
        const value = e.target.value.trim()
        this.setState({...this.state, email: value})
        if (Constant.EMAIL_REGEX.test(value))
        {
            api.post("user/email_check", {email: value}, "")
                .then((data) =>
                {
                    if (data.count > 0)
                    {
                        if (this.emailInput) this.emailInput.style.borderBottom = "1px solid red"
                        if (this.emailError)
                        {
                            this.emailError.innerText = "ایمیل وارد شده قبلا استفاده شده است!"
                            this.emailError.style.height = "20px"
                        }
                    }
                    else
                    {
                        if (this.emailInput) this.emailInput.style.borderBottom = ""
                        if (this.emailError) this.emailError.style.height = ""
                        this.emailValid = true
                    }
                })
        }
    }

    blurEmail(e)
    {
        const value = e.target.value.trim()
        if (!Constant.EMAIL_REGEX.test(value)) this.emailInput.style.borderBottom = "1px solid red"
    }

    changePassword(e)
    {
        const {value} = e.target
        if (value.length >= 6 && value.length <= 30)
        {
            this.passwordValid = true
            this.passwordInput.style.borderBottom = ""
            this.passwordError.style.height = ""
        }
        else this.passwordValid = false
    }

    blurPassword(e)
    {
        const {value} = e.target
        if (value.length === 0)
        {
            this.passwordInput.style.borderBottom = "1px solid red"
        }
        else if (!(value.length >= 6 && value.length <= 30))
        {
            this.passwordInput.style.borderBottom = "1px solid red"
            this.passwordError.style.height = "20px"
        }
    }

    levelOne = () => this.setState({...this.state, level: 1})

    submit()
    {
        const {loading, level} = this.state
        if (!loading && this.phoneValid && this.passwordValid && this.usernameValid && this.emailValid)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                if (level === 1)
                {
                    api.post("code", {phone: this.phoneInput.value}, "")
                        .then(() => this.setState({...this.state, level: 2, loading: false}))
                        .catch(e => this.setState({...this.state, loading: false}, () =>
                        {
                            if (e?.response?.status === 500 && e?.response.data.message === "kavenegar err!")
                            {
                                NotificationManager.warning("سرویس پیامکی ما دچار مشکل شده! بعدا برای تایید شماره مزاحمتون میشیم!")
                                api.post("user", {phone: this.phoneInput.value, username: this.usernameInput.value, name: this.nameInput.value, password: this.passwordInput.value, error: true}, "")
                                    .then((data) =>
                                    {
                                        const {locationSearch, setUser} = this.props
                                        setUser(data)
                                        if (locationSearch.includes("?return=")) this.setState({...this.state, loading: false, redirect: locationSearch.replace("?return=", "")})
                                        else this.setState({...this.state, loading: false, redirect: "/"})
                                    })
                                    .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد! اینترنت خود را بررسی کنید!")))
                            }
                            else if (e?.response?.status === 403) NotificationManager.error("شما صلاحیت کافی برای ثبت نام ندارید.")
                            else NotificationManager.error("سیستم با خطا مواجه شد! اینترنت خود را بررسی کنید!")
                        }))
                }
                else
                {
                    if (this.codeInput.value.length === 4)
                    {
                        api.post("user", {phone: this.phoneInput.value, email: this.emailInput.value, username: this.usernameInput.value, name: this.nameInput.value, password: this.passwordInput.value, code: this.codeInput.value}, "")
                            .then((data) =>
                            {
                                const {locationSearch, setUser} = this.props
                                setUser(data)
                                if (locationSearch.includes("?return=")) this.setState({...this.state, loading: false, redirect: locationSearch.replace("?return=", "")})
                                else this.setState({...this.state, loading: false, redirect: "/"})
                            })
                            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد! اینترنت خود را بررسی کنید!")))
                    }
                    else this.setState({...this.state, loading: false}, () => NotificationManager.warning("کد ارسال شده را به درستی وارد نمایید!"))
                }
            })
        }
        else
        {
            if (!this.phoneValid) this.phoneInput.style.borderBottom = "1px solid red"
            if (!this.passwordValid) this.passwordInput.style.borderBottom = "1px solid red"
            if (!this.usernameValid) this.usernameInput.style.borderBottom = "1px solid red"
            if (!this.emailValid) this.emailInput.style.borderBottom = "1px solid red"
        }
    }

    render()
    {
        const {sliderIndex, previousSlider, redirect, loading, phone, username, level, email} = this.state
        return (
            <div className="login-container">

                <Helmet>
                    <title>ثبت نام | KRED</title>
                    <meta property="og:title" content="ثبت نام | KRED"/>
                    <meta name="twitter:title" content="ثبت نام | KRED"/>
                    <meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                </Helmet>

                {redirect && <Redirect to={redirect}/>}

                <div className="login-square"/>

                <div className="login-kred-logo">
                    <h1 className="header-logo-cont-title no-margin-top">K<span>RED</span></h1>
                    <Link to="/">
                        <LogoSvg className="header-logo"/>
                    </Link>
                </div>

                <h2 className="login-title">سلام رفیق! به KRED خوش اومدی <span aria-label="" role="img">😊🥰</span></h2>

                <div className="login-input-cont">
                    <div className={`login-input-cont-slide ${level === 2 ? "level-two" : ""}`}>
                        <div className="login-input-cont-slide-child">
                            <div className="login-input-cont-title"> میشه اطلاعات زیر رو کامل کنی؟</div>
                            <div className="login-input-field">
                                <label className="login-input-label">نام کامل</label>
                                <input name="name" type="text" className="login-input-input" placeholder="علی شریفی" ref={e => this.nameInput = e}/>
                            </div>
                            <div className="login-input-error"/>
                            <div className="login-input-field">
                                <label className="login-input-label">نام کاربری <span>*</span></label>
                                <input name="username" value={username} type="text" maxLength={40} className="login-input-input ltr" placeholder="ali_1375" ref={e => this.usernameInput = e} onChange={this.changeUsername} onBlur={this.blurUsername}/>
                            </div>
                            <div className="login-input-error" ref={e => this.usernameError = e}></div>
                            <div className="login-input-field">
                                <label className="login-input-label">ایمیل <span>*</span></label>
                                <input name="email" value={email} type="text" maxLength={40} className="login-input-input ltr" placeholder="ali1375@gmail.com" ref={e => this.emailInput = e} onChange={this.changeEmail} onBlur={this.blurEmail}/>
                            </div>
                            <div className="login-input-error" ref={e => this.emailError = e}></div>
                            <div className="login-input-field">
                                <label className="login-input-label">شماره موبایل <span>*</span></label>
                                <input name="phone" value={phone} type="text" maxLength={11} className="login-input-input ltr" placeholder="09123456789" ref={e => this.phoneInput = e} onChange={this.changePhone} onBlur={this.blurPhone}/>
                            </div>
                            <div className="login-input-error" ref={e => this.phoneError = e}>شماره وارد شده قبلا استفاده شده است!</div>
                            <div className="login-input-field">
                                <label className="login-input-label">رمز عبور <span>*</span></label>
                                <input name="password" type="password" className="login-input-input" placeholder="******" ref={e => this.passwordInput = e} onChange={this.changePassword} onBlur={this.blurPassword} maxLength={30}/>
                            </div>
                            <div className="login-input-error" ref={e => this.passwordError = e}>طول پسورد باید حداقل 6 و حداکثر 30 کاراکتر باشد!</div>
                        </div>
                        <div className="login-input-cont-slide-child">
                            <div className="login-input-cont-slide-child-title">
                                <div className="login-input-cont-title no-margin">کدی که برات فرستادیم رو بزن :)</div>
                                <Material type="button" className="login-input-back" onClick={this.levelOne}>بازگشت</Material>
                            </div>
                            <div className="login-input-field">
                                <label className="login-input-label">کد تایید</label>
                                <input name="name" type="number" className="login-input-input" maxLength={4} placeholder="مثال: 1234" ref={e => this.codeInput = e}/>
                            </div>
                        </div>
                    </div>
                    <Material type="button" className={`login-input-submit ${loading ? "loading" : ""}`} onClick={this.submit}>
                        {loading ? <BeatLoader size={12} color="white"/> : "ثبت"}
                    </Material>
                </div>

                <div className="login-slider-cont">
                    <div className="login-slider-cont-relative">
                        {
                            this.slides.map((item, index) =>
                                <div key={"slide" + index} style={{opacity: sliderIndex === index ? "1" : "0", left: sliderIndex === index ? "0" : previousSlider === index ? "30px" : "-30px"}} className="login-slider-item">
                                    <img loading="lazy" src={item.img} alt={item.text} className="login-slider-img"/>
                                    <div className="login-slider-text">{item.text}</div>
                                </div>,
                            )
                        }
                        <div className="login-slider-dots">{this.slides.map((dot, index) => <div onClick={() => this.setSlider(index)} style={{backgroundColor: sliderIndex === index ? "#878787" : "white"}} className="login-slider-dot" key={"dot" + index}/>)}</div>
                    </div>
                </div>

            </div>
        )
    }
}

export default SignUpPage