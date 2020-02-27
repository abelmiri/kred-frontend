import React, {PureComponent} from "react"
import Material from "../Components/Material"
import {Link} from "react-router-dom"

class PanelMain extends PureComponent
{
    render()
    {
        return (
            <div className="panel-0ff-main">
                <Link to="/panel/statistics" className="panel-0ff-main-item">
                    <Material>آمارها</Material>
                </Link>
                <Link to="/panel/off-codes" className="panel-0ff-main-item">
                    <Material>کد تخفیف</Material>
                </Link>
            </div>
        )
    }
}

export default PanelMain