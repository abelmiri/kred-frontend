import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {Link} from "react-router-dom"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"

class ClassItemResourcePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            error: false,
            parent: {},
            item: {},
            resources: [],
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
            .then((res) => this.setState({...this.state, loading: false, resources: res}))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    render()
    {
        const {loading, parent, item} = this.state
        const {type} = this.props
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
            </div>
        )
    }
}

export default ClassItemResourcePage