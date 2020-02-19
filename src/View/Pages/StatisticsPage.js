import React, {PureComponent} from "react"
import Fluent from "../Components/Fluent"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"

class StatisticsPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            results: {},
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
            const {allSignUpCount, allPagesCount, allPages, allVideosCount, allVideos, todaySignUpCount, todaySignUp, todayPagesCount, todayPages, todayVideosCount, todayVideos} = results
            return (
                <div className="statistics-page-container">
                    {
                        error ?
                            "خطایی پیش اومد ادمین جان!"
                            :
                            !allSignUpCount ?
                                <ClipLoader/>
                                :
                                <React.Fragment>
                                    <div className="statistics-page-btn">
                                        <div className="statistics-page-btn-title">آمار کل</div>
                                        <div className="statistics-page-view-item second">
                                            <div>ثبت نام کاربران</div>
                                            <div>{allSignUpCount}</div>
                                        </div>
                                        <div className="statistics-page-view-item">
                                            <div>بازدیدهای صفحات</div>
                                            <div>{allPagesCount}</div>
                                            <div className="statistics-page-view-item-child">
                                                {
                                                    Object.values(allPages).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                        <Fluent key={"all-pages" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent">
                                                            <Material className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </Material>
                                                        </Fluent>,
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
                                                        <Fluent key={"all-videos" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent second">
                                                            <Material className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </Material>
                                                        </Fluent>,
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="statistics-page-btn">
                                        <div className="statistics-page-btn-title">آمار 24 ساعت اخیر</div>
                                        <div className="statistics-page-view-item second">
                                            <div>ثبت نام کاربران</div>
                                            <div>{todaySignUpCount}</div>
                                            <div className="statistics-page-view-item-child">
                                                {
                                                    Object.values(todaySignUp).map(user =>
                                                        <Fluent key={"user" + user._id} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent second">
                                                            <Material className="statistics-page-view-item-child-item">
                                                                <div>{user.name || user.phone}</div>
                                                            </Material>
                                                        </Fluent>,
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="statistics-page-view-item">
                                            <div>بازدیدهای صفحات</div>
                                            <div>{todayPagesCount}</div>
                                            <div className="statistics-page-view-item-child">
                                                {
                                                    Object.values(todayPages).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                        <Fluent key={"today-pages" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent">
                                                            <Material className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </Material>
                                                        </Fluent>,
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
                                                        <Fluent key={"today-videos" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent second">
                                                            <Material className="statistics-page-view-item-child-item">
                                                                <div>{item.title}</div>
                                                                <div>{item.count}</div>
                                                            </Material>
                                                        </Fluent>,
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                    }
                </div>
            )
        }
        else return <div className="statistics-page-not-show">404 :(</div>
    }
}

export default StatisticsPage