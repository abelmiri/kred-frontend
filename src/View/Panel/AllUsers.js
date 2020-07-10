import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import FilterSvg from "../../Media/Svgs/FilterSvg"
import TickSvg from "../../Media/Svgs/TickSvg"
import EmailSvg from "../../Media/Svgs/EmailSvg"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import ViewSvg from "../../Media/Svgs/ViewSvg"

class AllUsers extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            results: {},
            isLoading: true,
            showFilter: false,
            source: "all",
        }
        this.activeScrollHeight = 0
        this.page = 2

        this.offsetTop = null
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("view/all/sign-up", `?limit=20&page=1&source=all`)
            .then(results => this.setState({
                ...this.state,
                results: {
                    count: results.count,
                    users: results.users,
                    stats: results.stats.reduce((sum, item) => ({...sum, [item._id]: item.count}), {}),
                },
                isLoading: false,
            }))
            .catch((err) =>
            {
                console.log(err)
                this.setState({...this.state, error: true})
            })

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        const {results, source} = this.state
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (source !== "view" && results.users && results.users.length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, isLoading: true}, () =>
                {
                    const {source} = this.state
                    this.activeScrollHeight = scrollHeight
                    api.get("view/all/sign-up", `?limit=20&page=${this.page}&source=${source}`).then(results =>
                    {
                        this.page += 1
                        this.setState({
                            ...this.state,
                            results: {
                                ...this.state.results,
                                users: [...this.state.results.users, ...results.users],
                                stats: {...this.state.results.stats, ...results.stats.reduce((sum, item) => ({...sum, [item._id]: item.count}), {})},
                            }
                            , isLoading: false,
                        })
                    })
                })
            }
        }, 20)

        if (document.body.clientWidth > 480 && this.title && this.cont)
        {
            if (this.offsetTop === null) this.offsetTop = this.title.offsetTop

            if (window.scrollY + 81 >= this.offsetTop)
            {
                if (this.title.style.position !== "fixed")
                {
                    const width = this.title.clientWidth
                    this.title.style.width = width + "px"
                    this.title.style.position = "fixed"
                    this.cont.style.paddingTop = "45px"
                }
            }
            else
            {
                if (this.title.style.position !== "static")
                {
                    this.title.style.position = "static"
                    this.cont.style.paddingTop = "0"
                }
            }
        }

        if (this.state.showFilter) this.setState({...this.state, showFilter: false})
    }

    toggleFilter = () => this.setState({...this.state, showFilter: !this.state.showFilter})

    setSource(source)
    {
        this.setState({...this.state, error: false, results: {}, isLoading: true, showFilter: false, source}, () =>
        {
            this.activeScrollHeight = 0
            this.page = 2
            api.get("view/all/sign-up", `?limit=20&page=1&source=${source}`)
                .then(results =>
                {
                    if (source === "view")
                    {
                        this.setState({
                            ...this.state,
                            results: {
                                count: results.count,
                                users: results.users.reduce((sum, item) => ({...sum, [item._id]: item}), {}),
                                stats: results.stats,
                            },
                            isLoading: false,
                        })
                    }
                    else
                    {
                        this.setState({
                            ...this.state,
                            results: {
                                count: results.count,
                                users: results.users,
                                stats: results.stats.reduce((sum, item) => ({...sum, [item._id]: item.count}), {}),
                            },
                            isLoading: false,
                        })
                    }
                })
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, error: true})
                })
        })
    }

    resetFilter = () =>
    {
        this.setState({...this.state, error: false, results: {}, isLoading: true, showFilter: false, source: "all"}, () =>
        {
            this.activeScrollHeight = 0
            this.page = 2
            api.get("view/all/sign-up", `?limit=20&page=1&source=all`)
                .then(results => this.setState({
                    ...this.state,
                    results: {
                        count: results.count,
                        users: results.users,
                        stats: results.stats.reduce((sum, item) => ({...sum, [item._id]: item.count}), {}),
                    },
                    isLoading: false,
                }))
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, error: true})
                })
        })
    }

    render()
    {
        const {error, results, isLoading, showFilter, source} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            const {count, users, stats} = results
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">ثبت‌نام‌ها {source === "view" && stats ? `(${stats.length})` : count ? `(${count})` : ""}</div>
                    <div ref={e => this.cont = e} className="panel-0ff-code-scroll dont-gesture">
                        {
                            users &&
                            <React.Fragment>
                                <div ref={e => this.title = e} className={`panel-0ff-code-cont title ${source === "email" ? "" : "scroll-wider"}`}>
                                    {
                                        source === "email" ?
                                            <React.Fragment>
                                                <div className="panel-0ff-code-item">نام</div>
                                                <div className="panel-0ff-code-item-big">ایمیل</div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <div className="panel-0ff-code-item-big">نام</div>
                                                <div className="panel-0ff-code-item">شماره</div>
                                                <div className="panel-0ff-code-item-big">دانشگاه</div>
                                                <div className="panel-0ff-code-item">سال‌ورودی</div>
                                                <div className="panel-0ff-code-item">تاریخ‌تولد</div>
                                                <div className="panel-0ff-code-item">رشته</div>
                                                <div className="panel-0ff-code-item">مقطع</div>
                                                <div className="panel-0ff-code-item-small">بازدید</div>
                                                <div className="panel-0ff-code-item">ثبت‌نام</div>
                                            </React.Fragment>
                                    }
                                </div>
                                {
                                    source === "view" ?
                                        stats.map(state =>
                                            <div key={"today-sign-ups" + state._id} className="panel-0ff-code-cont scroll-wider">
                                                <div className="panel-0ff-code-item-big">{users[state._id].name}</div>
                                                <div className="panel-0ff-code-item">{users[state._id].phone}</div>
                                                <div className="panel-0ff-code-item-big">{users[state._id].university}</div>
                                                <div className="panel-0ff-code-item">{users[state._id].entrance}</div>
                                                <div className="panel-0ff-code-item">{users[state._id].birth_date}</div>
                                                <div className="panel-0ff-code-item">{users[state._id].major}</div>
                                                <div className="panel-0ff-code-item">{users[state._id].grade}</div>
                                                <div className="panel-0ff-code-item-small">{state.count}</div>
                                                <div className="panel-0ff-code-item">{new Date(users[state._id].created_date).toLocaleDateString("fa-ir")}</div>
                                            </div>,
                                        )
                                        :
                                        users.map(user =>
                                            <div key={"today-sign-ups" + user.phone} className={`panel-0ff-code-cont ${source === "email" ? "" : "scroll-wider"}`}>
                                                {
                                                    source === "email" ?
                                                        <React.Fragment>
                                                            <div className="panel-0ff-code-item">{user.name}</div>
                                                            <div className="panel-0ff-code-item-big">{user.email}</div>
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            <div className="panel-0ff-code-item-big">{user.name}</div>
                                                            <div className="panel-0ff-code-item">{user.phone}</div>
                                                            <div className="panel-0ff-code-item-big">{user.university}</div>
                                                            <div className="panel-0ff-code-item">{user.entrance}</div>
                                                            <div className="panel-0ff-code-item">{user.birth_date}</div>
                                                            <div className="panel-0ff-code-item">{user.major}</div>
                                                            <div className="panel-0ff-code-item">{user.grade}</div>
                                                            <div className="panel-0ff-code-item-small">{stats[user._id] || 0}</div>
                                                            <div className="panel-0ff-code-item">{new Date(user.created_date).toLocaleDateString("fa-ir")}</div>
                                                        </React.Fragment>
                                                }
                                            </div>,
                                        )
                                }
                            </React.Fragment>
                        }
                        <div className={`exchange-page-loading ${isLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                    </div>

                    <Material className={`filter-item third ${showFilter ? "" : "hide"}`} onClick={() => this.setSource("view")}>
                        <ViewSvg className="filter-item-btn"/>
                    </Material>

                    <Material className={`filter-item second ${showFilter ? "" : "hide"}`} onClick={() => this.setSource("email")}>
                        <EmailSvg className="filter-item-btn mail"/>
                    </Material>

                    <Material className={`filter-item first ${showFilter ? "" : "hide"}`} onClick={() => this.setSource("completed")}>
                        <TickSvg className="filter-item-btn"/>
                    </Material>

                    <Material className="panel-0ff-code-add filter" onClick={source === "all" ? this.toggleFilter : this.resetFilter}>
                        {
                            source === "all" ?
                                <FilterSvg className="filter-item-btn main"/>
                                :
                                <CancelSvg className="filter-item-btn cancel"/>
                        }
                    </Material>
                </section>
            )
        }
    }
}

export default AllUsers