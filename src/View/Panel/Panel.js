import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import OffCodes from "../Panel/OffCodes"
import Dashboard from "./Dashboard.js"
import TodaySignUps from "./TodaySignUps"
import TodayPageViews from "./TodayPageViews"
import TodayVideoViews from "./TodayVideoViews"
import TodayBuys from "./TodayBuys"
import AllPageViews from "./AllPageViews"
import AllVideoViews from "./AllVideoViews"
import AllBuys from "./AllBuys"
import AllUsers from "./AllUsers"
import PanelSidebar from "./PanelSidebar"
import Pavilion from "./Pavilion"
import Class from "./Class"

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
                    <PanelSidebar/>
                    <div className="panel-page-content">
                        <Switch>
                            <Route path='/panel/dashboard' render={() => <Dashboard/>}/>
                            <Route path='/panel/off-codes' render={() => <OffCodes/>}/>
                            <Route path='/panel/all-page-views' render={() => <AllPageViews/>}/>
                            <Route path='/panel/all-video-views' render={() => <AllVideoViews/>}/>
                            <Route path='/panel/all-sales' render={() => <AllBuys/>}/>
                            <Route path='/panel/all-sign-ups' render={() => <AllUsers/>}/>
                            <Route path='/panel/page-views' render={() => <TodayPageViews/>}/>
                            <Route path='/panel/video-views' render={() => <TodayVideoViews/>}/>
                            <Route path='/panel/sales' render={() => <TodayBuys/>}/>
                            <Route path='/panel/sign-ups' render={() => <TodaySignUps/>}/>
                            <Route path='/panel/pavilion' render={() => <Pavilion/>}/>
                            <Route path='/panel/class' render={() => <Class/>}/>
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