import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

class AllVideoViews extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            results: {},
        }
    }

    componentDidMount()
    {
        api.get("view/all/video", `?time=${new Date().toISOString()}`)
            .then(results => this.setState({...this.state, results}))
            .catch((err) =>
            {
                console.log(err)
                this.setState({...this.state, error: true})
            })
    }

    render()
    {
        const {error, results} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            const {todayVideosCount, todayVideos} = results
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">بازدید ویدیوها {todayVideosCount && `(${todayVideosCount})`}</div>
                    <div className="panel-0ff-code-scroll">
                        {
                            todayVideos ?
                                Object.values(todayVideos).length > 0 ?
                                    <React.Fragment>
                                        <div className="panel-0ff-code-cont title">
                                            <div className="panel-0ff-code-item-big">ویدیو</div>
                                            <div className="panel-0ff-code-item-small">بازدید</div>
                                        </div>
                                        {
                                            Object.values(todayVideos).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                <div key={"today-videos" + item.title} className="panel-0ff-code-cont">
                                                    <div className="panel-0ff-code-item-big">{item.title}</div>
                                                    <div className="panel-0ff-code-item-small">{item.count}</div>
                                                </div>,
                                            )
                                        }
                                    </React.Fragment>
                                    :
                                    <div className="exchange-page-loading not-found">موردی یافت نشد!</div>
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                    </div>
                </section>
            )
        }
    }
}

export default AllVideoViews