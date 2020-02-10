import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import Slider1 from "../Media/Images/login-slider1.jpg"
import Slider2 from "../Media/Images/login-slider2.jpg"
import Slider3 from "../Media/Images/login-slider3.jpg"
import Material from "./Material"
import {Link, Redirect} from "react-router-dom"
import {BeatLoader} from "react-spinners"
import api from "../Functions/api"
import {NotificationManager} from "react-notifications"

class LoginPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.slides = [
            {img: Slider1, text: "دیگه لازم نیست پول زیادی برای کتاب‌هات خرج کنی!"},
            {img: Slider2, text: "دیگه وقتشه حرفه ای درس بخونی!"},
            {img: Slider3, text: "توی KRED از حال و هوای دانشجوهای موفق باخبر شو!"},
        ]
        this.phoneValid = false
        this.passwordValid = false
        this.state = {
            redirectHome: false,
            loading: false,
            previousSlider: this.slides.length - 1,
            sliderIndex: 0,
        }
        this.changePhone = this.changePhone.bind(this)
        this.blurPassword = this.blurPassword.bind(this)
        this.blurPhone = this.blurPhone.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.submit = this.submit.bind(this)
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        if (localStorage.hasOwnProperty("user")) this.setState({...this.state, redirectHome: true})

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
        const {value} = e.target
        if (value.length === 11)
        {
            api.post("user/phone_check", {phone: value}, "", true)
                .then((data) =>
                {
                    if (data.count > 0)
                    {
                        this.phoneInput.style.borderBottom = "1px solid red"
                        this.phoneError.style.height = "20px"
                        this.phoneValid = false
                    }
                    else
                    {
                        this.phoneInput.style.borderBottom = ""
                        this.phoneError.style.height = ""
                        this.phoneValid = true
                    }
                })
        }
        else this.phoneValid = false
    }

    blurPhone(e)
    {
        if (e.target.value.length < 11) this.phoneInput.style.borderBottom = "1px solid red"
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

    submit()
    {
        const {loading} = this.state
        const {setUser} = this.props
        if (!loading && this.phoneValid && this.passwordValid)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                api.post("user", {phone: this.phoneInput.value, name: this.nameInput.value, password: this.passwordInput.value}, "", true)
                    .then((data) =>
                    {
                        setUser(data)
                        this.setState({...this.state, redirectHome: true})
                    })
                    .catch(() => NotificationManager.error("سیستم با خطا مواجه شد!"))
            })
        }
    }

    render()
    {
        const {sliderIndex, previousSlider, redirectHome, loading} = this.state
        return (
            <div className='login-container'>

                {redirectHome && <Redirect to="/"/>}

                <div className='login-square'/>

                <div className='login-kred-logo'>
                    <h1 className='header-logo-cont-title'>K<span>RED</span></h1>
                    <Link to="/">
                        <img src={Logo} className='header-logo' alt='kred logo'/>
                    </Link>
                </div>

                <h2 className='login-title'>سلام رفیق! به KRED خوش اومدی <span aria-label="" role="img">😊🥰</span></h2>

                <div className='login-input-cont'>
                    <div className='login-input-cont-title'> میشه اطلاعات زیر رو کامل کنی؟</div>
                    <div className='login-input-field'>
                        <label className='login-input-label'>شماره موبایل <span>*</span></label>
                        <input name='phone' type='number' className='login-input-input' placeholder="مثال: 09123456789" ref={e => this.phoneInput = e} onChange={this.changePhone} onBlur={this.blurPhone} onInput={e => e.target.value = e.target.value.slice(0, 11)}/>
                    </div>
                    <div className='login-input-error' ref={e => this.phoneError = e}>شماره وارد شده قبلا استفاده شده است!</div>
                    <div className='login-input-field'>
                        <label className='login-input-label'>نام کامل</label>
                        <input name='full_name' type='text' className='login-input-input' placeholder="مثال: سید عرفان وهابی میری" ref={e => this.nameInput = e}/>
                    </div>
                    <div className='login-input-field'>
                        <label className='login-input-label'>رمز عبور <span>*</span></label>
                        <input name='password' type='password' className='login-input-input' placeholder="******" ref={e => this.passwordInput = e} onChange={this.changePassword} onBlur={this.blurPassword} maxLength={30}/>
                    </div>
                    <div className='login-input-error' ref={e => this.passwordError = e}>طول پسورد باید حداقل 6 و حداکثر 30 کاراکتر باشد!</div>
                    <Material type='button' className={loading ? "login-input-submit loading" : "login-input-submit"} onClick={this.submit}>{loading ? <BeatLoader size={12} color="white"/> : "ثبت"}</Material>
                </div>

                <div className='login-slider-cont'>
                    <div className='login-slider-cont-relative'>
                        {
                            this.slides.map((item, index) =>
                                <div key={"slide" + index} style={{opacity: sliderIndex === index ? "1" : "0", left: sliderIndex === index ? "0" : previousSlider === index ? "30px" : "-30px"}} className='login-slider-item'>
                                    <img src={item.img} alt='' className='login-slider-img'/>
                                    <div className='login-slider-text'>{item.text}</div>
                                </div>,
                            )
                        }
                        <div className='login-slider-dots'>{this.slides.map((dot, index) => <div onClick={() => this.setSlider(index)} style={{backgroundColor: sliderIndex === index ? "#878787" : "white"}} className='login-slider-dot' key={"dot" + index}/>)}</div>
                    </div>
                </div>

            </div>
        )
    }
}

export default LoginPage