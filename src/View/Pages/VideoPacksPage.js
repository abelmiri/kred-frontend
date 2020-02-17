import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import api, {REST_URL} from "../../Functions/api"
import Material from "../Components/Material"
import {Link, Route, Switch} from "react-router-dom"
import ShowVideoPage from "./ShowVideoPage"

class VideoPacksPage extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
        this.props.getCompanies()
        this.props.getVideoPacks()

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "ویدیوها"}).catch(err => console.log(err))
    }

    render()
    {
        const {videoPacks, companies, user, route} = this.props
        return (
            <Switch>
                <Route path={`${route.match.url}/:pack`} render={(route) => <ShowVideoPage route={route} user={user}/>}/>

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
                                                        <Material className="video-pack-item">
                                                            <img className="video-pack-item-img" src={REST_URL + "/" + pack.picture} alt={pack.title}/>
                                                            <div className="video-pack-item-title">{pack.title}</div>
                                                        </Material>
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
                </React.Fragment>
            </Switch>
        )
    }
}

export default VideoPacksPage