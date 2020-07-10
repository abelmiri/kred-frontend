import React, {PureComponent} from "react"
import {Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import {NotificationManager} from "react-notifications"

class Diagrams extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        NotificationManager.warning("ادمین جان، محاسبه این نمودار برای سرور زمان بره! صبور باش!")
        api.get("view/view-diagram")
            .then(data => this.setState({...this.state, data}))
    }

    render()
    {
        const {data} = this.state
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">نمودار بازدید (صفحات و ویدیوها) در 30 روز اخیر</div>
                <div className="direction-ltr panel-diagram">
                    {
                        data ?
                            <ResponsiveContainer width="100%" height={500}>
                                <ComposedChart data={data}>
                                    <CartesianGrid stroke="#f5f5f5"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="بازدید" barSize={20} fill="#413ea0"/>
                                </ComposedChart>
                            </ResponsiveContainer>
                            :
                            <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                    }
                </div>
            </section>
        )
    }
}

export default Diagrams