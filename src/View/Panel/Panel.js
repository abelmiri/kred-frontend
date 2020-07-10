import React, {lazy, PureComponent, Suspense} from "react"
import {Route, Switch} from "react-router-dom"
import PanelSidebar from "./PanelSidebar"
import {Helmet} from "react-helmet"

const OffCodes = lazy(() => import("./OffCodes"))
const Dashboard = lazy(() => import("./Dashboard"))
const TodaySignUps = lazy(() => import("./TodaySignUps"))
const TodayPageViews = lazy(() => import("./TodayPageViews"))
const TodayVideoViews = lazy(() => import("./TodayVideoViews"))
const TodayBuys = lazy(() => import("./TodayBuys"))
const AllPageViews = lazy(() => import("./AllPageViews"))
const AllVideoViews = lazy(() => import("./AllVideoViews"))
const AllBuys = lazy(() => import("./AllBuys"))
const AllUsers = lazy(() => import("./AllUsers"))
const Pavilion = lazy(() => import("./Pavilion"))
const Class = lazy(() => import("./Class"))
const Quiz = lazy(() => import("./Quiz"))
const MindMaps = lazy(() => import("./MindMaps"))
const Diagrams = lazy(() => import("./Diagrams"))
const SendNotification = lazy(() => import("./SendNotification"))

class Panel extends PureComponent
{
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
                    <Suspense fallback={null}>
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
                            <Route path="/panel/diagrams" render={() => <Diagrams/>}/>
                            <Route path="/panel/send-notification" render={() => <SendNotification/>}/>
                            <Route path="*" render={() => <div className="panel-welcome">خوش اومدی ادمین :)</div>}/>
                        </Switch>
                    </Suspense>
                </div>
            </div>
        )
    }
}

export default Panel