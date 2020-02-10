import React, {PureComponent} from "react"
import {Link, Redirect} from "react-router-dom"
import Material from "./Material"
import Dashboard from "../Media/Svgs/Dashboard"
import VideoPlayer from "../Media/Svgs/VideoPlayer"
import Booklet from "../Media/Svgs/Booklet"
import Questions from "../Media/Svgs/Questions"
import Bookmark from "../Media/Svgs/Bookmark"
import Slider1 from "../Media/Images/login-slider1.jpg"
import Slider2 from "../Media/Images/login-slider2.jpg"
import Slider3 from "../Media/Images/login-slider3.jpg"
import Profile from "../Media/Svgs/Profile"
import ProfilePageUserInfo from "./ProfilePageUserInfo"
import api from "../Functions/api"

const slides = [
    {img: Slider1, text: "دیگه لازم نیست پول زیادی برای کتاب‌هات خرج کنی!"},
    {img: Slider2, text: "دیگه وقتشه حرفه ای درس بخونی!"},
    {img: Slider3, text: "توی KRED از حال و هوای دانشجوهای موفق باخبر شو!"},
]

class ProfilePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            selected: "dashboard",
            sliderIndex: 0,
            previousSlider: slides.length - 1,
            redirectHome: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        if (!localStorage.hasOwnProperty("user")) this.setState({...this.state, redirectHome: true})
        this.sliderInterval = setInterval(() =>
        {
            const {sliderIndex} = this.state
            this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === slides.length ? 0 : sliderIndex + 1})
        }, 5000)

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "پروفایل"}).catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (!this.props.user)
            this.checkUserTimeout = setTimeout(() =>
            {
                if (!localStorage.hasOwnProperty("user")) this.setState({...this.state, redirectHome: true})
            }, 100)
    }

    componentWillUnmount()
    {
        clearTimeout(this.checkUserTimeout)
        clearInterval(this.sliderInterval)
    }

    changeSelected = (selectedName) => this.state.selected !== selectedName && this.setState({...this.state, selected: selectedName})

    setSlider = (index) =>
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

    renderContent = () =>
    {
        const {selected, sliderIndex, previousSlider} = this.state
        const {setUser} = this.props
        switch (selected)
        {
            case "profile":
                return <ProfilePageUserInfo setUser={setUser}/>
            default:
                return <div className="profile-introduction">
                    <div className="profile-introduction-content">
                        <div className="profile-introduction-title">
                            سلام!
                        </div>
                        <div className="profile-introduction-description">
                            <p>به KRED خوش اومدی <span role="img" aria-label=''>😊</span></p>
                            <p>اینجا برای نتیجه گیریه! یک جمع صمیمی از دانشجوهای علوم پزشکی با کلی تجربه و محتوا و اتفاق جالب... خوشحال میشیم تو هم بیای.</p>
                            <p>کرِد یک کلمه باستانیه که ریشه‌ی تمام کلماتی حساب میشه که معنیشون قلبه... <span role="img" aria-label=''>🧡</span></p>
                            <p>حالا بیا با قسمت های مختلف سایت آشنا بشیم:</p>
                            <div className="profile-introduction-links">
                                <Link to="/profile" className="link">فیلم های آموزشی</Link>
                                <Link to="/profile" className="link">گپ و گفت</Link>
                                <Link to="/exchange" className="link">تبادل کتاب</Link>
                                <Link to="/profile" className="link">جزوات و خلاصه درس ها</Link>
                                <Link to="/profile" className="link">نمونه سوالات</Link>
                            </div>
                        </div>
                    </div>
                    <div className="profile-introduction-slider">
                        {
                            slides.map((item, index) =>
                                <div key={"slide" + index}
                                     style={{opacity: sliderIndex === index ? "1" : "0", left: sliderIndex === index ? "0" : previousSlider === index ? "30px" : "-30px"}}
                                     className='login-slider-item'>
                                    <img src={item.img} alt='' className='login-slider-img'/>
                                    <div className='login-slider-text'>{item.text}</div>
                                </div>,
                            )
                        }
                        <div className='login-slider-dots'>
                            {slides.map((dot, index) =>
                                <div onClick={() => this.setSlider(index)} style={{backgroundColor: sliderIndex === index ? "#878787" : "white"}}
                                     className='login-slider-dot' key={"dot" + index}/>)}
                        </div>
                    </div>
                </div>
        }
    }

    render()
    {
        const {selected, redirectHome} = this.state
        return (
            <div className='profile-container'>
                {redirectHome && <Redirect to="/"/>}
                <div className="profile-right-menus">
                    <div className="profile-main-right-menu">
                        <Material backgroundColor={selected === "dashboard" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("dashboard")}
                                  className={selected === "dashboard" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <Dashboard className="dashboard-svg"/>
                            داشبور من
                        </Material>
                        <Material backgroundColor={selected === "videoPlayer" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("videoPlayer")}
                                  className={selected === "videoPlayer" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <VideoPlayer className="dashboard-svg"/>
                            فیلم های آموزشی من
                        </Material>
                        <Material backgroundColor={selected === "booklet" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("booklet")}
                                  className={selected === "booklet" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <Booklet className="dashboard-svg"/>
                            جزوات و خلاصه های من
                        </Material>
                        <Material backgroundColor={selected === "questions" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("questions")}
                                  className={selected === "questions" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <Questions className="dashboard-svg"/>
                            نمونه سوال های من
                        </Material>
                        <Material backgroundColor={selected === "bookmark" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("bookmark")}
                                  className={selected === "bookmark" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <Bookmark className="dashboard-svg"/>
                            علاقه‌مندی های من
                        </Material>
                        <Material backgroundColor={selected === "profile" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("profile")}
                                  className={selected === "profile" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <Profile className="dashboard-svg"/>
                            اطلاعات حساب
                        </Material>
                    </div>
                </div>
                <div className="profile-content">
                    {
                        this.renderContent()
                    }

                </div>
                <div className="profile-left-menus">
                    <div className="profile-left-menus">
                        <div className="profile-movies-left-menu">
                            <div className="profile-left-menus-title">
                                فیلم های آموزشی
                            </div>
                            <div className="profile-left-menus-contents">
                                محتوای اول!
                            </div>
                            <div className="profile-left-menus-contents">
                                محتوای دوم!
                            </div>
                            <div className="profile-left-menus-contents">
                                محتوای سوم!
                            </div>
                        </div>
                        <div className="profile-forum-left-menu">
                            <div className="profile-left-menus-title">
                                گپ و گفت
                            </div>
                            <div className="profile-left-menus-contents">
                                محتوای اول!
                            </div>
                            <div className="profile-left-menus-contents">
                                محتوای دوم!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePage