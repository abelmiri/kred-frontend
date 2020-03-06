import React, {PureComponent} from "react"
import {NavLink, Route, Switch} from "react-router-dom"
import OffCodes from "../Panel/OffCodes"
import Material from "../Components/Material"
import Dashboard from "./Dashboard.js"
import TodaySignUps from "./TodaySignUps"
import TodayPageViews from "./TodayPageViews"
import TodayVideoViews from "./TodayVideoViews"
import TodayBuys from "./TodayBuys"

class Panel extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        const {user} = this.props
        if (user && user.role === "admin")
        {
            return (
                <div className="panel-page-container">
                    <div className="panel-side-bar">
                        <NavLink className="panel-side-bar-item-link" activeClassName="selected" to="/panel/dashboard"><Material backgroundColor="rgba(0,0,0,0.5)" className="panel-side-bar-item">داشبورد</Material></NavLink>
                        <NavLink className="panel-side-bar-item-link" activeClassName="selected" to="/panel/off-codes"><Material backgroundColor="rgba(0,0,0,0.5)" className="panel-side-bar-item">کد تخفیف</Material></NavLink>
                    </div>
                    <div className="panel-page-content">
                        <Switch>
                            <Route path='/panel/dashboard' render={() => <Dashboard/>}/>
                            <Route path='/panel/off-codes' render={() => <OffCodes/>}/>
                            <Route path='/panel/sign-ups' render={() => <TodaySignUps/>}/>
                            <Route path='/panel/page-views' render={() => <TodayPageViews/>}/>
                            <Route path='/panel/video-views' render={() => <TodayVideoViews/>}/>
                            <Route path='/panel/buys' render={() => <TodayBuys/>}/>
                            <Route path='*' render={() => <div className="panel-welcome">خوش اومدی ادمین :)</div>}/>
                        </Switch>
                    </div>
                </div>
            )
        }
        else return <div className="statistics-page-not-show">404 :(</div>
    }
}

export default Panel