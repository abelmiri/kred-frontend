import React, {PureComponent} from "react"
import Library from "../../Media/Images/Library.jpg"
import Nurses from "../../Media/Images/Nurses.png"
import Pavion from "../../Media/Images/Pavion.png"
import Doctors from "../../Media/Images/Doctors.png"
import Slider from "../../Media/Images/slider.png"
import SliderText from "../../Media/Images/slider-text.png"
import Material from "../Components/Material"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import axios from "axios"
import Footer from "../Components/Footer"
import {ClipLoader} from "react-spinners"
import {Link} from "react-router-dom"
import copyToClipboard from "../../Helpers/copyToClipboard"
import {NotificationManager} from "react-notifications"
import Helmet from "react-helmet"

class HomePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            freeVideos: {},
            videoError: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        if (document.body.clientWidth >= 800)
            api.get("video/free", "")
                .then(freeVideos => this.setState({...this.state, freeVideos: freeVideos.reduce((sum, video) => ({...sum, [video._id]: {...video}}), {})}, () => this.getSubtitlesFromServer(freeVideos)))
                .catch(() => this.setState({...this.state, videoError: true}))

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "صفحه اصلی"}).catch(err => console.log(err))
    }

    changeRoute(e, location)
    {
        e.preventDefault()
        const {goToExchangeBook} = this.props
        const {target} = e
        goToExchangeBook(target, location)
    }

    getSubtitlesFromServer(videos)
    {
        videos.forEach(video =>
        {
            axios.get(REST_URL + video.subtitle_url, {responseType: "blob"})
                .then((res) =>
                {
                    const freeVideos = {...this.state.freeVideos}
                    freeVideos[video._id] = {...video, subtitle: URL.createObjectURL(res.data)}
                    this.setState({...this.state, freeVideos})
                })
        })
    }

    onLinkClick = (e) =>
    {
        if (this.linkTimer)
        {
            e.preventDefault()
            this.linkTimer = false
        }
    }

    onLinkDown = () => this.linkTime = setTimeout(() => this.linkTimer = true, 100)

    onLinkUp = () => clearTimeout(this.linkTime)

    onVideoPlay = (e) =>
    {
        const {freeVideos} = this.state
        Object.values(freeVideos).forEach(video => video._id !== e.target.id && document.getElementById(video._id).pause())
        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "video", content: freeVideos[e.target.id].title, content_id: e.target.id}).catch(err => console.log(err))
    }

    sliderClick = () => copyToClipboard("corona_off", () => NotificationManager.success("کد تخفیف کپی شد"))

    render()
    {
        const {freeVideos, videoError} = this.state
        const {user} = this.props
        return (
            <React.Fragment>
                <Helmet>
                    <title>گام هایی جذاب در دنیای پزشکی | KRED</title>
                    <meta property="og:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/>
                    <meta name="twitter:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/>
                    <meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                </Helmet>
                <div className="home-background-img">
                    <h2 className="home-title">K<span>RED</span></h2>
                    <h3 className="home-desc">گام هایی جذاب در دنیای پزشکی</h3>
                </div>
                <Link to="/videos" onClick={this.sliderClick} className="home-slider-cont">
                    <div className="home-slider">
                        <img className="home-slider-img" src={Slider} alt="KRED CORONA OFF"/>
                        <img className="home-slider-img-text" src={SliderText} alt="KRED CORONA OFF"/>
                    </div>
                </Link>
                <div className="home-videos">
                    <div className="home-videos-text">
                        <h3 className="home-videos-title">فیلم‌های آموزشی</h3>
                        <div className="home-exchange-description">به دنیای جدید آموزش بیا! دیگه نیازی نیست دغدغه یادگیری درسات رو داشته باشی</div>
                        <a href="/videos" className="home-section-butt" onClick={(e) => this.changeRoute(e, "/videos")}>برو تو فیلم‌های آموزشی</a>
                    </div>
                    <img className="home-videos-img mobile" src={Nurses} alt="فیلم‌های آموزشی"/>
                    <div className="home-videos-img desktop">
                        <div className="home-videos-img-title">پربازدیدترین فیلم‌ها</div>
                        {
                            Object.values(freeVideos).length > 0 ?
                                <MySlider dots={true} marginDots="5px 0 15px 0" dotColor="#3AAFA9" dotSelectedColor="#2B7A78" nodes={
                                    (Object.values(freeVideos)).map(video =>
                                        <div className="home-videos-item-cont">
                                            <video key={video._id} preload="none" id={video._id} controls controlsList="nodownload"
                                                   className="home-videos-item"
                                                   poster={video.poster ? REST_URL + video.poster : null}
                                                   onPlay={this.onVideoPlay}
                                                   onMouseDown={this.onLinkDown}
                                                   onMouseUp={this.onLinkUp}
                                                   onClick={this.onLinkClick}>
                                                <source src={REST_URL + video.video_url}/>
                                                <track label="Farsi" kind="subtitles" srcLang="en" src={video.subtitle} default/>
                                            </video>
                                            <div className="home-videos-item-title">{video.title}</div>
                                        </div>,
                                    )
                                }/>
                                :
                                videoError ?
                                    <div className="exchange-page-loading not-found">خطا در گرفتن ویدیوها</div>
                                    :
                                    <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                    </div>
                </div>
                <div className="home-exchange">
                    <img className="home-exchange-img" src={Doctors} alt="کلاس درس"/>
                    <div className="home-exchange-text">
                        <h3 className="home-exchange-title">کلاس درس</h3>
                        <div className="home-exchange-description">
                            یه کلاس برای کل دانشجوهای پزشکی ایران
                            دوست داری همه ی جزوه ها، وویس ها و نمونه سوالات بهترین استاد های پزشکی ایران رو داشته باشی؟؟
                            پس توی کلاس درس، منتظرتم
                            <span role="img" aria-label=""> 😉</span>
                        </div>
                        <a href="/class" className="home-section-butt reverse" onClick={(e) => this.changeRoute(e, "/class")}>برو تو کلاس درس</a>
                    </div>
                </div>
                <div className="home-videos">
                    <div className="home-videos-text">
                        <h3 className="home-videos-title">گپ و گفت</h3>
                        <div className="home-exchange-description">اینجا میتونی با بقیه سال بالایی هات در ارتباط باشی و ازشون کلی تجربه جدید کسب کنی</div>
                        <a href="/pavilions" className="home-section-butt" onClick={(e) => this.changeRoute(e, "/pavilions")}>برو تو گپ و گفت</a>
                    </div>
                    <img className="home-videos-img" src={Pavion} alt="گپ و گفت"/>
                </div>
                <div className="home-exchange">
                    <img className="home-exchange-img" src={Library} alt="تبادل کتاب"/>
                    <div className="home-exchange-text">
                        <h3 className="home-exchange-title">تبادل کتاب</h3>
                        <div className="home-exchange-description">تو اینجا میتونی هر کتابی رو لازم نداری بفروشی، هر کدومو لازم داری بخری</div>
                        <a href="/exchanges" className="home-section-butt reverse" onClick={(e) => this.changeRoute(e, "/exchanges")}>برو تو تبادل کتاب</a>
                    </div>
                </div>
                <div className="home-about">
                    <h3 className="home-about-title">اینجا چه خبره؟!</h3>
                    <div className="home-about-description">
                        سلام! اینجا KRED عه...
                        <br/>
                        یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم
                        <br/>
                        <br/>
                        اینجا چه فرقی با جاهای دیگه داره؟
                        <br/>
                        توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم
                        <br/>
                        و کلی کارای جالب و جدید دیگه که باید بیای و ببینی!!!
                    </div>
                </div>
                <div className="home-collab">
                    <div className="home-collab-cont">
                        <h3 className="home-collab-title">تو هم میتونی با کرد همکاری کنی ...</h3>
                        <a href="https://t.me/KRED_admin" target="_blank" rel="noopener noreferrer"><Material type="button" className="home-collab-butt">همکاری با KRED</Material></a>
                    </div>
                </div>
                <Footer user={user}/>
            </React.Fragment>
        )
    }
}

export default HomePage