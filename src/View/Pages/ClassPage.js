import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import api, {REST_URL} from "../../Functions/api"
import Material from "../Components/Material"
import Booklet from "../../Media/Svgs/Booklet"
import Questions from "../../Media/Svgs/Questions"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
import AudioSvg from "../../Media/Svgs/AudioSvg"
import QuestionsNew from "../../Media/Svgs/QuestionsNew"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import LogoSvg from "../../Media/Svgs/LogoSvg"
import CommentSvg from "../../Media/Svgs/CommentSvg"
import {Link, Route, Switch} from "react-router-dom"
import ClassItemPage from "./ClassItemPage"

const indexes = [
    Math.round(Math.random() * 20),
    Math.round(Math.random() * 20),
    Math.round(Math.random() * 20),
    Math.round(Math.random() * 20),
    Math.round(Math.random() * 20),
]

class ClassPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            error: false,
            isBlockView: false,
            blocks: [],
            lessons: [],
            itemsCount: 0,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        api.get("lesson")
            .then((data) => this.setState({...this.state, loading: false, lessons: data}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
        api.get("block")
            .then((data) => this.setState({...this.state, loading: false, blocks: data}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
        api.get("education-resource/count")
            .then((itemsCount) => this.setState({...this.state, loading: false, itemsCount: itemsCount.count}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    changeSubjects = (value) => this.setState({...this.state, isBlockView: value})

    render()
    {
        const {lessons, blocks, isBlockView, itemsCount, loading, error} = this.state
        return (
            <Switch>
                <Route path={`/class/:type/:id`} render={(route) => <ClassItemPage type={route.match.params.type} id={route.match.params.id}/>}/>
                <React.Fragment>
                    <div className="page-background-img class">
                        <div className="page-des-cont">
                            <h2 className="exchange-desc class">گپ و گفت</h2>
                            <h3 className="exchange-text class">
                                اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و
                                <br/>
                                نمونه سوال گرفته تا کلاس آموزشی پیدا کنی
                            </h3>
                        </div>
                    </div>

                    <div className="lessons-blocks-list-con">
                        <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                        <div className={`exchange-page-loading ${loading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                        {
                            !loading && <div className="class-switch-box">
                                <input type="checkbox" id="switch" checked={isBlockView} onChange={(e) => this.changeSubjects(e.target.checked)}/>
                                <label htmlFor="switch"/>
                                <div className="class-subject-text">چینش بر اساس</div>
                                <div onClick={() => this.changeSubjects(!isBlockView)} className={`class-switch-right-text${isBlockView ? " selected" : ""}`}>بلوک</div>
                                <div onClick={() => this.changeSubjects(!isBlockView)} className={`class-switch-left-text${isBlockView ? " selected" : ""}`}>درس</div>
                            </div>
                        }
                        {
                            (isBlockView ? blocks : lessons).map((les, index) =>
                                <React.Fragment key={les._id}>
                                    {
                                        index === indexes[0] &&
                                        <div className="class-tall-info-box">
                                            <div className="class-tall-info-section-box">
                                                <div>
                                                    جزوه
                                                </div>
                                                <Booklet className={"class-info-svg"}/>
                                            </div>
                                            <div className="class-tall-info-section-box">
                                                <div>
                                                    خلاصه دروس
                                                </div>
                                                <Questions className={"class-info-svg"}/>
                                            </div>
                                            <div className="class-tall-info-section-box">
                                                <div>
                                                    نمونه سوال
                                                </div>
                                                <QuestionsNew className={"class-info-svg"}/>
                                            </div>
                                            <div className="class-tall-info-section-box">
                                                <div>
                                                    ویس آموزشی
                                                </div>
                                                <AudioSvg className={"class-info-svg"}/>
                                            </div>
                                            <div className="class-tall-info-section-box">
                                                <div>
                                                    فیلم
                                                </div>
                                                <VideoPlayer className={"class-info-svg"}/>
                                            </div>
                                        </div>
                                    }
                                    {
                                        index === indexes[1] &&
                                        <div className="class-counter-box">
                                            <div className="class-counter-box-number">{itemsCount}</div>
                                            <div className="class-subject-text">آموزش</div>
                                        </div>
                                    }
                                    {
                                        index === indexes[2] &&
                                        <div className="class-like-box">
                                            <LikeSvg className="class-like-svg"/>
                                            <div className="class-subject-text">آموزش ها رو لایک کن</div>
                                        </div>
                                    }
                                    {
                                        index === indexes[3] &&
                                        <div className="class-kred-box">
                                            <LogoSvg className="class-kred-svg"/>
                                            <div className="class-subject-text">با KRED متفاوت باش</div>
                                        </div>
                                    }
                                    {
                                        index === indexes[4] &&
                                        <div className="class-like-box">
                                            <CommentSvg className="class-comment-svg"/>
                                            <div className="class-subject-text">پایین آموزش ها کامنت بزار</div>
                                        </div>
                                    }

                                    <Material className="class-subject-box" backgroundColor="rgba(255,255,255,0.35)">
                                        <Link to={`/class/${isBlockView ? "block" : "lesson"}/${les._id}`}>
                                            <img alt="svg" src={REST_URL + les.svg} className="class-subject-svg"/>
                                            <div className="class-subject-text">{les.title}</div>
                                        </Link>
                                    </Material>
                                </React.Fragment>,
                            )
                        }
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default ClassPage