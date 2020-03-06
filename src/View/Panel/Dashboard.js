import React, {PureComponent} from "react"
import TodayPageViews from "./TodayPageViews"
import TodaySignUps from "./TodaySignUps"
import TodayVideoViews from "./TodayVideoViews"
import TodayBuys from "./TodayBuys"

class Dashboard extends PureComponent
{
    render()
    {
        return (
            <React.Fragment>
                <div className="panel-dashboard-item right">
                    <TodayPageViews/>
                </div>
                <div className="panel-dashboard-item left">
                    <TodaySignUps/>
                </div>
                <div className="panel-dashboard-item right">
                    <TodayVideoViews/>
                </div>
                <div className="panel-dashboard-item left">
                    <TodayBuys/>
                </div>
            </React.Fragment>
        )
    }
}

export default Dashboard