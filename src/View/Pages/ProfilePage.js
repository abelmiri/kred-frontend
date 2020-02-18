import React, {PureComponent} from "react"
import {Redirect} from "react-router-dom"
import Material from "../Components/Material"
import Dashboard from "../../Media/Svgs/Dashboard"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
import Booklet from "../../Media/Svgs/Booklet"
import Questions from "../../Media/Svgs/Questions"
import Bookmark from "../../Media/Svgs/Bookmark"
import Profile from "../../Media/Svgs/Profile"
import ProfilePageUserInfo from "../Components/ProfilePageUserInfo"
import api from "../../Functions/api"
import ProfilePageDashboard from "../Components/ProfilePageDashboard"

class ProfilePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            selected: "dashboard",
            redirectHome: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        if (!localStorage.hasOwnProperty("user")) this.setState({...this.state, redirectHome: true})

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "پروفایل"}).catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        prevProps.user && !this.props.user &&
        setTimeout(() => !localStorage.hasOwnProperty("user") && this.setState({...this.state, redirectHome: true}), 100)
    }

    changeSelected = (selectedName) => this.state.selected !== selectedName && this.setState({...this.state, selected: selectedName})

    renderContent = () =>
    {
        const {selected} = this.state
        const {setUser} = this.props
        switch (selected)
        {
            case "profile":
                return <ProfilePageUserInfo setUser={setUser}/>
            case "dashboard":
                return <ProfilePageDashboard/>
            default:
                return "بزودی..."
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
                        <Material backgroundColor={selected === "profile" ? "rgba(255,255,255,.25)" : "rgba(23,37,42,.25)"} onClick={() => this.changeSelected("profile")}
                                  className={selected === "profile" ? "profile-main-right-menu-element-selected" : "profile-main-right-menu-element"}>
                            <Profile className="dashboard-svg"/>
                            اطلاعات حساب
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