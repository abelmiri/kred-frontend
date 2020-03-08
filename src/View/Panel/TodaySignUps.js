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

    render()
    {
        const {smallView} = this.props
        const {error, results} = this.state
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
                                todaySignUp.length > 0 ?
                                    <React.Fragment>
                                        <div className={`panel-0ff-code-cont title ${!smallView ? "scroll-wide" : ""}`}>
                                            <div className={!smallView ? "panel-0ff-code-item-big" : "panel-0ff-code-item"}>نام</div>
                                            <div className="panel-0ff-code-item">شماره</div>
                                            {
                                                !smallView &&
                                                <React.Fragment>
                                                    <div className="panel-0ff-code-item">دانشگاه</div>
                                                    <div className="panel-0ff-code-item">سال ورودی</div>
                                                    <div className="panel-0ff-code-item">تاریخ تولد</div>
                                                    <div className="panel-0ff-code-item">رشته</div>
                                                    <div className="panel-0ff-code-item">مقطع</div>
                                                </React.Fragment>
                                            }
                                        </div>
                                        {
                                            todaySignUp.map(user =>
                                                <Material key={"today-sign-ups" + user.phone} className={`panel-0ff-code-cont ${!smallView ? "scroll-wide" : ""}`}>
                                                    <div className={!smallView ? "panel-0ff-code-item-big" : "panel-0ff-code-item"}>{user.name}</div>
                                                    <div className="panel-0ff-code-item">{user.phone}</div>
                                                    {
                                                        !smallView &&
                                                        <React.Fragment>
                                                            <div className="panel-0ff-code-item">{user.university}</div>
                                                            <div className="panel-0ff-code-item">{user.entrance}</div>
                                                            <div className="panel-0ff-code-item">{user.birth_date}</div>
                                                            <div className="panel-0ff-code-item">{user.major}</div>
                                                            <div className="panel-0ff-code-item">{user.grade}</div>
                                                        </React.Fragment>
                                                    }
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
                </section>
            )
        }
    }
}

export default TodaySignUps