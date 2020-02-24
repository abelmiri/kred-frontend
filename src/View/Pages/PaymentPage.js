import React, {PureComponent} from "react"
import TickSvg from "../../Media/Svgs/TickSvg"
import {Link} from "react-router-dom"
import Material from "../Components/Material"
import UnTickSvg from "../../Media/Svgs/UnTickSvg"

class PaymentPage extends PureComponent
{
    render()
    {
        const {type} = this.props
        return (
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
                            <Link to="/" className="payment-page-success-back" ><Material>برگشت به صفحه اصلی</Material></Link>
                        </div>
            </div>
        )
    }
}

export default PaymentPage