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

    render()
    {
        const {selected, redirectHome} = this.state
        const {setUser, user} = this.props
        return (
            <div className='profile-container'>
                {redirectHome && <Redirect to="/"/>}
                <div className="profile-right-menus">
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
                                "بزودی..."
                    }
                </div>
                <div className="profile-left-menus">
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
        )
    }
}

export default ProfilePage