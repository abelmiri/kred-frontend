import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {Link} from "react-router-dom"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import VoiceSvg from "../../Media/Svgs/VoiceSvg"
import {ClipLoader} from "react-spinners"
import {ClassResourcesItems} from "../Components/ClassResourcesItems"

class ClassItemResourcePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            resLoading: true,
            loading: true,
            error: false,
            parent: {},
            item: {},
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

        if (parentId)
        {
            api.get(`${type}`, `${parentId}`)
                .then((item) => this.setState({...this.state, loading: false, parent: item}))
                .catch(() => this.setState({...this.state, error: true, loading: false}))
            api.get(`${type}/category`, `${id}`)
                .then((item) => this.setState({...this.state, loading: false, item: item}))
                .catch(() => this.setState({...this.state, error: true, loading: false}))
        }
        else
        {
            api.get(`${type}`, `${id}`)
                .then((item) => this.setState({...this.state, loading: false, item: item}))
                .catch(() => this.setState({...this.state, error: true, loading: false}))
        }

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
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    render()
    {
        const {loading, resLoading, error, parent, item, resources, handout, summary, question, voice, video} = this.state
        const {type} = this.props
        console.log("RES", resources)
        console.log("handout", handout)
        return (
            <div className="class-resources-page-container">
                {
                    !loading &&
                    <div className="class-location-container">
                        <Link to="/class" className="class-location-link">کلاس درس</Link>
                        <SmoothArrowSvg className="class-left-arrow"/>
                        {
                            parent.title ?
                                <React.Fragment>
                                    <Link to={`/class/${type}/${parent._id}`} className="class-location-link">{parent.title}</Link>
                                    <SmoothArrowSvg className="class-left-arrow"/>
                                    {item.title}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Link to={`/class/${type}/${item._id}`} className="class-location-link">{item.title}</Link>
                                    <SmoothArrowSvg className="class-left-arrow"/>
                                    منابع درسی
                                </React.Fragment>
                        }
                    </div>
                }
                <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                <div className={`exchange-page-loading ${resLoading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                <div className={`exchange-page-loading error-text ${!resLoading && resources.length === 0 ? "" : "none"}`}>منابع آموزشی در این دسته بندی وجود ندارد</div>
                {
                    handout.length > 0 &&
                    <div className="class-a-resource-container">
                        <div className="class-a-resource-container-anchor" id="handout"/>
                        <div className="class-a-resource-container-title">جزوه‌ها</div>
                        {
                            handout.map(item => <ClassResourcesItems item={item} svg={<PdfSvg className="class-handout-item-svg"/>}/>)
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
                    summary.length > 0 &&
                    <div className="class-a-resource-container">
                        <div className="class-a-resource-container-anchor" id="summary"/>
                        <div className="class-a-resource-container-title">خلاصه درس</div>
                        {
                            summary.map(item => <ClassResourcesItems item={item} svg={<PdfSvg className="class-handout-item-svg"/>}/>)
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
                    question.length > 0 &&
                    <div className="class-a-resource-container" id="question">
                        <div className="class-a-resource-container-anchor" id="question"/>
                        <div className="class-a-resource-container-title">نمونه سوالات</div>
                        {
                            question.map(item => <ClassResourcesItems item={item} svg={<PdfSvg className="class-handout-item-svg"/>}/>)
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
                    voice.length > 0 &&
                    <div className="class-a-resource-container">
                        <div className="class-a-resource-container-anchor" id="voice"/>
                        <div className="class-a-resource-container-title">ویس آموزشی</div>
                        {
                            voice.map(item => <ClassResourcesItems item={item} svg={<VoiceSvg className="class-handout-item-svg"/>}/>)
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
                            video.map(item => <ClassResourcesItems item={item} svg={<VoiceSvg className="class-handout-item-svg"/>}/>)
                        }
                        <div className="class-handout-item-hide"/>
                        <div className="class-handout-item-hide"/>
                        <div className="class-handout-item-hide"/>
                        <div className="class-handout-item-hide"/>
                        <div className="class-handout-item-hide"/>
                        <div className="class-handout-item-hide"/>
                    </div>
                }
            </div>
        )
    }
}

export default ClassItemResourcePage