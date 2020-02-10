import React, {PureComponent} from "react"
import Fluent from "./Fluent"
import api from "../Functions/api"
import {ClipLoader} from "react-spinners"

class StatisticsPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            results: [],
            error: false,
        }
        this.getData = true
    }

    componentDidMount()
    {
        const {user} = this.props
        if (user && user.role === "admin")
        {
            this.getData = false
            api.get("view", `?time=${new Date().toISOString()}`)
                .then(results => this.setState({...this.state, results}))
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, error: true})
                })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        const {user} = this.props
        if (!prevProps.user && user && user.role === "admin" && this.getData)
        {
            api.get("view", `?time=${new Date().toISOString()}`)
                .then(results => this.setState({...this.state, results}))
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, error: true})
                })
        }
    }

    render()
    {
        const {user} = this.props
        if (user && user.role === "admin")
        {
            const {results, error} = this.state
            let allPagesCount = 0
            let allPages = {}
            let allVideosCount = 0
            let allVideos = {}

            let todayVideosCount = 0
            let todayVideos = {}
            let todayPagesCount = 0
            let todayPages = {}

            results.forEach(item =>
            {
                if (item.type === "page")
                {
                    allPagesCount++
                    allPages[item.content] ? allPages[item.content].count++ : allPages[item.content] = {title: item.content, count: 1}
                    if (item.created_date.split("T")[0] === new Date().toISOString().split("T")[0])
                    {
                        todayPagesCount++
                        todayPages[item.content] ? todayPages[item.content].count++ : todayPages[item.content] = {title: item.content, count: 1}
                    }
                }
                else if (item.type === "video")
                {
                    allVideosCount++
                    allVideos[item.content] ? allVideos[item.content].count++ : allVideos[item.content] = {title: item.content, count: 1}
                    if (item.created_date.split("T")[0] === new Date().toISOString().split("T")[0])
                    {
                        todayVideosCount++
                        todayVideos[item.content] ? todayVideos[item.content].count++ : todayVideos[item.content] = {title: item.content, count: 1}
                    }
                }
            })
            return (
                <div className="statistics-page-container">
                    {
                        error ?
                            "خطایی پیش اومد ادمین جان!"
                            :
                            allPagesCount === 0 ?
                                <ClipLoader/>
                                :
                                <React.Fragment>
                                    <Fluent className="statistics-page-btn-fluent" fluentColor="#000000">
                                        <div className="statistics-page-btn">
                                            <div className="statistics-page-btn-title">بازدیدهای کل</div>
                                            <div className="statistics-page-view-item">
                                                <div>بازدیدهای صفحات</div>
                                                <div>{allPagesCount}</div>
                                                <div className="statistics-page-view-item-child">
                                                    {
                                                        Object.values(allPages).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                            <div key={"all-pages" + item.title} className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </div>,
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="statistics-page-view-item second">
                                                <div>بازدیدهای ویدیوها</div>
                                                <div>{allVideosCount}</div>
                                                <div className="statistics-page-view-item-child">
                                                    {
                                                        Object.values(allVideos).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                            <div key={"all-videos" + item.title} className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </div>,
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Fluent>

                                    <Fluent className="statistics-page-btn-fluent" fluentColor="#000000">
                                        <div className="statistics-page-btn">
                                            <div className="statistics-page-btn-title">بازدیدهای امروز</div>
                                            <div className="statistics-page-view-item">
                                                <div>بازدیدهای صفحات</div>
                                                <div>{todayPagesCount}</div>
                                                <div className="statistics-page-view-item-child">
                                                    {
                                                        Object.values(todayPages).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                            <div key={"today-pages" + item.title} className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </div>,
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="statistics-page-view-item second">
                                                <div>بازدیدهای ویدیوها</div>
                                                <div>{todayVideosCount}</div>
                                                <div className="statistics-page-view-item-child">
                                                    {
                                                        Object.values(todayVideos).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                            <div key={"today-videos" + item.title} className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </div>,
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Fluent>
                                </React.Fragment>
                    }
                </div>
            )
        }
        else return <div className="statistics-page-not-show">404 :(</div>
    }
}

export default StatisticsPage