import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import Slider1 from "../Media/Images/login-slider1.jpg"
import Slider2 from "../Media/Images/login-slider2.jpg"
import Slider3 from "../Media/Images/login-slider3.jpg"
import Material from "./Material"
import {Link} from "react-router-dom"

const slides = [
    {img: Slider1, text: "دیگه لازم نیست پول زیادی برای کتاب‌هات خرج کنی!"},
    {img: Slider2, text: "دیگه وقتشه مثل حرفه ای درس بخونی!"},
    {img: Slider3, text: "توی KRED از حال و هوای دانشجوهای موفق باخبر شو!"},
]

class LoginPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            previousSlider: slides.length - 1,
            sliderIndex: 0,
        }
    }

    componentDidMount()
    {
        this.sliderInterval = setInterval(() =>
        {
            const {sliderIndex} = this.state
            this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === slides.length ? 0 : sliderIndex + 1})
        }, 5000)
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
                    this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === slides.length ? 0 : sliderIndex + 1})
                }, 5000)
            })
        }
    }

    render()
    {
        const {sliderIndex, previousSlider} = this.state
        return (
            <div className='login-container'>
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
                        <label className='login-input-label'>شماره موبایل</label>
                        <input name='phone' type='number' className='login-input-input' placeholder="مثال: 09123456789" onInput={e => e.target.value = e.target.value.slice(0, 11)}/>
                    </div>
                    <div className='login-input-field'>
                        <label className='login-input-label'>نام کامل</label>
                        <input name='full_name' type='text' className='login-input-input' placeholder="مثال: سید عرفان وهابی میری"/>
                    </div>
                    <div className='login-input-field'>
                        <label className='login-input-label'>رمز عبور</label>
                        <input name='password' type='password' className='login-input-input' placeholder="******"/>
                    </div>
                    <Material type='button' className="login-input-submit">ثبت</Material>
                </div>

                <div className='login-slider-cont'>
                    <div className='login-slider-cont-relative'>
                        {
                            slides.map((item, index) =>
                                <div key={"slide" + index} style={{opacity: sliderIndex === index ? "1" : "0", left: sliderIndex === index ? "0" : previousSlider === index ? "30px" : "-30px"}} className='login-slider-item'>
                                    <img src={item.img} alt='' className='login-slider-img'/>
                                    <div className='login-slider-text'>{item.text}</div>
                                </div>,
                            )
                        }
                        <div className='login-slider-dots'>{slides.map((dot, index) => <div onClick={() => this.setSlider(index)} style={{backgroundColor: sliderIndex === index ? "#878787" : "white"}} className='login-slider-dot' key={"dot" + index}/>)}</div>
                    </div>
                </div>

            </div>
        )
    }
}

export default LoginPage