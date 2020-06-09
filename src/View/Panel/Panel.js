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
import {Helmet} from "react-helmet"
import Quiz from "./Quiz"
import MindMaps from "./MindMaps"

class Panel extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        return (
            <div className="panel-page-container">
                <Helmet>
                    <title>پنل ادمین | KRED</title>
                    <meta property="og:title" content="پنل ادمین | KRED"/>
                    <meta name="twitter:title" content="پنل ادمین | KRED"/>
                    <meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                </Helmet>
                <PanelSidebar/>
                <div className="panel-page-content">
                    <Switch>
                        <Route path="/panel/dashboard" render={() => <Dashboard/>}/>
                        <Route path="/panel/off-codes" render={() => <OffCodes/>}/>
                        <Route path="/panel/all-page-views" render={() => <AllPageViews/>}/>
                        <Route path="/panel/all-video-views" render={() => <AllVideoViews/>}/>
                        <Route path="/panel/all-sales" render={() => <AllBuys/>}/>
                        <Route path="/panel/all-sign-ups" render={() => <AllUsers/>}/>
                        <Route path="/panel/page-views" render={() => <TodayPageViews/>}/>
                        <Route path="/panel/video-views" render={() => <TodayVideoViews/>}/>
                        <Route path="/panel/sales" render={() => <TodayBuys/>}/>
                        <Route path="/panel/sign-ups" render={() => <TodaySignUps/>}/>
                        <Route path="/panel/pavilion" render={() => <Pavilion/>}/>
                        <Route path="/panel/class" render={() => <Class/>}/>
                        <Route path="/panel/quiz" render={() => <Quiz/>}/>
                        <Route path="/panel/mind-maps" render={() => <MindMaps/>}/>
                        <Route path="*" render={() => <div className="panel-welcome">خوش اومدی ادمین :)</div>}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Panel