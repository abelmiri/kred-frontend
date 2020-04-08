import React, {PureComponent} from "react"
import TickSvg from "../../Media/Svgs/TickSvg"
import {Link} from "react-router-dom"
import Material from "../Components/Material"
import UnTickSvg from "../../Media/Svgs/UnTickSvg"
import Footer from "../Components/Footer"
import Helmet from "react-helmet"

class PaymentPage extends PureComponent
{
    render()
    {
        const {type} = this.props
        return (
            <React.Fragment>
                <Helmet>
                    <title>پرداخت | KRED</title>
                    <meta property="og:title" content="پرداخت | KRED"/>
                    <meta name="twitter:title" content="پرداخت | KRED"/>
                    <meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                    <meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/>
                </Helmet>
                <div className="payment-page-cont">
                    <div>
                        {
                            type === "success" ?
                                <React.Fragment>
                                    <TickSvg className="payment-page-success-svg"/>
                                    <div>پرداخت موقفیت آمیز بود!</div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <UnTickSvg className="payment-page-fail-svg"/>
                                    <div>پرداخت ناموفق بود.</div>
                                </React.Fragment>
                        }
                        <Link to="/" className="payment-page-success-back"><Material>برگشت به صفحه اصلی</Material></Link>
                    </div>
                </div>
                <Footer/>
            </React.Fragment>
        )
    }
}

export default PaymentPage