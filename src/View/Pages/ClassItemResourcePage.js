import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {Link, Switch, Route} from "react-router-dom"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import VoiceSvg from "../../Media/Svgs/VoiceSvg"
import {ClipLoader} from "react-spinners"
import {ClassResourcesItems} from "../Components/ClassResourcesItems"
import ClassItemResourceFilePage from "./ClassItemResourceFilePage"

class ClassItemResourcePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            resLoading: true,
            error: false,
            resources: [],
            handout: [],
            summary: [],
            question: [],
            voice: [],
            video: [],
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {type, id, parentId} = this.props
        api.get("education-resource", `?${type === "block" ? parentId ? "block_category_id" : "block_id" : parentId ? "lesson_category_id" : "lesson_id"}=${id}`)
            .then((res) => this.setState({
                ...this.state,
                resLoading: false,
                resources: res,
                handout: res.filter((p) => p.type === "handout"),
                summary: res.filter((p) => p.type === "summary"),
                question: res.filter((p) => p.type === "question"),
                voice: res.filter((p) => p.type === "voice"),
                video: res.filter((p) => p.type === "video"),
            }))
            .catch(() => this.setState({...this.state, error: true}))
    }

    render()
    {
        const {resLoading, error, handout, summary, question, voice, video} = this.state
        const {type, parent, item, user} = this.props
        return (
            <Switch>
                <Route path={`/class/:type/:parentId/:id/resources/:fileId`} render={(route) =>
                    <ClassItemResourceFilePage user={user}
                                               type={route.match.params.type}
                                               item={item}
                                               parent={parent}
                                               id={route.match.params.id}
                                               fileId={route.match.params.fileId}
                                               setFileUpdate={this.setFileUpdate}
                    />
                }/>
                <Route path={`/class/:type/:id/resources/:fileId`} render={(route) =>
                    <ClassItemResourceFilePage user={user}
                                               type={route.match.params.type}
                                               item={item}
                                               parent={parent}
                                               id={route.match.params.id}
                                               fileId={route.match.params.fileId}
                                               setFileUpdate={this.setFileUpdate}
                    />
                }/>

                <React.Fragment>
                    <div className="class-resources-page-container">
                        <div className="class-location-container">
                            <Link to="/class" className="class-location-link">کلاس درس</Link>
                            <SmoothArrowSvg className="class-left-arrow"/>
                            {
                                parent && parent.title ?
                                    <React.Fragment>
                                        <Link to={`/class/${type}/${parent._id}`} className="class-location-link">{parent.title}</Link>
                                        <SmoothArrowSvg className="class-left-arrow"/>
                                        {item?.title}
                                    </React.Fragment>
                                    :
                                    item &&
                                    <React.Fragment>
                                        <Link to={`/class/${type}/${item._id}`} className="class-location-link">{item.title}</Link>
                                        <SmoothArrowSvg className="class-left-arrow"/>
                                        منابع درسی
                                    </React.Fragment>
                            }
                        </div>
                        {
                            !resLoading &&
                            <div className="class-a-resource-container">
                                <div className="class-a-resource-container-anchor" id="handout"/>
                                <div className="class-a-resource-container-title">جزوه‌ها</div>
                                {handout.length === 0 && <div className={`exchange-page-loading empty-text ${!resLoading ? "" : "none"}`}>متأسفانه محتوایی برای نمایش پیدا نشد</div>}
                                {
                                    handout.map(item => <ClassResourcesItems key={item._id} item={item} svg={<PdfSvg className="class-handout-item-svg"/>}/>)
                                }
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                            </div>
                        }
                        {
                            !resLoading &&
                            <div className="class-a-resource-container">
                                <div className="class-a-resource-container-anchor" id="summary"/>
                                <div className="class-a-resource-container-title">خلاصه درس</div>
                                {summary.length === 0 && <div className={`exchange-page-loading empty-text ${!resLoading ? "" : "none"}`}>متأسفانه محتوایی برای نمایش پیدا نشد</div>}
                                {
                                    summary.map(item => <ClassResourcesItems key={item._id} item={item} svg={<PdfSvg className="class-handout-item-svg"/>}/>)
                                }
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                            </div>
                        }
                        {
                            !resLoading &&
                            <div className="class-a-resource-container">
                                <div className="class-a-resource-container-anchor" id="question"/>
                                <div className="class-a-resource-container-title">نمونه سوالات</div>
                                {question.length === 0 && <div className={`exchange-page-loading empty-text ${!resLoading ? "" : "none"}`}>متأسفانه محتوایی برای نمایش پیدا نشد</div>}
                                {
                                    question.map(item => <ClassResourcesItems key={item._id} type="question" item={item} svg={<PdfSvg className="class-handout-item-svg"/>}/>)
                                }
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                            </div>
                        }
                        {
                            !resLoading &&
                            <div className="class-a-resource-container">
                                <div className="class-a-resource-container-anchor" id="voice"/>
                                <div className="class-a-resource-container-title">ویس‌آموزشی</div>
                                {voice.length === 0 && <div className={`exchange-page-loading empty-text ${!resLoading ? "" : "none"}`}>متأسفانه محتوایی برای نمایش پیدا نشد</div>}
                                {
                                    voice.map(item => <ClassResourcesItems key={item._id} item={item} svg={<VoiceSvg className="class-handout-item-svg"/>}/>)
                                }
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                            </div>
                        }
                        {
                            video.length > 0 &&
                            <div className="class-a-resource-container">
                                <div className="class-a-resource-container-anchor" id="video"/>
                                <div className="class-a-resource-container-title">فیلم آموزشی</div>
                                {
                                    video.map(item => <ClassResourcesItems key={item._id} item={item} svg={<VoiceSvg className="class-handout-item-svg"/>}/>)
                                }
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                                <div className="class-handout-item-hide"/>
                            </div>
                        }
                        <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                        <div className={`exchange-page-loading ${resLoading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default ClassItemResourcePage