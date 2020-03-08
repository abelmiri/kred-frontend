import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import CommentSvg from "../../Media/Svgs/CommentSvg"
import Footer from "../Components/Footer"
import CopySvg from "../../Media/Svgs/CopySvg"
import {NotificationManager} from "react-notifications"
import copyToClipboard from "../../Helpers/copyToClipboard"

class PavilionItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            pavilion: null,
            notFound: false,
            error: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {pavilionId} = this.props

        api.get(`conversation/${pavilionId}`, `?time=${new Date().toISOString()}`)
            .then((pavilion) => this.setState({...this.state, pavilion}))
            .catch((e) => e?.response?.status === 404 ? this.setState({...this.state, notFound: true}) : this.setState({...this.state, error: true}))

    }

    likeAndDisLike = () =>
    {
        const {pavilion} = this.state
        if (pavilion.is_liked)
        {
            api.del(`conversation/like/${pavilion._id}`)
                .then(() => this.setState({...this.state, pavilion: {...pavilion, is_liked: false, likes_count: pavilion.likes_count - 1}}))
                .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
        }
        else
        {
            api.post("conversation/like", {conversation_id: pavilion._id})
                .then(() => this.setState({...this.state, pavilion: {...pavilion, is_liked: true, likes_count: pavilion.likes_count + 1}}))
                .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
        }
    }

    copy = () => copyToClipboard(`https://www.kred.ir/pavilions/${this.state.pavilion._id}`, () => NotificationManager.success("لینک با موفقیت کپی شد"))

    render()
    {
        const {notFound, error, pavilion} = this.state
        return (
            <React.Fragment>
                <div className="pavilion-item-page-cont">
                    {
                        notFound ?
                            <div className="exchange-page-loading">مصاحبه مورد نظر یافت نشد!</div>
                            :
                            error ?
                                <div className="exchange-page-loading">سایت در گرفتن اطلاعات با مشکل مواجه شد!</div>
                                :
                                pavilion ?
                                    <React.Fragment>
                                        <h1 className="pavilion-item-title">{pavilion.title}</h1>
                                        <img className="pavilion-item-pic" src={REST_URL + "/" + pavilion.picture} alt={pavilion.title}/>
                                        <div className="pavilion-item-bold-desc">{pavilion.bold_description}</div>
                                        <div className="pavilion-item-desc">{pavilion.description}</div>
                                        <div className="pavilion-item-footer">
                                            <Material className="post-like-count-cont like" onClick={this.likeAndDisLike}>
                                                <LikeSvg className={`post-like-svg ${pavilion.is_liked ? "liked" : ""}`}/>
                                                <div className={`pavilion-item-like ${pavilion.is_liked ? "liked" : ""}`}>{pavilion.likes_count} پسند</div>
                                            </Material>
                                            <Material className="post-like-count-cont copy" onClick={this.copy}>
                                                <CopySvg className="post-comment-svg"/>
                                                <div className="pavilion-item-like">کپی لینک</div>
                                            </Material>
                                            <Material className="post-like-count-cont comment">
                                                <CommentSvg className="post-comment-svg"/>
                                                <div className="pavilion-item-like">{pavilion.comments_count} دیدگاه</div>
                                            </Material>
                                        </div>
                                    </React.Fragment>
                                    :
                                    <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                    }
                </div>
                <Footer/>
            </React.Fragment>
        )
    }
}

export default PavilionItemPage