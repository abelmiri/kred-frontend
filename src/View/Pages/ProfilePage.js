import React, {PureComponent} from "react"
import {Redirect} from "react-router-dom"
import Material from "../Components/Material"
import Dashboard from "../../Media/Svgs/Dashboard"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
// import Booklet from "../../Media/Svgs/Booklet"
// import Questions from "../../Media/Svgs/Questions"
// import Bookmark from "../../Media/Svgs/Bookmark"
import Profile from "../../Media/Svgs/Profile"
import ProfilePageUserInfo from "../Components/ProfilePageUserInfo"
import api, {REST_URL} from "../../Functions/api"
import ProfilePageDashboard from "../Components/ProfilePageDashboard"
import Footer from "../Components/Footer"
import {ClipLoader} from "react-spinners"
import {Link} from "react-router-dom"

class ProfilePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            selected: "dashboard",
            redirectHome: false,
            posts: {},
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        if (!localStorage.hasOwnProperty("user") && !sessionStorage.hasOwnProperty("user")) this.setState({...this.state, redirectHome: true})

        api.get("conversation", `?limit=2&page=1&time=${new Date().toISOString()}`)
            .then((data) => this.setState({...this.state, posts: data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}))

        this.props.getVideoPacks()

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "پروفایل"}).catch(err => console.log(err))

        document.addEventListener("scroll", this.onScroll)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (prevProps.user && !this.props.user) this.setState({...this.state, redirectHome: true})
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        if (document.body.clientWidth > 480)
        {
            this.leftSide.style.top = document.getElementById("footer").offsetTop - this.leftSide.clientHeight - window.scrollY - 50 > 100 ?
                "100px"
                :
                document.getElementById("footer").offsetTop - this.leftSide.clientHeight - window.scrollY - 50 + "px"

            this.rightSide.style.top = document.getElementById("footer").offsetTop - this.rightSide.clientHeight - window.scrollY - 50 > 100 ?
                "100px"
                :
                document.getElementById("footer").offsetTop - this.rightSide.clientHeight - window.scrollY - 50 + "px"
        }
    }

    changeSelected = (selectedName) => this.state.selected !== selectedName && this.setState({...this.state, selected: selectedName})

    render()
    {
        const {selected, redirectHome, posts} = this.state
        const {setUser, user, videoPacks} = this.props
        return (
            <React.Fragment>
                <div className='profile-container'>
                    {redirectHome && <Redirect to="/"/>}
                    <div className="profile-right-menus" ref={e => this.rightSide = e}>
                        <Material backgroundColor={selected === "dashboard" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("dashboard")}
                                  className={`profile-main-right-menu-element ${selected === "dashboard" ? "selected" : ""}`}>
                            <Dashboard className="dashboard-svg"/>
                            داشبورد من
                        </Material>
                        <Material backgroundColor={selected === "profile" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("profile")}
                                  className={`profile-main-right-menu-element ${selected === "profile" ? "selected" : ""}`}>
                            <Profile className="dashboard-svg"/>
                            اطلاعات حساب
                        </Material>
                        <Material backgroundColor={selected === "videoPlayer" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("videoPlayer")}
                                  className={`profile-main-right-menu-element ${selected === "videoPlayer" ? "selected" : ""}`}>
                            <VideoPlayer className="dashboard-svg"/>
                            فیلم‌های آموزشی
                        </Material>
                        {/*<Material backgroundColor={selected === "booklet" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("booklet")}*/}
                        {/*          className={`profile-main-right-menu-element ${selected === "booklet" ? "selected" : ""}`}>*/}
                        {/*    <Booklet className="dashboard-svg"/>*/}
                        {/*    جزوات و خلاصه های من*/}
                        {/*</Material>*/}
                        {/*<Material backgroundColor={selected === "questions" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("questions")}*/}
                        {/*          className={`profile-main-right-menu-element ${selected === "questions" ? "selected" : ""}`}>*/}
                        {/*    <Questions className="dashboard-svg"/>*/}
                        {/*    نمونه سوال های من*/}
                        {/*</Material>*/}
                        {/*<Material backgroundColor={selected === "bookmark" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("bookmark")}*/}
                        {/*          className={`profile-main-right-menu-element ${selected === "bookmark" ? "selected" : ""}`}>*/}
                        {/*    <Bookmark className="dashboard-svg"/>*/}
                        {/*    علاقه‌مندی های من*/}
                        {/*</Material>*/}
                    </div>
                    <div className="profile-content">
                        {
                            selected === "profile" ?
                                <ProfilePageUserInfo setUser={setUser}/>
                                :
                                selected === "dashboard" ?
                                    <ProfilePageDashboard user={user}/>
                                    :
                                    <div style={{minHeight: "60vh"}}>بزودی...</div>
                        }
                    </div>
                    <div className="profile-left-menus" ref={e => this.leftSide = e}>
                        <div className="profile-left-menus-subject">
                            جدیدترین‌ها
                        </div>
                        <div className="profile-left-menus-title">
                            گپ و گفت
                        </div>
                        {
                            Object.values(posts).length > 0 ?
                                Object.values(posts).map(item =>
                                    <Link key={item._id} to={`/pavilions/${item._id}`} className="profile-left-menus-contents">
                                        <div className="profile-left-menus-contents-desc">
                                            <div className="profile-left-menus-contents-name">{item.interviewee_name}</div>
                                            <div className="profile-left-menus-contents-detail">{item.interviewee_bio}</div>
                                            <div className="profile-left-menus-contents-text">{item.bold_description}</div>
                                        </div>
                                        <img className="profile-left-menus-contents-img" src={REST_URL + "/" + item.picture} alt=""/>
                                    </Link>,
                                )
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                        <div className="profile-left-menus-title">
                            فیلم‌های آموزشی
                        </div>
                        {
                            Object.values(videoPacks).length > 0 ?
                                Object.values(videoPacks).slice(0, 2).map(item =>
                                    <Link key={item._id} to={`/videos/${item._id}`} className="profile-left-menus-contents">
                                        <div className="profile-left-menus-contents-desc">
                                            <div className="profile-left-menus-contents-name">{item.title}</div>
                                            {item.price !== 0 && <div className='video-pack-item-sub'>با زیرنویس فارسی</div>}
                                        </div>
                                        <img className="profile-left-menus-contents-img pack" src={REST_URL + "/" + item.picture} alt=""/>
                                    </Link>,
                                )
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                    </div>
                </div>
                <Footer/>
            </React.Fragment>
        )
    }
}

export default ProfilePage