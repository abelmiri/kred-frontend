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

class ClassItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            error: false,
            items: {},
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {type, id} = this.props
        api.get(`${type === "block" ? "block" : "lesson"}/category`, `?${type === "block" ? "block" : "lesson"}_id=${id}`)
            .then((data) => data.length > 0 ? this.setState({...this.state, items: data.reduce((sum, item) => ({...sum, [item._id]: {...item}}), {}), loading: false}) : this.setState({...this.state, loading: false, items: {0: 0}}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    singleItemView()
    {
        const {parent} = this.props
        return (
            <div className="class-single-item-container">
                <div className="class-single-item-main-svg-container">
                    <div className="class-single-item-main-svg-circle">
                        <Link to={`${parent?._id}/resources`}><img alt="svg" src={parent?.svg && REST_URL + parent?.svg} className="class-single-item-main-svg"/></Link>
                    </div>
                </div>
                <div className="class-single-item-title">
                    <Link className="class-lesson-item-info-title-text" to={`${parent?._id}/resources`}> {parent?.title} </Link>
                </div>
                <div className="class-single-item-right-side">
                    <HashLink to={`${parent?._id}/resources#handout`} className="class-single-item-option-section class-single-item-option-section-r">
                        <Booklet className="class-single-item-svg"/>
                        <div>
                            جزوه
                        </div>
                    </HashLink>
                    <HashLink to={`${parent?._id}/resources#summary`} className="class-single-item-option-section class-single-item-option-section-r">
                        <Questions className="class-single-item-svg"/>
                        <div>
                            خلاصه دروس
                        </div>
                    </HashLink>
                    {/*<HashLink to={`${parent?._id}/resources#question`} className="class-single-item-option-section class-single-item-option-section-r">*/}
                    {/*    <QuestionsNew className="class-single-item-svg"/>*/}
                    {/*    <div>*/}
                    {/*        نمونه سوال*/}
                    {/*    </div>*/}
                    {/*</HashLink>*/}
                </div>
                <div className="class-single-item-left-side">
                    <HashLink to={`${parent?._id}/resources#question`} className="class-single-item-option-section">
                        <div>
                            نمونه سوال
                        </div>
                        <QuestionsNew className="class-single-item-svg"/>
                    </HashLink>
                    <HashLink to={`${parent?._id}/resources#voice`} className="class-single-item-option-section">
                        <div>
                            ویس‌آموزشی
                        </div>
                        <AudioSvg className="class-single-item-svg"/>
                    </HashLink>
                    {/*<HashLink to={`${parent?._id}/resources#video`} className="class-single-item-option-section ">*/}
                    {/*    <div>*/}
                    {/*        فیلم*/}
                    {/*    </div>*/}
                    {/*    <VideoPlayer className="class-single-item-svg"/>*/}
                    {/*</HashLink>*/}
                </div>
            </div>
        )
    }

    itemsView()
    {
        const {items} = this.state
        const {type, id} = this.props
        return Object.values(items).map((lesson, index) =>
            <div className="class-item-container" key={lesson._id}>
                <div className={`class-lesson-item ${(index + 1) % 2 === 0 ? "even" : "odd"}`}>
                    <div className="class-lesson-item-media">
                        <Link to={`/class/${type}/${id}/${lesson._id}/resources`}>
                            <div className={`class-lesson-item-media-svg-container ${(index + 1) % 2 === 0 ? "even" : "odd"}`}>
                                <img alt="svg" src={lesson.svg && REST_URL + lesson.svg} className="class-lesson-item-media-svg"/>
                            </div>
                        </Link>
                    </div>
                    <div className="class-lesson-item-info">
                        <div className={`class-lesson-item-info-title ${(index + 1) % 2 === 0 ? "even" : "odd"}`}>
                            <Link className="class-lesson-item-info-title-text" to={`/class/${type}/${id}/${lesson._id}/resources`}>{lesson.title}</Link>
                        </div>
                        <div className="class-lesson-item-info-description">
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#handout`}>
                                <div>
                                    جزوه
                                </div>
                                <Booklet className={"class-lesson-item-info-description-section-svg"}/>
                            </HashLink>
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#summary`}>
                                <div>
                                    خلاصه دروس
                                </div>
                                <Questions className={"class-lesson-item-info-description-section-svg"}/>
                            </HashLink>
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#question`}>
                                <div>
                                    نمونه سوال
                                </div>
                                <QuestionsNew className={"class-lesson-item-info-description-section-svg"}/>
                            </HashLink>
                            <HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#voice`}>
                                <div>
                                    ویس‌آموزشی
                                </div>
                                <AudioSvg className={"class-lesson-item-info-description-section-svg"}/>
                            </HashLink>
                            {/*<HashLink className="class-lesson-item-info-description-section" to={`/class/${type}/${id}/${lesson._id}/resources#video`}>*/}
                            {/*    <div>*/}
                            {/*        فیلم*/}
                            {/*    </div>*/}
                            {/*    <VideoPlayer className={"class-lesson-item-info-description-section-svg"}/>*/}
                            {/*</HashLink>*/}
                        </div>
                    </div>
                </div>
            </div>,
        )
    }

    render()
    {
        const {items, loading, error} = this.state
        const {parent, user} = this.props
        return (
            <React.Fragment>
                {
                   parent && parent.title &&
                   <Helmet>
                       <title>کلاس درس، {parent.title} | KRED</title>
                       <meta property="og:title" content="کلاس درس | KRED"/>
                       <meta name="twitter:title" content="کلاس درس | KRED"/>
                       <meta name="description" content="اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و نمونه سوال گرفته تا کلاس آموزشی پیدا کنی"/>
                       <meta property="og:description" content="اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و نمونه سوال گرفته تا کلاس آموزشی پیدا کنی"/>
                       <meta name="twitter:description" content="اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و نمونه سوال گرفته تا کلاس آموزشی پیدا کنی"/>
                   </Helmet>
                }
                <Switch>
                    <Route path={`/class/:type/:parentId/:id/resources`} render={(route) =>
                        <ClassItemResourcePage user={user}
                                               type={route.match.params.type}
                                               parentId={true}
                                               item={items[route.match.params.id]}
                                               parent={parent}
                                               id={route.match.params.id}
                        />
                    }/>
                    <Route path={`/class/:type/:id/resources`} render={(route) =>
                        <ClassItemResourcePage user={user}
                                               type={route.match.params.type}
                                               item={parent}
                                               id={route.match.params.id}
                        />
                    }/>

                    <React.Fragment>
                        <div className="class-item-page-container">
                            <div className="class-location-container">
                                <Link to={"/class"} className="class-location-link">کلاس درس</Link>
                                <SmoothArrowSvg className="class-left-arrow"/>
                                {parent?.title}
                            </div>
                            {items[0] === 0 ? this.singleItemView() : Object.values(items).length > 0 ? this.itemsView() : null}
                            <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                            <div className={`exchange-page-loading ${loading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                        </div>
                    </React.Fragment>
                </Switch>
            </React.Fragment>
        )
    }
}

export default ClassItemPage