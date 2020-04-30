import React, {PureComponent} from "react"
import {Link, Redirect, Switch, Route, NavLink} from "react-router-dom"
import Material from "../Components/Material"
import Dashboard from "../../Media/Svgs/Dashboard"
import Profile from "../../Media/Svgs/Profile"
import ProfilePageUserInfo from "../Components/ProfilePageUserInfo"
import api, {REST_URL} from "../../Functions/api"
import ProfilePageDashboard from "../Components/ProfilePageDashboard"
import Footer from "../Components/Footer"
import {ClipLoader} from "react-spinners"
import Helmet from "react-helmet"
import SaveSvg from "../../Media/Svgs/SaveSvg"
import ProfileSaves from "../Components/ProfileSaves"

class ProfilePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            redirectHome: false,
            posts: {},
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        if (!localStorage.hasOwnProperty("user") && !sessionStorage.hasOwnProperty("user")) this.setState({...this.state, redirectHome: true})

        api.get("conversation", `?limit=2&page=1`)
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

    render()
    {
        const {redirectHome, posts} = this.state
        const {setUser, user, videoPacks} = this.props
        if (redirectHome) return <Redirect to="/"/>
        else if (user)
        {
            return (
                <React.Fragment>
                    <Helmet>
                        <title>پروفایل من | KRED</title>
                        <meta property="og:title" content="پروفایل من | KRED"/>
                        <meta name="twitter:title" content="پروفایل من | KRED"/>
                        <meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                        <meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                        <meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    </Helmet>
                    <div className="profile-container">
                        <div className="profile-right-menus" ref={e => this.rightSide = e}>
                            <NavLink activeClassName="profile-main-right-menu-element-active" replace to="/profile/dashboard">
                                <Material className="profile-main-right-menu-element">
                                    <Dashboard className="dashboard-svg"/>
                                    داشبورد من
                                </Material>
                            </NavLink>
                            <NavLink activeClassName="profile-main-right-menu-element-active" replace to="/profile/info">
                                <Material className="profile-main-right-menu-element">
                                    <Profile className="dashboard-svg"/>
                                    اطلاعات حساب
                                </Material>
                            </NavLink>
                            <NavLink activeClassName="profile-main-right-menu-element-active" replace to="/profile/saved">
                                <Material className="profile-main-right-menu-element">
                                    <SaveSvg className="dashboard-svg"/>
                                    ذخیره دونی
                                </Material>
                            </NavLink>
                        </div>
                        <div className="profile-content">
                            <Switch>
                                <Route path="/profile/info" render={() => <ProfilePageUserInfo setUser={setUser}/>}/>
                                <Route path="/profile/saved" render={() => <ProfileSaves/>}/>
                                <Route path="*" render={() => <ProfilePageDashboard user={user}/>}/>
                            </Switch>
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
                                                {item.price !== 0 && <div className="video-pack-item-sub">با زیرنویس فارسی</div>}
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
        else return null
    }
}

export default ProfilePage