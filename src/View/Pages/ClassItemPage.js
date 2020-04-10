import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Booklet from "../../Media/Svgs/Booklet"
import Questions from "../../Media/Svgs/Questions"
import QuestionsNew from "../../Media/Svgs/QuestionsNew"
import AudioSvg from "../../Media/Svgs/AudioSvg"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import {Link, Route, Switch} from "react-router-dom"
import {HashLink} from "react-router-hash-link"
import ClassItemResourcePage from "./ClassItemResourcePage"
import Helmet from "react-helmet"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
import Material from "../Components/Material"

class ClassItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            error: false,
            items: {},
            videoModal: false,
            videos: [],
        }
        this.sentView = false
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {type, id} = this.props
        api.get(`${type === "block" ? "block" : "lesson"}/category`, `?${type === "block" ? "block" : "lesson"}_id=${id}`)
            .then((data) => data.length > 0 ? this.setState({...this.state, items: data.reduce((sum, item) => ({...sum, [item._id]: {...item}}), {}), loading: false}) : this.setState({...this.state, loading: false, items: {0: 0}}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))

        const {parent} = this.props
        if (parent && parent.title)
        {
            this.sentView = true
            // statistics
            process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `کلاس درس | ${parent.title}`}).catch(err => console.log(err))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (!this.sentView)
        {
            const {parent} = this.props
            if (parent && parent.title)
            {
                this.sentView = true
                // statistics
                process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `کلاس درس | ${parent.title}`}).catch(err => console.log(err))
            }
        }
    }

    singleItemView()
    {
        const {parent} = this.props
        return (
            <div className={`class-single-item-container ${parent?.videos ? "have-videos" : ""}`}>
                <div className="class-single-item-main-svg-container">
                    <div className="class-single-item-main-svg-circle">
                        <Link to={`${parent?._id}/resources`}><img alt={parent?.title} src={parent?.svg && REST_URL + parent?.svg} className="class-single-item-main-svg"/></Link>
                    </div>
                </div>
                <div className={`class-single-item-title ${parent?.videos ? "have-videos" : ""}`}>
                    <Link className="class-lesson-item-info-title-text" to={`${parent?._id}/resources`}> {parent?.title} </Link>
                </div>
                <div className="class-single-item-right-side">
                    <HashLink to={`${parent?._id}/resources#handout`} className="class-single-item-option-section class-single-item-option-section-r">
                        <Booklet className="class-single-item-svg"/>
                        <div>
                            جزوه
                        </div>
                    </HashLink>
                    <HashLink to={`${parent?._id}/resources#question`} className="class-single-item-option-section class-single-item-option-section-r">
                        <QuestionsNew className="class-single-item-svg"/>
                        <div>نمونه‌سوال</div>
                    </HashLink>
                    {
                        parent?.videos &&
                        <HashLink to={`${parent?._id}/resources#summary`} className="class-single-item-option-section class-single-item-option-section-r">
                            <Questions className="class-single-item-svg"/>
                            <div>خلاصه‌درس</div>
                        </HashLink>
                    }
                </div>
                <div className="class-single-item-left-side">
                    <HashLink to={`${parent?._id}/resources#voice`} className="class-single-item-option-section">
                        <div>
                            ویس
                        </div>
                        <AudioSvg className="class-single-item-svg"/>
                    </HashLink>
                    {
                        !parent?.videos ?
                            <HashLink to={`${parent?._id}/resources#summary`} className="class-single-item-option-section ">
                                <div>خلاصه‌درس</div>
                                <Questions className="class-single-item-svg"/>
                            </HashLink>
                            :
                            parent?.videos?.length === 1 ?
                                <HashLink to={`${parent?._id}/resources#video`} className="class-single-item-option-section ">
                                    <div>
                                        فیلم
                                    </div>
                                    <VideoPlayer className="class-single-item-svg"/>
                                </HashLink>
                                :
                                <Material className="class-single-item-option-section " onClick={() => this.toggleVideoModal(parent?.videos)}>
                                    <div>
                                        فیلم
                                    </div>
                                    <VideoPlayer className="class-single-item-svg"/>
                                </Material>
                    }
                </div>
            </div>
        )
    }

    itemsView()
    {
        const {items} = this.state
        const {type, id} = this.props
        return Object.values(items).map((lesson) =>
            <div className="class-item-container" key={lesson._id}>
                <div className="class-lesson-item">
                    <Link className="class-lesson-item-media-svg-container" to={`/class/${type}/${id}/${lesson._id}/resources`}>
                        <img alt={lesson.title} src={lesson.svg && REST_URL + lesson.svg} className="class-lesson-item-media-svg"/>
                    </Link>
                    <div className="class-lesson-item-info">
                        <div className="class-lesson-item-info-title">
                            <Link className="class-lesson-item-info-title-text" to={`/class/${type}/${id}/${lesson._id}/resources`}>{lesson.title}</Link>
                        </div>
                        <div className="class-lesson-item-info-description">
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#handout`}>
                                <div>جزوه</div>
                                <Booklet className="class-lesson-item-info-description-section-svg"/>
                            </HashLink>
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#question`}>
                                <div>نمونه‌سوال</div>
                                <QuestionsNew className="class-lesson-item-info-description-section-svg"/>
                            </HashLink>
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#summary`}>
                                <div>خلاصه‌درس</div>
                                <Questions className="class-lesson-item-info-description-section-svg"/>
                            </HashLink>
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#voice`}>
                                <div>ویس</div>
                                <AudioSvg className="class-lesson-item-info-description-section-svg"/>
                            </HashLink>
                            {
                                lesson.videos && lesson.videos.length > 0 ?
                                    lesson.videos.length === 1 ?
                                        <HashLink className="class-lesson-item-info-description-section" to={`/videos/${lesson.videos && lesson.videos[0]._id}`}>
                                            <div>فیلم</div>
                                            <VideoPlayer className="class-lesson-item-info-description-section-svg"/>
                                        </HashLink>
                                        :
                                        <Material className="class-lesson-item-info-description-section" onClick={() => this.toggleVideoModal(lesson.videos)}>
                                            <div>فیلم</div>
                                            <VideoPlayer className="class-lesson-item-info-description-section-svg"/>
                                        </Material>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>,
        )
    }

    toggleVideoModal(videos)
    {
        const videoModal = !this.state.videoModal
        if (videoModal) this.setState({...this.state, videoModal, videos})
        else this.setState({...this.state, videoModal, videos: []})
    }

    render()
    {
        const {items, loading, error, videoModal, videos} = this.state
        const {parent, user} = this.props
        return (
            <React.Fragment>
                {
                    parent && parent.title &&
                    <Helmet>
                        <title>کلاس درس، {parent.title} | KRED</title>
                        <meta property="og:title" content={`کلاس درس، ${parent.title} | KRED`}/>
                        <meta name="twitter:title" content={`کلاس درس، ${parent.title} | KRED`}/>
                        <meta name="description" content="اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و نمونه سوال گرفته تا کلاس آموزشی پیدا کنی"/>
                        <meta property="og:description" content="اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و نمونه سوال گرفته تا کلاس آموزشی پیدا کنی"/>
                        <meta name="twitter:description" content="اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و نمونه سوال گرفته تا کلاس آموزشی پیدا کنی"/>
                    </Helmet>
                }
                <Switch>
                    <Route path={`/class/:type/:parentId/:id/resources`} render={route =>
                        <ClassItemResourcePage user={user}
                                               type={route.match.params.type}
                                               parentId={true}
                                               item={items[route.match.params.id]}
                                               parent={parent}
                                               id={route.match.params.id}
                        />
                    }/>
                    <Route path={`/class/:type/:id/resources`} render={route =>
                        <ClassItemResourcePage user={user}
                                               type={route.match.params.type}
                                               item={parent}
                                               id={route.match.params.id}
                        />
                    }/>

                    <React.Fragment>
                        <div className="class-item-page-container">
                            <div className="class-location-container">
                                <Link to="/class" className="class-location-link">کلاس درس</Link>
                                <SmoothArrowSvg className="class-left-arrow"/>
                                {parent?.title}
                            </div>
                            {items[0] === 0 ? this.singleItemView() : Object.values(items).length > 0 ? this.itemsView() : null}
                            <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                            <div className={`exchange-page-loading ${loading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                        </div>
                        {
                            videoModal &&
                            <React.Fragment>
                                <div className="create-exchange-back" onClick={() => this.toggleVideoModal()}/>
                                <div className="create-exchange-cont login">
                                    {
                                        videos.map(video =>
                                            <Link key={video._id} className="class-item-video-pack-link" to={`/videos/${video._id}`}><Material className="class-item-video-pack">{video.title}</Material></Link>,
                                        )
                                    }
                                </div>
                            </React.Fragment>
                        }
                    </React.Fragment>
                </Switch>
            </React.Fragment>
        )
    }
}

export default ClassItemPage