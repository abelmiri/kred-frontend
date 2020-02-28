import React, {PureComponent} from "react"
import Fluent from "../Components/Fluent"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import addCommaPrice from "../../Helpers/addCommaPrice"

class StatisticsPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            results: {},
            error: false,
            showPackUsers: false,
            packUsers: [],
        }
    }

    componentDidMount()
    {
        api.get("view", `?time=${new Date().toISOString()}`)
            .then(results => this.setState({...this.state, results}))
            .catch((err) =>
            {
                console.log(err)
                this.setState({...this.state, error: true})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        window.onpopstate = () =>
        {
            if (document.body.clientWidth <= 480)
            {
                if (this.state.showPackUsers)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, showPackUsers: false})
                }
            }
        }
    }

    togglePackUsersModal = () =>
    {
        const showPackUsers = !this.state.showPackUsers
        if (showPackUsers)
        {
            if (document.body.clientWidth <= 480) window.history.pushState("", "", "/panel/statistics/users")
            document.body.style.overflow = "hidden"
            api.get("view/pack-users", `?time=${new Date().toISOString()}`)
                .then(packUsers => this.setState({...this.state, packUsers}))
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, error: true})
                })
        }
        else
        {
            if (document.body.clientWidth <= 480) window.history.back()
            document.body.style.overflow = "auto"
        }
        this.setState({...this.state, showPackUsers})
    }

    render()
    {
        const {results, error, showPackUsers, packUsers} = this.state
        const {
            allSignUpCount, allPagesCount, allPages, allVideosCount, allVideos, allBuyCount,
            todaySignUpCount, todaySignUp, todayPagesCount, todayPages, todayVideosCount, todayVideos, todayBuyCount,
        } = results
        return (
            <React.Fragment>
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
                                    <Material className="statistics-page-view-item" onClick={this.togglePackUsersModal}>
                                        <div>فروش پک</div>
                                        <div>{allBuyCount}</div>
                                    </Material>
                                    <div className="statistics-page-view-item second">
                                        <div>بازدیدهای صفحات</div>
                                        <div>{allPagesCount}</div>
                                        <div className="statistics-page-view-item-child">
                                            {
                                                Object.values(allPages).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                    <Fluent key={"all-pages" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent second">
                                                        <Material className="statistics-page-view-item-child-item">
                                                            <div>{item.title}</div>
                                                            <div>{item.count}</div>
                                                        </Material>
                                                    </Fluent>,
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="statistics-page-view-item">
                                        <div>بازدیدهای ویدیوها</div>
                                        <div>{allVideosCount}</div>
                                        <div className="statistics-page-view-item-child">
                                            {
                                                Object.values(allVideos).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                    <Fluent key={"all-videos" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent">
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
                                                Object.values(todaySignUp).reverse().map(user =>
                                                    <Fluent key={"user" + user._id} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent second">
                                                        <Material className="statistics-page-view-item-child-item">
                                                            <div>{user.name || user.phone}</div>
                                                        </Material>
                                                    </Fluent>,
                                                )
                                            }
                                        </div>
                                    </div>
                                    <Material className="statistics-page-view-item" onClick={this.togglePackUsersModal}>
                                        <div>فروش پک</div>
                                        <div>{todayBuyCount}</div>
                                    </Material>
                                    <div className="statistics-page-view-item second">
                                        <div>بازدیدهای صفحات</div>
                                        <div>{todayPagesCount}</div>
                                        <div className="statistics-page-view-item-child">
                                            {
                                                Object.values(todayPages).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                    <Fluent key={"today-pages" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent second">
                                                        <Material className="statistics-page-view-item-child-item">
                                                            <div>{item.title}</div>
                                                            <div>{item.count}</div>
                                                        </Material>
                                                    </Fluent>,
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="statistics-page-view-item">
                                        <div>بازدیدهای ویدیوها</div>
                                        <div>{todayVideosCount}</div>
                                        <div className="statistics-page-view-item-child">
                                            {
                                                Object.values(todayVideos).sort((a, b) => (b.count > a.count) ? 1 : (b.count < a.count) ? -1 : 0).map(item =>
                                                    <Fluent key={"today-videos" + item.title} fluentColor="#F5F8F8" className="statistics-page-view-item-child-item-fluent">
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

                                {
                                    showPackUsers &&
                                    <React.Fragment>
                                        <div className="create-exchange-cont create-small">
                                            <div className='create-exchange-title'>خریداران پک</div>
                                            <div className="panel-add-off-main">
                                                <div className="panel-0ff-code-scroll dont-gesture">
                                                    <div className="panel-0ff-code-cont title">
                                                        <div className="panel-0ff-code-item-small">ردیف</div>
                                                        <div className="panel-0ff-code-item">نام</div>
                                                        <div className="panel-0ff-code-item">شماره</div>
                                                        <div className="panel-0ff-code-item">مبلغ</div>
                                                        <div className="panel-0ff-code-item">تاریخ</div>
                                                    </div>
                                                    {
                                                        Object.values(packUsers).reverse().map((pack, index) =>
                                                            <div key={pack._id} className="panel-0ff-code-cont">
                                                                <div className="panel-0ff-code-item-small">{Object.values(packUsers).length - index}</div>
                                                                <div className="panel-0ff-code-item">{pack.user.name || pack.user.phone}</div>
                                                                <div className="panel-0ff-code-item">{pack.user.phone}</div>
                                                                <div className="panel-0ff-code-item">{pack.price ? addCommaPrice(pack.price) : "-"}</div>
                                                                <div className="panel-0ff-code-item">{new Date(pack.created_date).toLocaleDateString("fa-ir")}</div>
                                                            </div>,
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="create-exchange-back" onClick={this.togglePackUsersModal}/>
                                    </React.Fragment>
                                }
                            </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default StatisticsPage