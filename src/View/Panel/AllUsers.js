import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

class AllUsers extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            results: {},
            isLoading: true,
        }
        this.activeScrollHeight = 0
        this.page = 2

        this.offsetTop = null
    }

    componentDidMount()
    {
        api.get("view/all/sign-up", `?limit=20&page=1`)
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
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, isLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("view/all/sign-up", `?limit=20&page=${this.page}`).then(results =>
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

        if (document.body.clientWidth > 480)
        {
            if (this?.offsetTop === null) this.offsetTop = this.title.offsetTop

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
    }

    render()
    {
        const {error, results, isLoading} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            const {count, users, stats} = results
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">ثبت‌نام‌ها {count ? `(${count})` : ""}</div>
                    <div ref={e => this.cont = e} className="panel-0ff-code-scroll dont-gesture">
                        {
                            users &&
                            <React.Fragment>
                                <div ref={e => this.title = e} className="panel-0ff-code-cont title scroll-wider">
                                    <div className="panel-0ff-code-item-big">نام</div>
                                    <div className="panel-0ff-code-item">شماره</div>
                                    <div className="panel-0ff-code-item-big">دانشگاه</div>
                                    <div className="panel-0ff-code-item">سال‌ورودی</div>
                                    <div className="panel-0ff-code-item">تاریخ‌تولد</div>
                                    <div className="panel-0ff-code-item">رشته</div>
                                    <div className="panel-0ff-code-item">مقطع</div>
                                    <div className="panel-0ff-code-item-small">بازدید</div>
                                    <div className="panel-0ff-code-item">ثبت‌نام</div>
                                </div>
                                {
                                    users.map(user =>
                                        <div key={"today-sign-ups" + user.phone} className="panel-0ff-code-cont scroll-wider">
                                            <div className="panel-0ff-code-item-big">{user.name}</div>
                                            <div className="panel-0ff-code-item">{user.phone}</div>
                                            <div className="panel-0ff-code-item-big">{user.university}</div>
                                            <div className="panel-0ff-code-item">{user.entrance}</div>
                                            <div className="panel-0ff-code-item">{user.birth_date}</div>
                                            <div className="panel-0ff-code-item">{user.major}</div>
                                            <div className="panel-0ff-code-item">{user.grade}</div>
                                            <div className="panel-0ff-code-item-small">{stats[user._id] || 0}</div>
                                            <div className="panel-0ff-code-item">{new Date(user.created_date).toLocaleDateString("fa-ir")}</div>
                                        </div>,
                                    )
                                }
                            </React.Fragment>
                        }
                        <div className={`exchange-page-loading ${isLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                    </div>

                </section>
            )
        }
    }
}

export default AllUsers