import React, {PureComponent} from "react"
import TodayPageViews from "./TodayPageViews"
import TodaySignUps from "./TodaySignUps"
import TodayVideoViews from "./TodayVideoViews"
import TodayBuys from "./TodayBuys"
import {Link} from "react-router-dom"

class Dashboard extends PureComponent
{
    render()
    {
        return (
            <React.Fragment>
                <Link to="/panel/page-views" className="panel-dashboard-item right">
                    <TodayPageViews/>
                </Link>
                <Link to="/panel/sign-ups" className="panel-dashboard-item left">
                    <TodaySignUps smallView={true}/>
                </Link>
                <Link to="/panel/video-views" className="panel-dashboard-item right">
                    <TodayVideoViews/>
                </Link>
                <Link to="/panel/buys" className="panel-dashboard-item left">
                    <TodayBuys/>
                </Link>
            </React.Fragment>
        )
    }
}

export default Dashboard