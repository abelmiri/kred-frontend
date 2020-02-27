import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import OffCodes from "../Panel/OffCodes"
import StatisticsPage from "./StatisticsPage"
import PanelMain from "./PanelMain"

class Panel extends PureComponent
{
    render()
    {
        const {user} = this.props
        if (user && user.role === "admin")
        {
            return (
                <div className="statistics-page-container">
                    <Switch>
                        <Route path='/panel/statistics' render={() => <StatisticsPage user={user}/>}/>
                        <Route path='/panel/off-codes' render={() => <OffCodes user={user}/>}/>
                        <Route path='*' render={() => <PanelMain/>}/>
                    </Switch>
                </div>
            )
        }
        else return <div className="statistics-page-not-show">404 :(</div>
    }
}

export default Panel