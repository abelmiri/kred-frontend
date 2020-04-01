import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {Link} from "react-router-dom"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import VoiceSvg from "../../Media/Svgs/VoiceSvg"
import {ClipLoader} from "react-spinners"

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
                question: res.filter((p) => p.type === "question"),
                voice: res.filter((p) => p.type === "voice"),
                video: res.filter((p) => p.type === "video"),
            }))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    render()
    {
        const {loading, resLoading, error, parent, item, resources, handout, question, voice} = this.state
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
                        {
                            handout.map(item =>
                                <div key={item._id} className="class-handout-item">
                                    <PdfSvg className="class-handout-item-svg"/>
                                    <div className="class-handout-item-title">
                                        {item.title}
                                    </div>
                                    <div className="class-handout-item-description">
                                        {item.university} - {item.teacher}
                                    </div>
                                    <div className="class-handout-item-description">
                                        {item.pages_count} صفحه
                                    </div>
                                </div>,
                            )
                        }
                    </div>
                }
                {
                    question.length > 0 &&
                    <div className="class-a-resource-container">
                        {
                            question.map(item =>
                                <div key={item._id} className="class-handout-item">
                                    <PdfSvg className="class-handout-item-svg"/>
                                    <div className="class-handout-item-title">
                                        {item.title}
                                    </div>
                                    <div className="class-handout-item-description">
                                        {item.university} - {item.teacher}
                                    </div>
                                    <div className="class-handout-item-description">
                                        {item.pages_count} صفحه
                                    </div>
                                </div>,
                            )
                        }
                    </div>
                }
                {
                    voice.length > 0 &&
                    <div className="class-a-resource-container">
                        {
                            voice.map(item =>
                                <div key={item._id} className="class-handout-item">
                                    <VoiceSvg className="class-handout-item-svg"/>
                                    <div className="class-handout-item-title">
                                        {item.title}
                                    </div>
                                    <div className="class-handout-item-description">
                                        {item.university} - {item.teacher}
                                    </div>
                                    <div className="class-handout-item-description">
                                        {item.pages_count} صفحه
                                    </div>
                                </div>,
                            )
                        }
                    </div>
                }
            </div>
        )
    }
}

export default ClassItemResourcePage