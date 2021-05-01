import React, {PureComponent} from "react"
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

class UserDiagram extends PureComponent
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

        api.get("view/users-diagram/30")
            .then(data => this.setState({...this.state, data}))
    }

    render()
    {
        const {data} = this.state
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">نمودار ثبت نام کاربران</div>
                <div className="direction-ltr panel-diagram">
                    {
                        data ?
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="ثبت نام" stroke="var(--primary-color)"/>
                                </LineChart>
                            </ResponsiveContainer>
                            :
                            <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                    }
                </div>
            </section>
        )
    }
}

export default UserDiagram