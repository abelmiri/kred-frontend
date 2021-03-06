import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"

class AddQuiz extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    setTitle = e => this.title = e.target.value
    setMinutes = e => this.minutes = e.target.value
    setCount = e => this.count = e.target.value

    submit = () =>
    {
        const title = this.title?.trim()
        const minutes = this.minutes?.trim()
        const count = this.count?.trim()
        if (title && parseInt(minutes) >= 1 && (!count || parseInt(count) > 0))
        {
            this.setState({...this.state, loading: true}, () =>
            {
                api.post("quiz", {title, minutes, count})
                    .then((quiz) =>
                    {
                        const {addQuiz, toggleAddModal} = this.props
                        NotificationManager.success("حله")
                        addQuiz(quiz)
                        toggleAddModal()
                    })
            })
        }
        else
        {
            if (!title) NotificationManager.warning("نام آزمون را وارد کن!")
            if (!(minutes && parseInt(minutes) >= 1)) NotificationManager.warning("محدودیت باید عددی بزرگتر 1 باشد")
            if (count) NotificationManager.warning("تعداد سوالات باید عددی بزرگتر 0 باشد")
        }
    }

    render()
    {
        const {toggleAddModal} = this.props
        const {loading} = this.state
        return (
            <React.Fragment>
                <div className="create-exchange-cont bigger-size create-small">
                    <div className="create-exchange-title">ساخت کوئیز</div>
                    <div className="panel-add-off-main">
                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="نام آزمون *" getValue={this.setTitle}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="محدودیت (دقیقه) *" getValue={this.setMinutes}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="تعداد سوالات مورد مصرف :)" getValue={this.setCount}/>
                        <Material className="panel-add-pav-submit" onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
                <div className="create-exchange-back" onClick={toggleAddModal}/>
            </React.Fragment>
        )
    }
}

export default AddQuiz