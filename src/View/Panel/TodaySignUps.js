import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"

class TodaySignUps extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            results: {},
            showUser: false,
            user: {},
        }
    }

    componentDidMount()
    {
        api.get("view/today/sign-up", `?time=${new Date().toISOString()}`)
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
                if (this.state.showUser)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, showUser: false, user: {}})
                }
            }
        }
    }

    toggleUserModal(user)
    {
        const showUser = !this.state.showUser
        if (showUser)
        {
            if (document.body.clientWidth <= 480) window.history.pushState("", "", "/panel/dashboard/user")
            document.body.style.overflow = "hidden"
            this.setState({...this.state, showUser, user})
        }
        else
        {
            if (document.body.clientWidth <= 480) window.history.back()
            document.body.style.overflow = "auto"
            this.setState({...this.state, showUser, user: {}})
        }
    }

    render()
    {
        const {error, showUser, user, results} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            const {todaySignUpCount, todaySignUp} = results
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">ثبت‌نام‌ها - 24 ساعت اخیر {todaySignUpCount ? `(${todaySignUpCount})` : ""}</div>
                    <div className="panel-0ff-code-scroll dont-gesture">
                        {
                            todaySignUp ?
                                Object.values(todaySignUp).length > 0 ?
                                    <React.Fragment>
                                        <div className="panel-0ff-code-cont title">
                                            <div className="panel-0ff-code-item">نام</div>
                                            <div className="panel-0ff-code-item">شماره</div>
                                        </div>
                                        {
                                            Object.values(todaySignUp).map(item =>
                                                <Material key={"today-sign-ups" + item.phone} className="panel-0ff-code-cont" onClick={() => this.toggleUserModal(item)}>
                                                    <div className="panel-0ff-code-item">{item.name}</div>
                                                    <div className="panel-0ff-code-item">{item.phone}</div>
                                                </Material>,
                                            )
                                        }
                                    </React.Fragment>
                                    :
                                    <div className="exchange-page-loading not-found">موردی یافت نشد!</div>
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                    </div>

                    {
                        showUser &&
                        <React.Fragment>
                            <div className="create-exchange-cont create-small bigger-size">
                                <div className='create-exchange-title'>کاربر</div>
                                <div className="panel-add-off-main">
                                    <div className="panel-0ff-code-scroll dont-gesture">
                                        <div className="panel-0ff-code-cont scroll-wide title">
                                            <div className="panel-0ff-code-item-big">نام</div>
                                            <div className="panel-0ff-code-item">شماره</div>
                                            <div className="panel-0ff-code-item">دانشگاه</div>
                                            <div className="panel-0ff-code-item">سال ورودی</div>
                                            <div className="panel-0ff-code-item">تاریخ تولد</div>
                                            <div className="panel-0ff-code-item">رشته</div>
                                            <div className="panel-0ff-code-item">مقطع</div>
                                        </div>
                                        <div className="panel-0ff-code-cont scroll-wide">
                                            <div className="panel-0ff-code-item-big">{user.name}</div>
                                            <div className="panel-0ff-code-item">{user.phone}</div>
                                            <div className="panel-0ff-code-item">{user.university}</div>
                                            <div className="panel-0ff-code-item">{user.entrance}</div>
                                            <div className="panel-0ff-code-item">{user.birth_date}</div>
                                            <div className="panel-0ff-code-item">{user.major}</div>
                                            <div className="panel-0ff-code-item">{user.grade}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="create-exchange-back" onClick={() => this.toggleUserModal()}/>
                        </React.Fragment>
                    }

                </section>
            )
        }
    }
}

export default TodaySignUps