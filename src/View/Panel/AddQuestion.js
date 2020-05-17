import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"

class AddQuestion extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    setTitle = value => this.title = value
    setFirst = value => this.first_answer = value
    setSecond = value => this.second_answer = value
    setThird = value => this.third_answer = value
    setForth = value => this.forth_answer = value
    setCorrect = value => this.correct_answer = value

    submit = () =>
    {
        const {quiz_id} = this.props
        const title = this.title?.trim()
        const first_answer = this.first_answer?.trim()
        const second_answer = this.second_answer?.trim()
        const third_answer = this.third_answer?.trim()
        const forth_answer = this.forth_answer?.trim()
        const correct_answer = this.correct_answer?.trim()

        if (title && first_answer && second_answer && third_answer && forth_answer && correct_answer && parseInt(correct_answer) <= 4 && parseInt(correct_answer) >= 1)
        {
            api.post("quiz/question", {title, first_answer, second_answer, third_answer, forth_answer, correct_answer, quiz_id})
                .then((question) =>
                {
                    const {addQuestionFunc, toggleAddModal} = this.props
                    NotificationManager.success("حله")
                    addQuestionFunc(question)
                    toggleAddModal()
                })
        }
        else
        {
            if (!title) NotificationManager.warning("متن سوال را وارد کن!")
            if (!first_answer) NotificationManager.warning("متن گزینه 1 را وارد کن!")
            if (!second_answer) NotificationManager.warning("متن گزینه 2 را وارد کن!")
            if (!third_answer) NotificationManager.warning("متن گزینه 3 را وارد کن!")
            if (!forth_answer) NotificationManager.warning("متن گزینه 4 را وارد کن!")
            if (!(correct_answer && parseInt(correct_answer) <= 4 && parseInt(correct_answer) >= 1)) NotificationManager.warning("گزینه صحیح باید عددی از 1 تا 4 باشد")
        }
    }

    render()
    {
        const {toggleAddModal} = this.props
        const {loading} = this.state
        return (
            <React.Fragment>
                <div className="create-exchange-cont bigger-size create-small">
                    <div className="create-exchange-title">ساخت سوال</div>
                    <div className="panel-add-off-main">
                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="سوال" getValue={this.setTitle}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title" backgroundColor="white" label="گزینه 1" getValue={this.setFirst}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title" backgroundColor="white" label="گزینه 2" getValue={this.setSecond}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title" backgroundColor="white" label="گزینه 3" getValue={this.setThird}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title" backgroundColor="white" label="گزینه 4" getValue={this.setForth}/>
                        <MaterialInput disabled={loading} className="panel-add-pav-title" backgroundColor="white" label="گزینه صحیح" getValue={this.setCorrect}/>
                        <Material className="panel-add-pav-submit" onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
                <div className="create-exchange-back" onClick={toggleAddModal}/>
            </React.Fragment>
        )
    }
}

export default AddQuestion