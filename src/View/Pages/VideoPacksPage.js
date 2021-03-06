import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import api, {REST_URL} from "../../Functions/api"
import Material from "../Components/Material"
import {Route, Switch} from "react-router-dom"
import ShowPackPage from "./ShowPackPage"
import addCommaPrice from "../../Helpers/addCommaPrice"
import {NotificationManager} from "react-notifications"
import ProfilePageUserInfo from "../Components/ProfilePageUserInfo"
import {Helmet} from "react-helmet"
import Footer from "../Components/Footer"
import Pack from "../Components/Pack"

class VideoPacksPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            buyLoading: false,
            buyModal: false,
            buyPack: null,
            level: 0,
            offCodeLoading: false,
            code: null,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        this.props.getCompanies()
        this.props.getCompanyCategories()
        this.props.getVideoPacks()

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "ویدیوها"}).catch(err => console.log(err))

        window.addEventListener("popstate", this.onPopState)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (this.props.user?._id !== prevProps.user?._id) this.props.getVideoPacks()
    }

    componentWillUnmount()
    {
        window.removeEventListener("popstate", this.onPopState)
    }

    onPopState = () =>
    {
        if (document.body.clientWidth <= 480)
        {
            if (this.state.buyModal)
            {
                document.body.style.overflow = "auto"
                this.setState({...this.state, buyModal: false})
            }
        }
    }

    buyPack = (e, pack) =>
    {
        e && e.preventDefault()
        const {user} = this.props
        if (user)
        {
            const {buyPack} = this.state
            if (document.body.clientWidth <= 480) window.history.pushState("", "", "/videos/complete-profile")
            document.body.style.overflow = "hidden"
            this.setState({...this.state, buyModal: true, buyPack: pack ? pack : buyPack, level: !user.name || !user.university ? 0 : 1, code: null})
        }
        else
        {
            if (document.getElementById("header-login")) document.getElementById("header-login").click()
            NotificationManager.error("برای استفاده از فیلم ها، ثبت نام کنید یا وارد شوید.")
        }
    }

    submitShop = () =>
    {
        this.hideCompleteProfile()
        setTimeout(() =>
        {
            const {buyPack, code} = this.state
            this.setState({...this.state, buyLoading: true}, () =>
            {
                api.post("buy-video-pack", {video_pack_id: buyPack._id, code: code?.code})
                    .then(response => window.location.href = response.link)
                    .catch(() => this.setState({...this.state, buyLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! بعدا امتحان کنید.")))
            })
        }, 50)
    }

    hideCompleteProfile = () =>
    {
        if (this.state.buyModal)
        {
            if (document.body.clientWidth <= 480) window.history.back()
            else
            {
                document.body.style.overflow = "auto"
                this.setState({...this.state, buyModal: false, level: 0})
            }
        }
    }

    changeOffCode = (e) => e.target.value = e.target.value.trim()

    validateOffCode = () =>
    {
        const {offCodeLoading} = this.state
        if (this.state.code) this.setState({...this.state, code: null})
        else
        {
            const code = this.offCode.value
            if (code && !offCodeLoading)
            {
                this.setState({...this.state, offCodeLoading: true}, () =>
                {
                    api.post("off-code-verify", {code})
                        .then(result =>
                        {
                            const {code} = result
                            this.setState({...this.state, code, offCodeLoading: false})
                        })
                        .catch(err =>
                        {
                            this.setState({...this.state, offCodeLoading: false}, () =>
                            {
                                if (err.response?.data.message) NotificationManager.error(err.response.data.message)
                                else NotificationManager.error("خطا در برقراری ارتباط با سرور!")
                            })
                        })
                })
            }
        }
    }

    render()
    {
        const {buyLoading, buyModal, level, offCodeLoading, code, buyPack} = this.state
        const {videoPacks, companies, companyCategories, user, setUser} = this.props
        return (
            <React.Fragment>
                <Helmet>
                    <title>فیلم‌های آموزشی | KRED</title>
                    <meta property="og:title" content="فیلم‌های آموزشی | KRED"/>
                    <meta name="twitter:title" content="فیلم‌های آموزشی | KRED"/>
                    <meta name="description" content="اینجا قراره یه جوره دیگه درس بخونیم، مثل دانشجوهای بهترین دانشگاه‌های دنیا... آماده‌ای؟"/>
                    <meta property="og:description" content="اینجا قراره یه جوره دیگه درس بخونیم، مثل دانشجوهای بهترین دانشگاه‌های دنیا... آماده‌ای؟"/>
                    <meta name="twitter:description" content="اینجا قراره یه جوره دیگه درس بخونیم، مثل دانشجوهای بهترین دانشگاه‌های دنیا... آماده‌ای؟"/>
                </Helmet>
                <Switch>
                    <Route path="/videos/:id/:videoId" render={route => <ShowPackPage packId={route.match.params.id} videoId={route.match.params.videoId} user={user}/>}/>
                    <Route path="/videos/:id" render={route => <ShowPackPage packId={route.match.params.id} user={user}/>}/>

                    <React.Fragment>
                        <div className="page-background-img video">
                            <div className="page-des-cont">
                                <h2 className="video-page-desc">فیلم‌های آموزشی</h2>
                                <h3 className="video-page-text">
                                    اینجا قراره یه جوره دیگه درس بخونیم، مثل دانشجوهای بهترین
                                    دانشگاه‌های دنیا... آماده‌ای؟
                                </h3>
                            </div>
                        </div>

                        {
                            Object.values(companies).length > 0 ?
                                <div className="video-packs-page-cont">
                                    {
                                        Object.values(companies).map(company =>
                                            <div key={company._id} className="company-item-cont">
                                                <div className="company-item">
                                                    <div>مجموعه فیلم‌های آموزشی<span> </span>{company.name}</div>
                                                    <div className="company-item-left-side">
                                                        <div className="company-item-english">{company.english_name}</div>
                                                        <img loading="lazy" className="company-item-img" src={REST_URL + "/" + company.picture} alt={company.name}/>
                                                    </div>
                                                </div>
                                                <div className="company-item-desc">{company.description}</div>
                                                {
                                                    Object.values(companyCategories).filter(category => category.company_id === company._id).map(category =>
                                                        <div key={category._id}>
                                                            <div className="company-category-title">{category.title}</div>
                                                            <div className="video-pack-cont">
                                                                {
                                                                    Object.values(videoPacks).filter(pack => pack.company_category_id === category._id).length > 0 ?
                                                                        <React.Fragment>
                                                                            {
                                                                                Object.values(videoPacks).filter(pack => pack.company_category_id === category._id).sort((a, b) => a.order > b.order ? -1 : 1).map(pack =>
                                                                                    <Pack key={pack._id} pack={pack} buyPack={this.buyPack}/>,
                                                                                )
                                                                            }
                                                                            <div className="video-pack-item-hide"/>
                                                                            <div className="video-pack-item-hide"/>
                                                                        </React.Fragment>
                                                                        :
                                                                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                                                }
                                                            </div>
                                                        </div>,
                                                    )
                                                }
                                            </div>,
                                        )
                                    }
                                </div>
                                :
                                <div className="video-packs-page-cont loading">
                                    <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                </div>
                        }

                        {
                            (buyLoading || buyModal) &&
                            <React.Fragment>
                                <div className="create-exchange-back" onClick={this.hideCompleteProfile}/>
                                {
                                    buyLoading ?
                                        <div className="buy-loading">
                                            <ClipLoader size={24} color="#3AAFA9"/>
                                        </div>
                                        :
                                        <div className="buy-loading profile">
                                            <div className="buy-slide-cont" style={{transform: `translateX(${level * 100}%)`}}>
                                                <div className="buy-slide">
                                                    <ProfilePageUserInfo user={user} setUser={setUser} showPrompt={true} dontShowPasswordBtn={true} resolve={this.buyPack}/>
                                                </div>
                                                <div className="buy-slide">
                                                    <div className="profile-introduction-title">تایید خرید</div>
                                                    <div className="profile-info-description">
                                                        <div>
                                                            <p>کد تخفیف</p>
                                                            <input className="buy-code-input" type="text" placeholder={buyPack.off_percent !== 0 && "کد تخفیف بر روی قیمت اصلی محاسبه می‌شود"} ref={e => this.offCode = e} onChange={this.changeOffCode}/>
                                                        </div>
                                                        <div className="buy-off-code">
                                                            <div className="buy-off-code-amount-cont">
                                                                {
                                                                    code && <div className="buy-off-code-amount">تخفیف {code.amount_type === "fix" ? addCommaPrice(code.amount) : code.amount} {code.amount_type === "fix" ? "تومانی" : "درصدی"}</div>
                                                                }
                                                            </div>
                                                            {
                                                                buyPack &&
                                                                <div className="buy-off-code-pay">
                                                                    مبلغ قابل پرداخت:
                                                                    <span> </span>
                                                                    {
                                                                        code ?
                                                                            addCommaPrice(buyPack.price - (code.amount_type === "fix" ? code.amount : code.amount / 100 * buyPack.price))
                                                                            :
                                                                            addCommaPrice(buyPack.off_percent !== 0 ? ((100 - buyPack.off_percent) / 100) * buyPack.price : buyPack.price)
                                                                    }
                                                                    <span> </span>
                                                                    تومان
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="profile-info-submit-buttons-container">
                                                            <Material type="button" style={{flexGrow: 1}} onClick={this.validateOffCode} className={`profile-info-submit-button ${offCodeLoading ? "loading" : ""}`}>
                                                                {code ? "حذف کد تخفیف" : "ثبت"}
                                                            </Material>
                                                            <Material type="button" style={{flexGrow: 1}} className={`profile-info-submit-button ${buyLoading ? "loading" : ""}`} onClick={this.submitShop}>
                                                                تکمیل خرید
                                                            </Material>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </React.Fragment>
                        }

                    </React.Fragment>
                </Switch>
                <Footer/>
            </React.Fragment>
        )
    }
}

export default VideoPacksPage