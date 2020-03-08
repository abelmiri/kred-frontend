import React, {PureComponent} from "react"
import Library from "../../Media/Images/Library.jpg"
import Nurses from "../../Media/Images/Nurses.png"
import Pavion from "../../Media/Images/Pavion.jpg"
import Material from "../Components/Material"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import axios from "axios"
import Footer from "../Components/Footer"
import {ClipLoader} from "react-spinners"

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
            api.get("video/free", "", true)
                .then(freeVideos => this.setState({...this.state, freeVideos: freeVideos.reduce((sum, video) => ({...sum, [video._id]: {...video}}), {})}, () => this.getSubtitlesFromServer(freeVideos)))
                .catch(() => this.setState({...this.state, videoError: true}))

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "صفحه اصلی"}).catch(err => console.log(err))
    }

    changeRoute(e, location)
    {
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

    render()
    {
        const {user} = this.props
        const {freeVideos, videoError} = this.state
        return (
            <React.Fragment>
                <div className='home-background-img'>
                    <h2 className='home-title'>K<span>RED</span></h2>
                    <h3 className='home-desc'>گام هایی جذاب در دنیای پزشکی</h3>
                </div>
                <div className='home-videos'>
                    <div className='home-videos-text'>
                        <h3 className='home-videos-title'>فیلم‌های آموزشی</h3>
                        <div className='home-exchange-description'>به دنیای جدید آموزش بیا! دیگه نیازی نیست دغدغه یادگیری درسات رو داشته باشی</div>
                        <button className='home-section-butt' onClick={(e) => this.changeRoute(e, "/videos")}>برو تو فیلم‌های آموزشی</button>
                    </div>
                    <img className='home-videos-img mobile' src={Nurses} alt=''/>
                    <div className="home-videos-img desktop">
                        <div className="home-videos-img-title">پربازدیدترین فیلم‌ها</div>
                        {
                            Object.values(freeVideos).length > 0 ?
                                <MySlider dots={true} marginDots="5px 0 15px 0" dotColor="#3AAFA9" dotSelectedColor="#2B7A78" nodes={
                                    (Object.values(freeVideos)).map(video =>
                                        <div className="home-videos-item-cont">
                                            <video key={video._id} id={video._id} controls controlsList="nodownload"
                                                   className="home-videos-item"
                                                   poster={REST_URL + video.poster}
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
                <div className='home-exchange'>
                    <img className='home-exchange-img' src={Library} alt=''/>
                    <div className='home-exchange-text'>
                        <h3 className='home-exchange-title'>تبادل کتاب</h3>
                        <div className='home-exchange-description'>تو اینجا میتونی هر کتابی رو لازم نداری بفروشی، هر کدومو لازم داری بخری</div>
                        <button className='home-section-butt reverse' onClick={(e) => this.changeRoute(e, "/exchanges")}>برو تو تبادل کتاب</button>
                    </div>
                </div>
                {
                    user?.role === "admin" &&
                    <div className='home-videos'>
                        <div className='home-videos-text'>
                            <h3 className='home-videos-title'>گپ و گفت</h3>
                            <div className='home-exchange-description'>اینجا میتونی با بقیه سال بالایی هات در ارتباط باشی و ازشون کلی تجربه جدید کسب کنی</div>
                            <button className='home-section-butt' onClick={(e) => this.changeRoute(e, "/pavilions")}>برو تو گپ و گفت</button>
                        </div>
                        <img className='home-videos-img' src={Pavion} alt=''/>
                    </div>
                }
                <div className='home-about'>
                    <h3 className='home-about-title'>اینجا چه خبره؟!</h3>
                    <div className='home-about-description'>
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
                {/*<div className='home-exchange'>*/}
                {/*    <img className='home-exchange-img' src={Library} alt=''/>*/}
                {/*    <div className='home-exchange-text'>*/}
                {/*        <h3 className='home-exchange-title'>جزوه ها و خلاصه درس ها</h3>*/}
                {/*        <div className='home-exchange-description'>دیگه سر کلاس جزوه ننویس!</div>*/}
                {/*        <button className='home-exchange-butt' onClick={(e) => this.changeRoute(e, "/exchange")}>برو تو جزوه و خلاصه درس</button>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className='home-questions'>*/}
                {/*    <div className='home-videos-text'>*/}
                {/*        <h3 className='home-videos-title'>نمونه سوال</h3>*/}
                {/*        <div className='home-exchange-description'>نمونه سوال بزنی پاسی!</div>*/}
                {/*        <button className='home-videos-butt' onClick={(e) => this.changeRoute(e, "/exchange")}>برو تو نمونه سوال</button>*/}
                {/*    </div>*/}
                {/*    <img className='home-videos-img' src={Doctors} alt=''/>*/}
                {/*</div>*/}
                <div className='home-collab'>
                    <div className='home-collab-cont'>
                        <h3 className='home-collab-title'>تو هم میتونی با کرد همکاری کنی ...</h3>
                        <a href="https://t.me/KRED_admin" target="_blank" rel="noopener noreferrer"><Material type='button' backgroundColor='rgba(58,175,169,0.2)' className='home-collab-butt'>همکاری با KRED</Material></a>
                    </div>
                </div>
                <Footer/>
            </React.Fragment>
        )
    }
}

export default HomePage