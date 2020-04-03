import React, {Component} from "react"
import api from "../../Functions/api"
import {Link} from "react-router-dom"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import {ClipLoader} from "react-spinners"

class ClassItemResourceFilePage extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            fileLoading: true,
            loading: true,
            error: false,
            parent: {},
            item: {},
            file: {},
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {type, id, parentId, fileId} = this.props
        if (parentId)
        {
            api.get(`${type}/category`, `${id}`)
                .then((item) => this.setState({...this.state, loading: false, item: item}))
                .catch(() => this.setState({...this.state, error: true, loading: false}))
            api.get(`${type}`, `${parentId}`)
                .then((item) => this.setState({...this.state, loading: false, parent: item}))
                .catch(() => this.setState({...this.state, error: true, loading: false}))
        }
        else
        {
            api.get(`${type}`, `${id}`)
                .then((item) => this.setState({...this.state, loading: false, item: item}))
                .catch(() => this.setState({...this.state, error: true, loading: false}))
        }
        api.get(`education-resource`, fileId)
            .then((item) => this.setState({...this.state, fileLoading: false, file: item}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    render()
    {
        const {loading, fileLoading, error, parent, item, file} = this.state
        const {type} = this.props
        console.log(file)
        return (
            <div className="class-resources-page-container">
                {
                    !loading && !fileLoading &&
                    <div className="class-location-container">
                        <Link to="/class" className="class-location-link">کلاس درس</Link>
                        <SmoothArrowSvg className="class-left-arrow"/>
                        {
                            parent.title ?
                                <React.Fragment>
                                    <Link to={`/class/${type}/${parent._id}`} className="class-location-link">{parent.title}</Link>
                                    <SmoothArrowSvg className="class-left-arrow"/>
                                    <Link to={`/class/${type}/${parent._id}/${item._id}/resources`} className="class-location-link">{item.title}</Link>
                                    <SmoothArrowSvg className="class-left-arrow"/>
                                    {file.title}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Link to={`/class/${type}/${item._id}`} className="class-location-link">{item.title}</Link>
                                    <SmoothArrowSvg className="class-left-arrow"/>
                                    <Link to={`/class/${type}/${item._id}/resources`} className="class-location-link">منابع درسی</Link>
                                    <SmoothArrowSvg className="class-left-arrow"/>
                                    {file.title}
                                </React.Fragment>
                        }
                    </div>
                }
                <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                <div className={`exchange-page-loading ${fileLoading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                <div className={`exchange-page-loading error-text ${!fileLoading && !file._id ? "" : "none"}`}>متأسفانه محتوایی برای نمایش پیدا نشد</div>
            </div>
        )
    }
}

export default ClassItemResourceFilePage