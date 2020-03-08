import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"

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
    }

    componentDidMount()
    {
        api.get("view/all/sign-up", `?limit=20&page=1&time=${new Date().toISOString()}`)
            .then(results => this.setState({...this.state, results, isLoading: false}))
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
                    api.get("view/all/sign-up", `?limit=20&page=${this.page}&time=${new Date().toISOString()}`)
                        .then(results =>
                        {
                            this.setState({...this.state, results: {users: [...this.state.results.users, ...results.users], count: results.count}, isLoading: false})
                            this.activeScrollHeight = scrollHeight
                            this.page += 1
                        })
                })
            }
        }, 20)
    }

    render()
    {
        const {error, results, isLoading} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            const {count, users} = results
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">ثبت‌نام‌ها {count ? `(${count})` : ""}</div>
                    <div className="panel-0ff-code-scroll dont-gesture">
                        {
                            users &&
                            <React.Fragment>
                                <div className="panel-0ff-code-cont title scroll-wide">
                                    <div className="panel-0ff-code-item-big">نام</div>
                                    <div className="panel-0ff-code-item">شماره</div>
                                    <div className="panel-0ff-code-item">دانشگاه</div>
                                    <div className="panel-0ff-code-item">سال ورودی</div>
                                    <div className="panel-0ff-code-item">تاریخ تولد</div>
                                    <div className="panel-0ff-code-item">رشته</div>
                                    <div className="panel-0ff-code-item">مقطع</div>
                                </div>
                                {
                                    users.map(user =>
                                        <Material key={"today-sign-ups" + user.phone} className="panel-0ff-code-cont scroll-wide">
                                            <div className="panel-0ff-code-item-big">{user.name}</div>
                                            <div className="panel-0ff-code-item">{user.phone}</div>
                                            <div className="panel-0ff-code-item">{user.university}</div>
                                            <div className="panel-0ff-code-item">{user.entrance}</div>
                                            <div className="panel-0ff-code-item">{user.birth_date}</div>
                                            <div className="panel-0ff-code-item">{user.major}</div>
                                            <div className="panel-0ff-code-item">{user.grade}</div>
                                        </Material>,
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