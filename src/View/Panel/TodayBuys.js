import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import addCommaPrice from "../../Helpers/addCommaPrice"

class TodayBuys extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            packUsers: [],
            isLoading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("view/today/pack-users")
            .then(packUsers => this.setState({...this.state, packUsers, isLoading: false}))
            .catch((err) =>
            {
                console.log(err)
                this.setState({...this.state, error: true})
            })
    }

    render()
    {
        const {error, packUsers, isLoading} = this.state
        const {smallView} = this.props
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">فروش پک - 24 ساعت اخیر {packUsers.length > 0 && `(${packUsers.length})`}</div>
                    <div className="panel-0ff-code-scroll dont-gesture">
                        {
                            packUsers.length > 0 ?
                                <React.Fragment>
                                    <div className={`panel-0ff-code-cont ${smallView ? "scroll" : "scroll-wide"} title`}>
                                        <div className="panel-0ff-code-item-big">نام</div>
                                        <div className="panel-0ff-code-item-big">پک</div>
                                        {
                                            !smallView &&
                                            <React.Fragment>
                                                <div className="panel-0ff-code-item">شماره</div>
                                                <div className="panel-0ff-code-item-big">دانشگاه</div>
                                            </React.Fragment>
                                        }
                                        <div className="panel-0ff-code-item-small">مبلغ</div>
                                        <div className="panel-0ff-code-item">تاریخ</div>
                                    </div>
                                    {
                                        packUsers.reverse().map((pack) =>
                                            <div key={pack._id} className={`panel-0ff-code-cont ${smallView ? "scroll" : "scroll-wide"}`}>
                                                <div className="panel-0ff-code-item-big">{pack.user.name || pack.user.phone}</div>
                                                <div className="panel-0ff-code-item-big">{pack.video_pack.title}</div>
                                                {
                                                    !smallView &&
                                                    <React.Fragment>
                                                        <div className="panel-0ff-code-item">{pack.user.phone}</div>
                                                        <div className="panel-0ff-code-item-big">{pack.user.university}</div>
                                                    </React.Fragment>
                                                }
                                                <div className="panel-0ff-code-item-small">{pack.price ? addCommaPrice(pack.price) : "-"}</div>
                                                <div className="panel-0ff-code-item">{new Date(pack.created_date).toLocaleDateString("fa-ir")}</div>
                                            </div>,
                                        )
                                    }
                                </React.Fragment>
                                :
                                isLoading ?
                                    <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                    :
                                    <div className="exchange-page-loading not-found">موردی یافت نشد!</div>
                        }
                    </div>
                </section>
            )
        }
    }
}

export default TodayBuys