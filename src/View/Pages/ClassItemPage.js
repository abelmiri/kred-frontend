import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Booklet from "../../Media/Svgs/Booklet"
import Questions from "../../Media/Svgs/Questions"
import QuestionsNew from "../../Media/Svgs/QuestionsNew"
import AudioSvg from "../../Media/Svgs/AudioSvg"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import {Link} from "react-router-dom"

class ClassItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            error: false,
            items: [],
            parent: {},
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {type, id} = this.props
        api.get(`${type === "block" ? "block" : "lesson"}/category`, `?${type === "block" ? "block" : "lesson"}_id=${id}`)
            .then((data) => data.length > 0 ? this.setState({...this.state, items: data, loading: false}) : this.setState({...this.state, loading: false, items: [data]}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
        api.get(`${type === "block" ? "block" : "lesson"}`, `${id}`)
            .then((item) => this.setState({...this.state, loading: false, parent: item}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    singleItemView()
    {
        const {parent} = this.state
        return (
            <div className="class-single-item-container">
                <div className="class-single-item-main-svg-container">
                    <div className="class-single-item-main-svg-circle">
                        <img alt="svg" src={REST_URL + parent.svg} className="class-single-item-main-svg"/>
                    </div>
                </div>
                <div className="class-single-item-title">{parent.title}</div>
                <div className="class-single-item-right-side">
                    <div className="class-single-item-option-section class-single-item-option-section-r">
                        <Booklet className="class-single-item-svg"/>
                        <div>
                            جزوه
                        </div>
                    </div>
                    <div className="class-single-item-option-section class-single-item-option-section-r">
                        <Questions className="class-single-item-svg"/>
                        <div>
                            خلاصه دروس
                        </div>
                    </div>
                    <div className="class-single-item-option-section class-single-item-option-section-r">
                        <QuestionsNew className="class-single-item-svg"/>
                        <div>
                            نمونه سوال
                        </div>
                    </div>
                </div>
                <div className="class-single-item-left-side">
                    <div className="class-single-item-option-section">
                        <div>
                            ویس آموزشی
                        </div>
                        <AudioSvg className="class-single-item-svg"/>
                    </div>
                    <div className="class-single-item-option-section ">
                        <div>
                            فیلم
                        </div>
                        <VideoPlayer className="class-single-item-svg"/>
                    </div>
                </div>
            </div>
        )
    }

    itemsView()
    {
        const {items} = this.state
        return (
            <React.Fragment>
                {
                    items.map((lesson, index) =>
                        <div className="class-item-container" key={lesson._id}>
                            <div className={`class-lesson-item ${(index + 1) % 2 === 0 ? "even" : "odd"}`}>
                                <div className="class-lesson-item-media">
                                    <div className={`class-lesson-item-media-svg-container ${(index + 1) % 2 === 0 ? "even" : "odd"}`}>
                                        <img alt="svg" src={REST_URL + lesson.svg} className="class-lesson-item-media-svg"/>
                                    </div>
                                </div>
                                <div className="class-lesson-item-info">
                                    <div className={`class-lesson-item-info-title ${(index + 1) % 2 === 0 ? "even" : "odd"}`}>{lesson.title}</div>
                                    <div className="class-lesson-item-info-description">
                                        <div className="class-lesson-item-info-description-section">
                                            <div>
                                                جزوه
                                            </div>
                                            <Booklet className={"class-lesson-item-info-description-section-svg"}/>
                                        </div>
                                        <div className="class-lesson-item-info-description-section">
                                            <div>
                                                خلاصه دروس
                                            </div>
                                            <Questions className={"class-lesson-item-info-description-section-svg"}/>
                                        </div>
                                        <div className="class-lesson-item-info-description-section">
                                            <div>
                                                نمونه سوال
                                            </div>
                                            <QuestionsNew className={"class-lesson-item-info-description-section-svg"}/>
                                        </div>
                                        <div className="class-lesson-item-info-description-section">
                                            <div>
                                                ویس آموزشی
                                            </div>
                                            <AudioSvg className={"class-lesson-item-info-description-section-svg"}/>
                                        </div>
                                        <div className="class-lesson-item-info-description-section">
                                            <div>
                                                فیلم
                                            </div>
                                            <VideoPlayer className={"class-lesson-item-info-description-section-svg"}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                }
            </React.Fragment>
        )
    }

    render()
    {
        const {items, parent, loading, error} = this.state
        return (
            <div className="class-item-page-container">
                <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                <div className={`exchange-page-loading ${loading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                {
                    !loading &&
                    <div className="class-location-container">
                        <Link to={"/class"} className="class-location-link">کلاس درس</Link>
                        <SmoothArrowSvg className="class-left-arrow"/>
                        {parent.title}
                    </div>
                }
                {items.length === 1 ? this.singleItemView() : items.length > 1 ? this.itemsView() : null}
            </div>
        )
    }
}

export default ClassItemPage