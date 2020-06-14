import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"
import CameraSvg from "../../Media/Svgs/Camera"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import compressImage from "../../Helpers/compressImage"

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

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.selectedImage = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    removePiv = () =>
    {
        this.selectedImage = null
        this.setState({...this.state, selectedImagePreview: undefined})
    }

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
            const form = new FormData()
            form.append("quiz_id", quiz_id)
            form.append("title", title)
            form.append("first_answer", first_answer)
            form.append("second_answer", second_answer)
            form.append("third_answer", third_answer)
            form.append("forth_answer", forth_answer)
            form.append("correct_answer", correct_answer)
            compressImage(this.selectedImage)
                .then(img =>
                {
                    img && form.append("picture", img)
                    api.post("quiz/question", form)
                        .then((question) =>
                        {
                            const {addQuestionFunc, toggleAddModal} = this.props
                            NotificationManager.success("حله")
                            addQuestionFunc(question)
                            toggleAddModal()
                        })
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
        const {loading, selectedImagePreview, loadingPercent} = this.state
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

                        <label className="panel-add-img" onClick={selectedImagePreview ? this.removePiv : null}>
                            {
                                selectedImagePreview ?
                                    <React.Fragment>
                                        <img src={selectedImagePreview} className="create-exchange-selected-img" alt=""/>
                                        {loading ? <div className="create-exchange-edit-svg">{loadingPercent} %</div> : <CancelSvg className="create-exchange-edit-svg"/>}
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <CameraSvg className="create-exchange-svg"/>
                                        <input disabled={loading} type="file" hidden accept="image/*" onChange={this.selectImage}/>
                                    </React.Fragment>
                            }
                            <div className="create-exchange-selected-uploading" style={{transform: `scaleY(${loadingPercent / 100})`}}/>
                        </label>
                        <Material className="panel-add-pav-submit" onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
                <div className="create-exchange-back" onClick={toggleAddModal}/>
            </React.Fragment>
        )
    }
}

export default AddQuestion