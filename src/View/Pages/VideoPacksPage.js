import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import api, {REST_URL} from "../../Functions/api"
import Material from "../Components/Material"
import {Link, Route, Switch} from "react-router-dom"
import ShowPackPage from "./ShowPackPage"
import TickSvg from "../../Media/Svgs/TickSvg"
import addCommaPrice from "../../Helpers/addCommaPrice"
import {NotificationManager} from "react-notifications"

class VideoPacksPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            buyLoading: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        this.props.getCompanies()
        this.props.getVideoPacks()

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "ویدیوها"}).catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (this.props.user?._id !== prevProps.user?._id) this.props.getVideoPacks()
    }

    buyPack(e, pack)
    {
        e.preventDefault()
        if (this.props.user)
        {
            this.setState({...this.state, buyLoading: true}, () =>
            {
                api.post("buy-video-pack", {video_pack_id: pack._id})
                    .then(response =>
                    {
                        console.log(response.data)
                        window.location.href = response.data.link
                    })
                    .catch(() => this.setState({...this.state, buyLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! بعدا امتحان کنید.")))
            })
        }
        else
        {
            if (document.getElementById("header-login")) document.getElementById("header-login").click()
            NotificationManager.error("برای استفاده از فیلم ها، در سایت ثبت نام و یا وارد شوید.")
        }
    }

    render()
    {
        const {buyLoading} = this.state
        const {videoPacks, companies, user, route} = this.props
        return (
            <Switch>
                <Route path={`${route.match.url}/:id`} render={(route) => <ShowPackPage packId={route.match.params.id} user={user}/>}/>

                <React.Fragment>
                    <div className='video-background-img'>
                        <div className='video-des-cont'>
                            <h2 className='video-page-desc'>فیلم‌های آموزشی</h2>
                            <h3 className='video-page-text'>
                                اینجا قراره یه جوره دیگه درس بخونیم، مثل دانشجوهای بهترین
                                دانشگاه‌های دنیا... آماده‌ای؟
                            </h3>
                        </div>
                    </div>
                    <div className="video-packs-page-cont">
                        {
                            Object.values(companies).length > 0 ?
                                Object.values(companies).map(company =>
                                    <div key={company._id} className="company-item-cont">
                                        <div className="company-item">
                                            <div>مجموعه فیلم‌های آموزشی<span> </span>{company.name}</div>
                                            <div className="company-item-left-side">
                                                <div className="company-item-english">{company.english_name}</div>
                                                <img className="company-item-img" src={REST_URL + "/" + company.picture} alt={company.name}/>
                                            </div>
                                        </div>
                                        <div className="company-item-desc">{company.description}</div>
                                        {
                                            Object.values(videoPacks).length > 0 ?
                                                Object.values(videoPacks).map(pack =>
                                                    <Link key={pack._id} to={`/videos/${pack._id}`}>
                                                        <div className="video-pack-item">
                                                            <img className="video-pack-item-img" src={REST_URL + "/" + pack.picture} alt={pack.title}/>
                                                            <div className="video-pack-item-title">
                                                                <div className="video-pack-item-title-text">{pack.title}</div>
                                                                {
                                                                    pack.have_permission ?
                                                                        <TickSvg className="video-pack-item-title-svg"/>
                                                                        :
                                                                        <Material className="video-pack-item-title-buy" onClick={(e) => this.buyPack(e, pack)}>
                                                                            خرید ({addCommaPrice(pack.price)} تومان)
                                                                        </Material>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Link>,
                                                )
                                                :
                                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                        }
                                    </div>,
                                )
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                    </div>

                    {
                        buyLoading &&
                        <React.Fragment>
                            <div className="create-exchange-back"/>
                            <div className="buy-loading">
                                <ClipLoader size={24} color="#3AAFA9"/>
                            </div>
                        </React.Fragment>
                    }

                </React.Fragment>
            </Switch>
        )
    }
}

export default VideoPacksPage